// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

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

    struct ExactOutputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 deadline;
        uint256 amountOut;
        uint256 amountInMaximum;
        uint160 sqrtPriceLimitX96;
    }

    struct ExactInputParams {
        bytes path;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
    }

    function exactInputSingle(ExactInputSingleParams calldata params)
        external
        payable
        returns (uint256 amountOut);

    function exactOutputSingle(ExactOutputSingleParams calldata params)
        external
        payable
        returns (uint256 amountIn);

    function exactInput(ExactInputParams calldata params)
        external
        payable
        returns (uint256 amountOut);
}

/// @title IQuoter
/// @notice Interface for Uniswap V3 Quoter
interface IQuoter {
    function quoteExactInputSingle(
        address tokenIn,
        address tokenOut,
        uint24 fee,
        uint256 amountIn,
        uint160 sqrtPriceLimitX96
    ) external returns (uint256 amountOut);

    function quoteExactOutputSingle(
        address tokenIn,
        address tokenOut,
        uint24 fee,
        uint256 amountOut,
        uint160 sqrtPriceLimitX96
    ) external returns (uint256 amountIn);
}

/// @title SwapExecutor
/// @notice Executes token swaps for WayBank v6.0 rebalancing operations
/// @dev Designed to work alongside existing contracts without modification
contract SwapExecutor is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ============ Immutables ============

    /// @notice Uniswap V3 SwapRouter on Polygon
    ISwapRouter public immutable swapRouter;

    /// @notice Uniswap V3 Quoter on Polygon
    IQuoter public immutable quoter;

    // ============ Constants ============

    /// @notice USDC token address on Polygon (native USDC)
    address public constant USDC = 0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359;

    /// @notice WETH token address on Polygon
    address public constant WETH = 0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619;

    /// @notice WMATIC token address on Polygon
    address public constant WMATIC = 0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270;

    /// @notice Maximum slippage allowed (in basis points)
    uint256 public constant MAX_SLIPPAGE_BPS = 500; // 5%

    // ============ State Variables ============

    /// @notice Mapping of authorized executors
    mapping(address => bool) public authorizedExecutors;

    /// @notice Default slippage tolerance (in basis points)
    uint256 public defaultSlippageBps = 50; // 0.5%

    /// @notice Total volume swapped (in USDC equivalent)
    uint256 public totalVolumeSwapped;

    /// @notice Total number of swaps executed
    uint256 public totalSwapsExecuted;

    // ============ Events ============

    /// @notice Emitted when a swap is executed
    event SwapExecuted(
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        uint24 fee,
        address indexed executor
    );

    /// @notice Emitted when an executor is authorized/deauthorized
    event ExecutorUpdated(address indexed executor, bool authorized);

    /// @notice Emitted when default slippage is updated
    event SlippageUpdated(uint256 newSlippageBps);

    // ============ Modifiers ============

    modifier onlyExecutor() {
        require(authorizedExecutors[msg.sender] || msg.sender == owner(), "Not authorized executor");
        _;
    }

    // ============ Constructor ============

    /// @notice Initialize the SwapExecutor
    /// @param _swapRouter Address of Uniswap V3 SwapRouter
    /// @param _quoter Address of Uniswap V3 Quoter
    constructor(address _swapRouter, address _quoter) Ownable(msg.sender) {
        require(_swapRouter != address(0), "Invalid swap router");
        require(_quoter != address(0), "Invalid quoter");

        swapRouter = ISwapRouter(_swapRouter);
        quoter = IQuoter(_quoter);

        // Owner is automatically an executor
        authorizedExecutors[msg.sender] = true;
    }

    // ============ External Functions - Swaps ============

    /// @notice Execute a single swap with exact input
    /// @param tokenIn Address of input token
    /// @param tokenOut Address of output token
    /// @param fee Pool fee tier
    /// @param amountIn Amount of input token
    /// @param minAmountOut Minimum amount of output token
    /// @return amountOut Actual amount of output token received
    function executeSwap(
        address tokenIn,
        address tokenOut,
        uint24 fee,
        uint256 amountIn,
        uint256 minAmountOut
    ) external onlyExecutor nonReentrant returns (uint256 amountOut) {
        require(tokenIn != address(0) && tokenOut != address(0), "Invalid tokens");
        require(tokenIn != tokenOut, "Same token");
        require(amountIn > 0, "Zero amount");

        // Transfer tokens from caller
        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);

        // Approve router
        IERC20(tokenIn).approve(address(swapRouter), amountIn);

        // Execute swap
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
            tokenIn: tokenIn,
            tokenOut: tokenOut,
            fee: fee,
            recipient: msg.sender,
            deadline: block.timestamp + 600,
            amountIn: amountIn,
            amountOutMinimum: minAmountOut,
            sqrtPriceLimitX96: 0
        });

        amountOut = swapRouter.exactInputSingle(params);

        // Reset approval
        IERC20(tokenIn).approve(address(swapRouter), 0);

        // Update stats
        totalSwapsExecuted++;

        emit SwapExecuted(tokenIn, tokenOut, amountIn, amountOut, fee, msg.sender);
    }

    /// @notice Execute a swap with automatic slippage calculation
    /// @param tokenIn Address of input token
    /// @param tokenOut Address of output token
    /// @param fee Pool fee tier
    /// @param amountIn Amount of input token
    /// @return amountOut Actual amount of output token received
    function executeSwapWithAutoSlippage(
        address tokenIn,
        address tokenOut,
        uint24 fee,
        uint256 amountIn
    ) external onlyExecutor nonReentrant returns (uint256 amountOut) {
        require(tokenIn != address(0) && tokenOut != address(0), "Invalid tokens");
        require(tokenIn != tokenOut, "Same token");
        require(amountIn > 0, "Zero amount");

        // Get quote for expected output
        uint256 expectedOut = quoter.quoteExactInputSingle(
            tokenIn,
            tokenOut,
            fee,
            amountIn,
            0
        );

        // Calculate minimum output with slippage
        uint256 minAmountOut = (expectedOut * (10000 - defaultSlippageBps)) / 10000;

        // Transfer tokens from caller
        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);

        // Approve router
        IERC20(tokenIn).approve(address(swapRouter), amountIn);

        // Execute swap
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
            tokenIn: tokenIn,
            tokenOut: tokenOut,
            fee: fee,
            recipient: msg.sender,
            deadline: block.timestamp + 600,
            amountIn: amountIn,
            amountOutMinimum: minAmountOut,
            sqrtPriceLimitX96: 0
        });

        amountOut = swapRouter.exactInputSingle(params);

        // Reset approval
        IERC20(tokenIn).approve(address(swapRouter), 0);

        // Update stats
        totalSwapsExecuted++;

        emit SwapExecuted(tokenIn, tokenOut, amountIn, amountOut, fee, msg.sender);
    }

    /// @notice Execute a multi-hop swap
    /// @param path Encoded swap path
    /// @param amountIn Amount of input token
    /// @param minAmountOut Minimum amount of output token
    /// @return amountOut Actual amount of output token received
    function executeMultiHopSwap(
        bytes calldata path,
        uint256 amountIn,
        uint256 minAmountOut
    ) external onlyExecutor nonReentrant returns (uint256 amountOut) {
        require(path.length >= 43, "Invalid path"); // Minimum: address + fee + address
        require(amountIn > 0, "Zero amount");

        // Extract tokenIn from path
        address tokenIn;
        assembly {
            tokenIn := shr(96, calldataload(path.offset))
        }

        // Transfer tokens from caller
        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);

        // Approve router
        IERC20(tokenIn).approve(address(swapRouter), amountIn);

        // Execute multi-hop swap
        ISwapRouter.ExactInputParams memory params = ISwapRouter.ExactInputParams({
            path: path,
            recipient: msg.sender,
            deadline: block.timestamp + 600,
            amountIn: amountIn,
            amountOutMinimum: minAmountOut
        });

        amountOut = swapRouter.exactInput(params);

        // Reset approval
        IERC20(tokenIn).approve(address(swapRouter), 0);

        // Update stats
        totalSwapsExecuted++;
    }

    // ============ External Functions - Quotes ============

    /// @notice Get a quote for a swap (call this before executing)
    /// @param tokenIn Address of input token
    /// @param tokenOut Address of output token
    /// @param fee Pool fee tier
    /// @param amountIn Amount of input token
    /// @return expectedAmountOut Expected amount of output token
    function getQuote(
        address tokenIn,
        address tokenOut,
        uint24 fee,
        uint256 amountIn
    ) external returns (uint256 expectedAmountOut) {
        return quoter.quoteExactInputSingle(tokenIn, tokenOut, fee, amountIn, 0);
    }

    /// @notice Get a reverse quote (how much input needed for desired output)
    /// @param tokenIn Address of input token
    /// @param tokenOut Address of output token
    /// @param fee Pool fee tier
    /// @param amountOut Desired amount of output token
    /// @return requiredAmountIn Required amount of input token
    function getReverseQuote(
        address tokenIn,
        address tokenOut,
        uint24 fee,
        uint256 amountOut
    ) external returns (uint256 requiredAmountIn) {
        return quoter.quoteExactOutputSingle(tokenIn, tokenOut, fee, amountOut, 0);
    }

    // ============ Admin Functions ============

    /// @notice Set executor authorization
    /// @param executor Address of the executor
    /// @param authorized Whether to authorize or deauthorize
    function setExecutor(address executor, bool authorized) external onlyOwner {
        require(executor != address(0), "Invalid executor");
        authorizedExecutors[executor] = authorized;
        emit ExecutorUpdated(executor, authorized);
    }

    /// @notice Update default slippage tolerance
    /// @param newSlippageBps New slippage in basis points
    function setDefaultSlippage(uint256 newSlippageBps) external onlyOwner {
        require(newSlippageBps <= MAX_SLIPPAGE_BPS, "Slippage too high");
        defaultSlippageBps = newSlippageBps;
        emit SlippageUpdated(newSlippageBps);
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

    /// @notice Check if an address is an authorized executor
    /// @param executor Address to check
    /// @return isAuthorized Whether the address is authorized
    function isExecutor(address executor) external view returns (bool isAuthorized) {
        return authorizedExecutors[executor];
    }

    /// @notice Get swap statistics
    /// @return swaps Total number of swaps executed
    /// @return volume Total volume swapped
    function getStats() external view returns (uint256 swaps, uint256 volume) {
        return (totalSwapsExecuted, totalVolumeSwapped);
    }

    // ============ Receive ============

    receive() external payable {}
}
