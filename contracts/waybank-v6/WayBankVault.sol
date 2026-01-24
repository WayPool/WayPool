// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title INonfungiblePositionManager
/// @notice Interface for Uniswap V3 NonfungiblePositionManager
interface INonfungiblePositionManager {
    struct CollectParams {
        uint256 tokenId;
        address recipient;
        uint128 amount0Max;
        uint128 amount1Max;
    }

    struct DecreaseLiquidityParams {
        uint256 tokenId;
        uint128 liquidity;
        uint256 amount0Min;
        uint256 amount1Min;
        uint256 deadline;
    }

    struct IncreaseLiquidityParams {
        uint256 tokenId;
        uint256 amount0Desired;
        uint256 amount1Desired;
        uint256 amount0Min;
        uint256 amount1Min;
        uint256 deadline;
    }

    function positions(uint256 tokenId)
        external
        view
        returns (
            uint96 nonce,
            address operator,
            address token0,
            address token1,
            uint24 fee,
            int24 tickLower,
            int24 tickUpper,
            uint128 liquidity,
            uint256 feeGrowthInside0LastX128,
            uint256 feeGrowthInside1LastX128,
            uint128 tokensOwed0,
            uint128 tokensOwed1
        );

    function collect(CollectParams calldata params)
        external
        payable
        returns (uint256 amount0, uint256 amount1);

    function decreaseLiquidity(DecreaseLiquidityParams calldata params)
        external
        payable
        returns (uint256 amount0, uint256 amount1);

    function increaseLiquidity(IncreaseLiquidityParams calldata params)
        external
        payable
        returns (uint128 liquidity, uint256 amount0, uint256 amount1);

    function ownerOf(uint256 tokenId) external view returns (address owner);

    function safeTransferFrom(address from, address to, uint256 tokenId) external;
}

/// @title ISwapRouter
/// @notice Interface for Uniswap V3 SwapRouter
interface ISwapRouter {
    struct ExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }

    function exactInputSingle(ExactInputSingleParams calldata params)
        external
        payable
        returns (uint256 amountOut);
}

/// @title WayBankVault
/// @notice Main vault contract for WayBank v6.0 - Manages NFT positions created by WayPoolPositionCreator
/// @dev This contract is designed to work alongside the existing WayPoolPositionCreator without modifying it
contract WayBankVault is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ============ Immutables ============

    /// @notice Uniswap V3 NonfungiblePositionManager on Polygon
    INonfungiblePositionManager public immutable positionManager;

    /// @notice Uniswap V3 SwapRouter on Polygon
    ISwapRouter public immutable swapRouter;

    // ============ Constants ============

    /// @notice USDC token address on Polygon (native USDC)
    address public constant USDC = 0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359;

    /// @notice WETH token address on Polygon
    address public constant WETH = 0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619;

    /// @notice Maximum basis points (100%)
    uint256 public constant MAX_BPS = 10000;

    // ============ State Variables ============

    /// @notice Mapping of registered NFT positions (tokenId => isRegistered)
    mapping(uint256 => bool) public registeredPositions;

    /// @notice Mapping of position owners (tokenId => owner)
    mapping(uint256 => address) public positionOwners;

    /// @notice Mapping of authorized operators (address => isAuthorized)
    mapping(address => bool) public authorizedOperators;

    /// @notice Fee percentage for vault operations (in basis points)
    uint256 public vaultFeeBps = 100; // 1% default

    /// @notice Treasury address for collecting fees
    address public treasury;

    /// @notice Array of all registered position IDs
    uint256[] public allPositionIds;

    /// @notice Total fees collected in USDC
    uint256 public totalFeesCollectedUSDC;

    /// @notice Total fees collected in WETH
    uint256 public totalFeesCollectedWETH;

    // ============ Events ============

    /// @notice Emitted when a position is registered for management
    event PositionRegistered(
        uint256 indexed tokenId,
        address indexed owner,
        address token0,
        address token1,
        uint24 fee
    );

    /// @notice Emitted when a position is unregistered
    event PositionUnregistered(uint256 indexed tokenId, address indexed owner);

    /// @notice Emitted when fees are collected from a position
    event FeesCollected(
        uint256 indexed tokenId,
        uint256 amount0,
        uint256 amount1,
        uint256 feeAmount0,
        uint256 feeAmount1
    );

    /// @notice Emitted when liquidity is rebalanced
    event LiquidityRebalanced(
        uint256 indexed tokenId,
        uint128 liquidityRemoved,
        uint256 amount0,
        uint256 amount1
    );

    /// @notice Emitted when an operator is authorized/deauthorized
    event OperatorUpdated(address indexed operator, bool authorized);

    /// @notice Emitted when vault fee is updated
    event VaultFeeUpdated(uint256 newFeeBps);

    /// @notice Emitted when treasury is updated
    event TreasuryUpdated(address newTreasury);

    // ============ Modifiers ============

    modifier onlyOperator() {
        require(authorizedOperators[msg.sender] || msg.sender == owner(), "Not authorized operator");
        _;
    }

    modifier onlyPositionOwner(uint256 tokenId) {
        require(positionOwners[tokenId] == msg.sender, "Not position owner");
        _;
    }

    // ============ Constructor ============

    /// @notice Initialize the WayBankVault
    /// @param _positionManager Address of Uniswap V3 NonfungiblePositionManager
    /// @param _swapRouter Address of Uniswap V3 SwapRouter
    /// @param _treasury Address for collecting fees
    constructor(
        address _positionManager,
        address _swapRouter,
        address _treasury
    ) Ownable(msg.sender) {
        require(_positionManager != address(0), "Invalid position manager");
        require(_swapRouter != address(0), "Invalid swap router");
        require(_treasury != address(0), "Invalid treasury");

        positionManager = INonfungiblePositionManager(_positionManager);
        swapRouter = ISwapRouter(_swapRouter);
        treasury = _treasury;

        // Owner is automatically an operator
        authorizedOperators[msg.sender] = true;
    }

    // ============ External Functions - Position Registration ============

    /// @notice Register an existing NFT position for vault management
    /// @dev Position must already exist and caller must be the owner
    /// @param tokenId The NFT token ID to register
    function registerPosition(uint256 tokenId) external nonReentrant {
        require(!registeredPositions[tokenId], "Position already registered");

        // Verify caller owns the NFT
        address nftOwner = positionManager.ownerOf(tokenId);
        require(nftOwner == msg.sender, "Caller must own the NFT");

        // Get position details
        (
            ,
            ,
            address token0,
            address token1,
            uint24 fee,
            ,
            ,
            uint128 liquidity,
            ,
            ,
            ,
        ) = positionManager.positions(tokenId);

        require(liquidity > 0, "Position has no liquidity");

        // Register the position
        registeredPositions[tokenId] = true;
        positionOwners[tokenId] = msg.sender;
        allPositionIds.push(tokenId);

        emit PositionRegistered(tokenId, msg.sender, token0, token1, fee);
    }

    /// @notice Unregister a position from vault management
    /// @param tokenId The NFT token ID to unregister
    function unregisterPosition(uint256 tokenId) external onlyPositionOwner(tokenId) nonReentrant {
        require(registeredPositions[tokenId], "Position not registered");

        registeredPositions[tokenId] = false;
        delete positionOwners[tokenId];

        // Remove from array (swap and pop)
        for (uint256 i = 0; i < allPositionIds.length; i++) {
            if (allPositionIds[i] == tokenId) {
                allPositionIds[i] = allPositionIds[allPositionIds.length - 1];
                allPositionIds.pop();
                break;
            }
        }

        emit PositionUnregistered(tokenId, msg.sender);
    }

    // ============ External Functions - Fee Collection ============

    /// @notice Collect fees from a registered position
    /// @param tokenId The NFT token ID
    /// @return amount0 Amount of token0 collected (after vault fee)
    /// @return amount1 Amount of token1 collected (after vault fee)
    function collectFees(uint256 tokenId)
        external
        onlyOperator
        nonReentrant
        returns (uint256 amount0, uint256 amount1)
    {
        require(registeredPositions[tokenId], "Position not registered");

        // Get the position owner
        address owner_ = positionOwners[tokenId];

        // Collect all fees
        INonfungiblePositionManager.CollectParams memory params = INonfungiblePositionManager.CollectParams({
            tokenId: tokenId,
            recipient: address(this),
            amount0Max: type(uint128).max,
            amount1Max: type(uint128).max
        });

        (uint256 collected0, uint256 collected1) = positionManager.collect(params);

        // Calculate vault fees
        uint256 fee0 = (collected0 * vaultFeeBps) / MAX_BPS;
        uint256 fee1 = (collected1 * vaultFeeBps) / MAX_BPS;

        // Transfer fees to treasury
        if (fee0 > 0) {
            (,, address token0,,,,,,,,,) = positionManager.positions(tokenId);
            IERC20(token0).safeTransfer(treasury, fee0);
            if (token0 == USDC) totalFeesCollectedUSDC += fee0;
            else if (token0 == WETH) totalFeesCollectedWETH += fee0;
        }
        if (fee1 > 0) {
            (,,, address token1,,,,,,,,) = positionManager.positions(tokenId);
            IERC20(token1).safeTransfer(treasury, fee1);
            if (token1 == USDC) totalFeesCollectedUSDC += fee1;
            else if (token1 == WETH) totalFeesCollectedWETH += fee1;
        }

        // Transfer remaining to position owner
        amount0 = collected0 - fee0;
        amount1 = collected1 - fee1;

        if (amount0 > 0) {
            (,, address token0,,,,,,,,,) = positionManager.positions(tokenId);
            IERC20(token0).safeTransfer(owner_, amount0);
        }
        if (amount1 > 0) {
            (,,, address token1,,,,,,,,) = positionManager.positions(tokenId);
            IERC20(token1).safeTransfer(owner_, amount1);
        }

        emit FeesCollected(tokenId, amount0, amount1, fee0, fee1);
    }

    /// @notice Batch collect fees from multiple positions
    /// @param tokenIds Array of NFT token IDs
    function batchCollectFees(uint256[] calldata tokenIds) external onlyOperator nonReentrant {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (registeredPositions[tokenIds[i]]) {
                // Internal call to avoid reentrancy issues
                _collectFeesInternal(tokenIds[i]);
            }
        }
    }

    // ============ External Functions - Liquidity Management ============

    /// @notice Remove liquidity from a position (for rebalancing)
    /// @param tokenId The NFT token ID
    /// @param liquidityToRemove Amount of liquidity to remove
    /// @return amount0 Amount of token0 received
    /// @return amount1 Amount of token1 received
    function decreaseLiquidity(
        uint256 tokenId,
        uint128 liquidityToRemove
    ) external onlyOperator nonReentrant returns (uint256 amount0, uint256 amount1) {
        require(registeredPositions[tokenId], "Position not registered");

        INonfungiblePositionManager.DecreaseLiquidityParams memory params = INonfungiblePositionManager.DecreaseLiquidityParams({
            tokenId: tokenId,
            liquidity: liquidityToRemove,
            amount0Min: 0,
            amount1Min: 0,
            deadline: block.timestamp + 600
        });

        (amount0, amount1) = positionManager.decreaseLiquidity(params);

        emit LiquidityRebalanced(tokenId, liquidityToRemove, amount0, amount1);
    }

    // ============ Admin Functions ============

    /// @notice Set operator authorization
    /// @param operator Address of the operator
    /// @param authorized Whether to authorize or deauthorize
    function setOperator(address operator, bool authorized) external onlyOwner {
        require(operator != address(0), "Invalid operator");
        authorizedOperators[operator] = authorized;
        emit OperatorUpdated(operator, authorized);
    }

    /// @notice Update vault fee percentage
    /// @param newFeeBps New fee in basis points (max 1000 = 10%)
    function setVaultFee(uint256 newFeeBps) external onlyOwner {
        require(newFeeBps <= 1000, "Fee too high"); // Max 10%
        vaultFeeBps = newFeeBps;
        emit VaultFeeUpdated(newFeeBps);
    }

    /// @notice Update treasury address
    /// @param newTreasury New treasury address
    function setTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "Invalid treasury");
        treasury = newTreasury;
        emit TreasuryUpdated(newTreasury);
    }

    /// @notice Rescue tokens accidentally sent to this contract
    /// @param token Address of the token to rescue
    function rescueTokens(address token) external onlyOwner {
        require(token != address(0), "Invalid token");
        uint256 balance = IERC20(token).balanceOf(address(this));
        require(balance > 0, "No tokens to rescue");
        IERC20(token).safeTransfer(owner(), balance);
    }

    /// @notice Rescue native currency accidentally sent to this contract
    function rescueNative() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No native to rescue");
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Transfer failed");
    }

    // ============ View Functions ============

    /// @notice Get all registered position IDs
    /// @return Array of registered token IDs
    function getAllPositionIds() external view returns (uint256[] memory) {
        return allPositionIds;
    }

    /// @notice Get the number of registered positions
    /// @return count Number of registered positions
    function getPositionCount() external view returns (uint256 count) {
        return allPositionIds.length;
    }

    /// @notice Get position details
    /// @param tokenId The NFT token ID
    /// @return token0 Address of token0
    /// @return token1 Address of token1
    /// @return fee Fee tier
    /// @return tickLower Lower tick
    /// @return tickUpper Upper tick
    /// @return liquidity Current liquidity
    function getPositionDetails(uint256 tokenId) external view returns (
        address token0,
        address token1,
        uint24 fee,
        int24 tickLower,
        int24 tickUpper,
        uint128 liquidity
    ) {
        (
            ,
            ,
            token0,
            token1,
            fee,
            tickLower,
            tickUpper,
            liquidity,
            ,
            ,
            ,
        ) = positionManager.positions(tokenId);
    }

    /// @notice Check if a position is registered
    /// @param tokenId The NFT token ID
    /// @return isRegistered Whether the position is registered
    function isPositionRegistered(uint256 tokenId) external view returns (bool isRegistered) {
        return registeredPositions[tokenId];
    }

    /// @notice Get the owner of a registered position
    /// @param tokenId The NFT token ID
    /// @return owner_ Address of the position owner
    function getPositionOwner(uint256 tokenId) external view returns (address owner_) {
        return positionOwners[tokenId];
    }

    // ============ Internal Functions ============

    /// @notice Internal function to collect fees (used by batch operations)
    function _collectFeesInternal(uint256 tokenId) internal {
        address owner_ = positionOwners[tokenId];

        INonfungiblePositionManager.CollectParams memory params = INonfungiblePositionManager.CollectParams({
            tokenId: tokenId,
            recipient: address(this),
            amount0Max: type(uint128).max,
            amount1Max: type(uint128).max
        });

        (uint256 collected0, uint256 collected1) = positionManager.collect(params);

        if (collected0 == 0 && collected1 == 0) return;

        uint256 fee0 = (collected0 * vaultFeeBps) / MAX_BPS;
        uint256 fee1 = (collected1 * vaultFeeBps) / MAX_BPS;

        (,, address token0, address token1,,,,,,,,) = positionManager.positions(tokenId);

        if (fee0 > 0) {
            IERC20(token0).safeTransfer(treasury, fee0);
            if (token0 == USDC) totalFeesCollectedUSDC += fee0;
            else if (token0 == WETH) totalFeesCollectedWETH += fee0;
        }
        if (fee1 > 0) {
            IERC20(token1).safeTransfer(treasury, fee1);
            if (token1 == USDC) totalFeesCollectedUSDC += fee1;
            else if (token1 == WETH) totalFeesCollectedWETH += fee1;
        }

        uint256 amount0 = collected0 - fee0;
        uint256 amount1 = collected1 - fee1;

        if (amount0 > 0) IERC20(token0).safeTransfer(owner_, amount0);
        if (amount1 > 0) IERC20(token1).safeTransfer(owner_, amount1);

        emit FeesCollected(tokenId, amount0, amount1, fee0, fee1);
    }

    // ============ Receive ============

    receive() external payable {}
}
