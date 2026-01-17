// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title INonfungiblePositionManager
/// @notice Interface for Uniswap V3 NonfungiblePositionManager
interface INonfungiblePositionManager {
    struct MintParams {
        address token0;
        address token1;
        uint24 fee;
        int24 tickLower;
        int24 tickUpper;
        uint256 amount0Desired;
        uint256 amount1Desired;
        uint256 amount0Min;
        uint256 amount1Min;
        address recipient;
        uint256 deadline;
    }

    function mint(MintParams calldata params)
        external
        payable
        returns (
            uint256 tokenId,
            uint128 liquidity,
            uint256 amount0,
            uint256 amount1
        );

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
}

/// @title WayPoolPositionCreator
/// @notice Helper contract to create Uniswap V3 liquidity positions with minimal amounts
/// @dev Designed for WayPool users to register positions with minimal capital
contract WayPoolPositionCreator is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ============ Constants ============

    /// @notice Uniswap V3 NonfungiblePositionManager on Polygon
    INonfungiblePositionManager public immutable positionManager;

    /// @notice USDC token address on Polygon (native USDC)
    address public constant USDC = 0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359;

    /// @notice WETH token address on Polygon
    address public constant WETH = 0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619;

    /// @notice Default fee tier (0.05% = 500)
    uint24 public constant DEFAULT_FEE = 500;

    // ============ State Variables ============

    /// @notice Minimum amount for token0 (USDC has 6 decimals)
    uint256 public minAmount0 = 1; // 1 wei = 0.000001 USDC

    /// @notice Minimum amount for token1 (WETH has 18 decimals)
    uint256 public minAmount1 = 1; // 1 wei = 0.000000000000000001 ETH

    /// @notice Counter for positions created through this contract
    uint256 public positionsCreated;

    // ============ Events ============

    /// @notice Emitted when a new position is created
    event PositionCreated(
        address indexed user,
        uint256 indexed tokenId,
        address token0,
        address token1,
        uint24 fee,
        int24 tickLower,
        int24 tickUpper,
        uint128 liquidity,
        uint256 amount0,
        uint256 amount1
    );

    /// @notice Emitted when minimum amounts are updated
    event MinAmountsUpdated(uint256 newMinAmount0, uint256 newMinAmount1);

    /// @notice Emitted when tokens are rescued
    event TokensRescued(address indexed token, uint256 amount);

    // ============ Constructor ============

    /// @notice Initialize the contract with the Uniswap V3 Position Manager
    /// @param _positionManager Address of the NonfungiblePositionManager
    constructor(address _positionManager) Ownable(msg.sender) {
        require(_positionManager != address(0), "Invalid position manager");
        positionManager = INonfungiblePositionManager(_positionManager);
    }

    // ============ External Functions ============

    /// @notice Create a minimal liquidity position in the default USDC/WETH pool
    /// @dev User must approve minAmount0 of USDC and minAmount1 of WETH before calling
    /// @param tickLower The lower tick of the position's price range
    /// @param tickUpper The upper tick of the position's price range
    /// @return tokenId The ID of the newly minted NFT position
    /// @return liquidity The amount of liquidity added to the position
    function createMinimalPosition(
        int24 tickLower,
        int24 tickUpper
    ) external nonReentrant returns (uint256 tokenId, uint128 liquidity) {
        return _createPosition(
            USDC,
            WETH,
            DEFAULT_FEE,
            tickLower,
            tickUpper,
            minAmount0,
            minAmount1
        );
    }

    /// @notice Create a liquidity position with custom parameters
    /// @dev User must approve the specified amounts before calling
    /// @param token0 Address of the first token
    /// @param token1 Address of the second token
    /// @param fee The fee tier of the pool (500, 3000, or 10000)
    /// @param tickLower The lower tick of the position's price range
    /// @param tickUpper The upper tick of the position's price range
    /// @param amount0Desired Desired amount of token0
    /// @param amount1Desired Desired amount of token1
    /// @return tokenId The ID of the newly minted NFT position
    /// @return liquidity The amount of liquidity added to the position
    function createPosition(
        address token0,
        address token1,
        uint24 fee,
        int24 tickLower,
        int24 tickUpper,
        uint256 amount0Desired,
        uint256 amount1Desired
    ) external nonReentrant returns (uint256 tokenId, uint128 liquidity) {
        require(token0 != address(0) && token1 != address(0), "Invalid tokens");
        require(token0 != token1, "Identical tokens");
        require(fee == 500 || fee == 3000 || fee == 10000, "Invalid fee tier");
        require(tickLower < tickUpper, "Invalid tick range");
        require(amount0Desired > 0 || amount1Desired > 0, "Zero amounts");

        return _createPosition(
            token0,
            token1,
            fee,
            tickLower,
            tickUpper,
            amount0Desired,
            amount1Desired
        );
    }

    // ============ Owner Functions ============

    /// @notice Update the minimum amounts required for minimal positions
    /// @param _minAmount0 New minimum amount for token0
    /// @param _minAmount1 New minimum amount for token1
    function setMinAmounts(uint256 _minAmount0, uint256 _minAmount1) external onlyOwner {
        require(_minAmount0 > 0 || _minAmount1 > 0, "Both cannot be zero");
        minAmount0 = _minAmount0;
        minAmount1 = _minAmount1;
        emit MinAmountsUpdated(_minAmount0, _minAmount1);
    }

    /// @notice Rescue tokens accidentally sent to this contract
    /// @param token Address of the token to rescue
    function rescueTokens(address token) external onlyOwner {
        require(token != address(0), "Invalid token");
        uint256 balance = IERC20(token).balanceOf(address(this));
        require(balance > 0, "No tokens to rescue");
        IERC20(token).safeTransfer(owner(), balance);
        emit TokensRescued(token, balance);
    }

    /// @notice Rescue native currency (MATIC) accidentally sent to this contract
    function rescueNative() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No native to rescue");
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Transfer failed");
    }

    // ============ Internal Functions ============

    /// @notice Internal function to create a liquidity position
    function _createPosition(
        address token0,
        address token1,
        uint24 fee,
        int24 tickLower,
        int24 tickUpper,
        uint256 amount0Desired,
        uint256 amount1Desired
    ) internal returns (uint256 tokenId, uint128 liquidity) {
        // Sort tokens (Uniswap requires token0 < token1)
        (address tokenA, address tokenB, uint256 amountA, uint256 amountB) =
            token0 < token1
                ? (token0, token1, amount0Desired, amount1Desired)
                : (token1, token0, amount1Desired, amount0Desired);

        // Transfer tokens from user to this contract
        if (amountA > 0) {
            IERC20(tokenA).safeTransferFrom(msg.sender, address(this), amountA);
            IERC20(tokenA).approve(address(positionManager), amountA);
        }
        if (amountB > 0) {
            IERC20(tokenB).safeTransferFrom(msg.sender, address(this), amountB);
            IERC20(tokenB).approve(address(positionManager), amountB);
        }

        // Create the mint params
        INonfungiblePositionManager.MintParams memory params =
            INonfungiblePositionManager.MintParams({
                token0: tokenA,
                token1: tokenB,
                fee: fee,
                tickLower: tickLower,
                tickUpper: tickUpper,
                amount0Desired: amountA,
                amount1Desired: amountB,
                amount0Min: 0, // Accept any amount for minimal positions
                amount1Min: 0,
                recipient: msg.sender, // NFT goes directly to user
                deadline: block.timestamp + 600 // 10 minute deadline
            });

        // Mint the position
        uint256 amount0Used;
        uint256 amount1Used;
        (tokenId, liquidity, amount0Used, amount1Used) = positionManager.mint(params);

        // Refund any unused tokens
        if (amountA > amount0Used) {
            IERC20(tokenA).safeTransfer(msg.sender, amountA - amount0Used);
        }
        if (amountB > amount1Used) {
            IERC20(tokenB).safeTransfer(msg.sender, amountB - amount1Used);
        }

        // Reset approvals for safety
        IERC20(tokenA).approve(address(positionManager), 0);
        IERC20(tokenB).approve(address(positionManager), 0);

        // Increment counter
        positionsCreated++;

        // Emit event with original token order
        emit PositionCreated(
            msg.sender,
            tokenId,
            token0,
            token1,
            fee,
            tickLower,
            tickUpper,
            liquidity,
            token0 < token1 ? amount0Used : amount1Used,
            token0 < token1 ? amount1Used : amount0Used
        );

        return (tokenId, liquidity);
    }

    // ============ View Functions ============

    /// @notice Get the default pool configuration
    /// @return token0 Default token0 address (USDC)
    /// @return token1 Default token1 address (WETH)
    /// @return fee Default fee tier
    /// @return minAmt0 Minimum amount for token0
    /// @return minAmt1 Minimum amount for token1
    function getDefaultConfig() external view returns (
        address token0,
        address token1,
        uint24 fee,
        uint256 minAmt0,
        uint256 minAmt1
    ) {
        return (USDC, WETH, DEFAULT_FEE, minAmount0, minAmount1);
    }

    /// @notice Check if the contract can receive native currency
    receive() external payable {}
}
