// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title WBCToken
 * @notice WayBank Coin - Token de representación de capital en posiciones de liquidez
 * @dev ERC20 con transferencias restringidas: solo owner↔user
 *
 * Reglas de transferencia:
 * - Owner puede enviar WBC a cualquier usuario
 * - Usuarios SOLO pueden enviar WBC de vuelta al owner
 * - Transferencias entre usuarios están PROHIBIDAS
 * - approve/transferFrom están DESHABILITADOS
 *
 * Ratio: 1 WBC = 1 USDC (siempre)
 * Decimales: 6 (igual que USDC)
 */
contract WBCToken is ERC20, Ownable, Pausable {

    // ============ Events ============

    /// @notice Emitido cuando el owner envía tokens a un usuario
    event TokensSentToUser(
        address indexed user,
        uint256 amount,
        uint256 positionId,
        string reason
    );

    /// @notice Emitido cuando un usuario devuelve tokens al owner
    event TokensReturnedFromUser(
        address indexed user,
        uint256 amount,
        uint256 positionId,
        string reason
    );

    /// @notice Emitido cuando se mintean tokens
    event TokensMinted(
        address indexed to,
        uint256 amount
    );

    /// @notice Emitido cuando se queman tokens
    event TokensBurned(
        address indexed from,
        uint256 amount
    );

    // ============ State Variables ============

    /// @notice Total de WBC distribuidos a usuarios (tracking)
    uint256 public totalDistributedToUsers;

    /// @notice Total de WBC retornados por usuarios (tracking)
    uint256 public totalReturnedFromUsers;

    /// @notice Mapping de posición ID a cantidad de WBC minteados
    mapping(uint256 => uint256) public positionWBCMinted;

    /// @notice Mapping de posición ID a cantidad de WBC retornados
    mapping(uint256 => uint256) public positionWBCReturned;

    // ============ Constructor ============

    constructor() ERC20("WayBank Coin", "WBC") Ownable(msg.sender) {
        // El supply inicial se minteará después del despliegue
    }

    // ============ Owner Functions ============

    /**
     * @notice Mintea tokens WBC (solo owner)
     * @param to Dirección del destinatario
     * @param amount Cantidad de tokens (6 decimales)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "WBC: Cannot mint to zero address");
        require(amount > 0, "WBC: Amount must be greater than 0");
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    /**
     * @notice Quema tokens WBC (solo owner, solo de su balance)
     * @param amount Cantidad de tokens a quemar
     */
    function burn(uint256 amount) external onlyOwner {
        require(amount > 0, "WBC: Amount must be greater than 0");
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }

    /**
     * @notice Pausa todas las transferencias (emergencia)
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Reactiva las transferencias
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Enviar WBC a un usuario con tracking de posición
     * @param to Dirección del usuario
     * @param amount Cantidad de WBC
     * @param positionId ID de la posición asociada
     * @param reason Razón de la transferencia (activation, daily_fee, etc)
     */
    function sendToUser(
        address to,
        uint256 amount,
        uint256 positionId,
        string calldata reason
    ) external onlyOwner whenNotPaused {
        require(to != address(0), "WBC: Cannot send to zero address");
        require(amount > 0, "WBC: Amount must be greater than 0");

        _transfer(msg.sender, to, amount);

        totalDistributedToUsers += amount;
        positionWBCMinted[positionId] += amount;

        emit TokensSentToUser(to, amount, positionId, reason);
    }

    // ============ Transfer Override ============

    /**
     * @notice Override de transfer con restricciones
     * @dev Solo permite: owner→cualquiera o cualquiera→owner
     */
    function transfer(address to, uint256 amount) public override whenNotPaused returns (bool) {
        address sender = _msgSender();

        // Owner puede enviar a cualquier dirección
        if (sender == owner()) {
            _transfer(sender, to, amount);
            totalDistributedToUsers += amount;
            emit TokensSentToUser(to, amount, 0, "owner_transfer");
            return true;
        }

        // Usuarios solo pueden enviar al owner
        require(to == owner(), "WBC: Can only transfer to owner");
        _transfer(sender, to, amount);
        totalReturnedFromUsers += amount;
        emit TokensReturnedFromUser(sender, amount, 0, "user_return");
        return true;
    }

    /**
     * @notice Usuario devuelve WBC al owner con tracking
     * @param amount Cantidad de WBC a devolver
     * @param positionId ID de la posición asociada
     * @param reason Razón (collect, close, etc)
     */
    function returnToOwner(
        uint256 amount,
        uint256 positionId,
        string calldata reason
    ) external whenNotPaused {
        address sender = _msgSender();
        require(sender != owner(), "WBC: Owner cannot use this function");
        require(amount > 0, "WBC: Amount must be greater than 0");
        require(balanceOf(sender) >= amount, "WBC: Insufficient balance");

        _transfer(sender, owner(), amount);

        totalReturnedFromUsers += amount;
        positionWBCReturned[positionId] += amount;

        emit TokensReturnedFromUser(sender, amount, positionId, reason);
    }

    // ============ Disabled Functions ============

    /**
     * @notice Deshabilitamos approve para prevenir transferencias delegadas
     */
    function approve(address, uint256) public pure override returns (bool) {
        revert("WBC: Approvals not allowed");
    }

    /**
     * @notice Deshabilitamos transferFrom
     */
    function transferFrom(address, address, uint256) public pure override returns (bool) {
        revert("WBC: TransferFrom not allowed");
    }

    // ============ View Functions ============

    /**
     * @notice Devuelve 6 decimales (igual que USDC)
     */
    function decimals() public pure override returns (uint8) {
        return 6;
    }

    /**
     * @notice Obtiene el balance neto de una posición (minteado - retornado)
     * @param positionId ID de la posición
     */
    function getPositionNetWBC(uint256 positionId) external view returns (uint256) {
        uint256 minted = positionWBCMinted[positionId];
        uint256 returned = positionWBCReturned[positionId];

        if (returned >= minted) {
            return 0;
        }
        return minted - returned;
    }

    /**
     * @notice Obtiene estadísticas generales del token
     */
    function getStats() external view returns (
        uint256 _totalSupply,
        uint256 _ownerBalance,
        uint256 _distributedToUsers,
        uint256 _returnedFromUsers,
        uint256 _netDistributed
    ) {
        _totalSupply = totalSupply();
        _ownerBalance = balanceOf(owner());
        _distributedToUsers = totalDistributedToUsers;
        _returnedFromUsers = totalReturnedFromUsers;
        _netDistributed = totalDistributedToUsers > totalReturnedFromUsers
            ? totalDistributedToUsers - totalReturnedFromUsers
            : 0;
    }
}
