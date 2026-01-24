// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title IUniswapV3Pool
/// @notice Interface for Uniswap V3 Pool
interface IUniswapV3Pool {
    function slot0()
        external
        view
        returns (
            uint160 sqrtPriceX96,
            int24 tick,
            uint16 observationIndex,
            uint16 observationCardinality,
            uint16 observationCardinalityNext,
            uint8 feeProtocol,
            bool unlocked
        );

    function liquidity() external view returns (uint128);

    function token0() external view returns (address);

    function token1() external view returns (address);

    function fee() external view returns (uint24);

    function tickSpacing() external view returns (int24);

    function observe(uint32[] calldata secondsAgos)
        external
        view
        returns (
            int56[] memory tickCumulatives,
            uint160[] memory secondsPerLiquidityCumulativeX128s
        );
}

/// @title IUniswapV3Factory
/// @notice Interface for Uniswap V3 Factory
interface IUniswapV3Factory {
    function getPool(
        address tokenA,
        address tokenB,
        uint24 fee
    ) external view returns (address pool);
}

/// @title PoolAnalyzer
/// @notice Analyzes Uniswap V3 pools for WayBank v6.0
/// @dev This is a view-only contract for pool analysis - no state modifications
contract PoolAnalyzer is Ownable {
    // ============ Constants ============

    /// @notice Uniswap V3 Factory on Polygon
    IUniswapV3Factory public immutable factory;

    /// @notice Common fee tiers
    uint24 public constant FEE_LOW = 500;      // 0.05%
    uint24 public constant FEE_MEDIUM = 3000;  // 0.3%
    uint24 public constant FEE_HIGH = 10000;   // 1%

    /// @notice Tick spacing for each fee tier
    int24 public constant TICK_SPACING_LOW = 10;
    int24 public constant TICK_SPACING_MEDIUM = 60;
    int24 public constant TICK_SPACING_HIGH = 200;

    /// @notice USDC token address on Polygon
    address public constant USDC = 0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359;

    /// @notice WETH token address on Polygon
    address public constant WETH = 0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619;

    /// @notice WMATIC token address on Polygon
    address public constant WMATIC = 0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270;

    /// @notice WBTC token address on Polygon
    address public constant WBTC = 0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6;

    // ============ Structs ============

    /// @notice Pool information structure
    struct PoolInfo {
        address poolAddress;
        address token0;
        address token1;
        uint24 fee;
        uint160 sqrtPriceX96;
        int24 currentTick;
        uint128 liquidity;
        int24 tickSpacing;
    }

    /// @notice Pool analysis result
    struct PoolAnalysis {
        address poolAddress;
        uint24 fee;
        uint128 liquidity;
        int24 currentTick;
        int24 recommendedTickLower;
        int24 recommendedTickUpper;
        uint256 estimatedAPR; // In basis points (100 = 1%)
        bool isActive;
    }

    // ============ Events ============

    event PoolAnalyzed(
        address indexed pool,
        uint24 fee,
        uint128 liquidity,
        int24 currentTick
    );

    // ============ Constructor ============

    /// @notice Initialize the PoolAnalyzer
    /// @param _factory Address of Uniswap V3 Factory
    constructor(address _factory) Ownable(msg.sender) {
        require(_factory != address(0), "Invalid factory");
        factory = IUniswapV3Factory(_factory);
    }

    // ============ External View Functions ============

    /// @notice Get pool information for a token pair
    /// @param tokenA First token address
    /// @param tokenB Second token address
    /// @param fee Fee tier
    /// @return info Pool information
    function getPoolInfo(
        address tokenA,
        address tokenB,
        uint24 fee
    ) external view returns (PoolInfo memory info) {
        address poolAddress = factory.getPool(tokenA, tokenB, fee);
        require(poolAddress != address(0), "Pool does not exist");

        IUniswapV3Pool pool = IUniswapV3Pool(poolAddress);

        (
            uint160 sqrtPriceX96,
            int24 tick,
            ,
            ,
            ,
            ,
        ) = pool.slot0();

        info = PoolInfo({
            poolAddress: poolAddress,
            token0: pool.token0(),
            token1: pool.token1(),
            fee: pool.fee(),
            sqrtPriceX96: sqrtPriceX96,
            currentTick: tick,
            liquidity: pool.liquidity(),
            tickSpacing: pool.tickSpacing()
        });
    }

    /// @notice Analyze a pool and get recommendations
    /// @param tokenA First token address
    /// @param tokenB Second token address
    /// @param fee Fee tier
    /// @param rangeWidthTicks Width of the recommended range in ticks
    /// @return analysis Pool analysis with recommendations
    function analyzePool(
        address tokenA,
        address tokenB,
        uint24 fee,
        int24 rangeWidthTicks
    ) external view returns (PoolAnalysis memory analysis) {
        address poolAddress = factory.getPool(tokenA, tokenB, fee);
        require(poolAddress != address(0), "Pool does not exist");

        IUniswapV3Pool pool = IUniswapV3Pool(poolAddress);

        (
            ,
            int24 currentTick,
            ,
            ,
            ,
            ,
        ) = pool.slot0();

        uint128 liquidity = pool.liquidity();
        int24 tickSpacing = pool.tickSpacing();

        // Calculate recommended tick range centered on current tick
        int24 halfRange = rangeWidthTicks / 2;
        int24 tickLower = _roundDownToTickSpacing(currentTick - halfRange, tickSpacing);
        int24 tickUpper = _roundUpToTickSpacing(currentTick + halfRange, tickSpacing);

        // Estimate APR based on fee tier and liquidity (simplified)
        uint256 estimatedAPR = _estimateAPR(fee, liquidity);

        analysis = PoolAnalysis({
            poolAddress: poolAddress,
            fee: fee,
            liquidity: liquidity,
            currentTick: currentTick,
            recommendedTickLower: tickLower,
            recommendedTickUpper: tickUpper,
            estimatedAPR: estimatedAPR,
            isActive: liquidity > 0
        });
    }

    /// @notice Analyze multiple pools for a token pair
    /// @param tokenA First token address
    /// @param tokenB Second token address
    /// @return analyses Array of pool analyses for each fee tier
    function analyzeAllFeeTiers(
        address tokenA,
        address tokenB
    ) external view returns (PoolAnalysis[] memory analyses) {
        uint24[3] memory feeTiers = [FEE_LOW, FEE_MEDIUM, FEE_HIGH];
        analyses = new PoolAnalysis[](3);

        for (uint256 i = 0; i < 3; i++) {
            address poolAddress = factory.getPool(tokenA, tokenB, feeTiers[i]);

            if (poolAddress != address(0)) {
                IUniswapV3Pool pool = IUniswapV3Pool(poolAddress);

                (
                    ,
                    int24 currentTick,
                    ,
                    ,
                    ,
                    ,
                ) = pool.slot0();

                uint128 liquidity = pool.liquidity();
                int24 tickSpacing = pool.tickSpacing();

                // Default range width based on fee tier
                int24 rangeWidth = _getDefaultRangeWidth(feeTiers[i]);
                int24 halfRange = rangeWidth / 2;

                analyses[i] = PoolAnalysis({
                    poolAddress: poolAddress,
                    fee: feeTiers[i],
                    liquidity: liquidity,
                    currentTick: currentTick,
                    recommendedTickLower: _roundDownToTickSpacing(currentTick - halfRange, tickSpacing),
                    recommendedTickUpper: _roundUpToTickSpacing(currentTick + halfRange, tickSpacing),
                    estimatedAPR: _estimateAPR(feeTiers[i], liquidity),
                    isActive: liquidity > 0
                });
            } else {
                analyses[i] = PoolAnalysis({
                    poolAddress: address(0),
                    fee: feeTiers[i],
                    liquidity: 0,
                    currentTick: 0,
                    recommendedTickLower: 0,
                    recommendedTickUpper: 0,
                    estimatedAPR: 0,
                    isActive: false
                });
            }
        }
    }

    /// @notice Get current tick for a pool
    /// @param poolAddress Address of the pool
    /// @return currentTick Current tick of the pool
    function getCurrentTick(address poolAddress) external view returns (int24 currentTick) {
        require(poolAddress != address(0), "Invalid pool");
        IUniswapV3Pool pool = IUniswapV3Pool(poolAddress);
        (, currentTick,,,,,) = pool.slot0();
    }

    /// @notice Check if a position is in range
    /// @param poolAddress Address of the pool
    /// @param tickLower Lower tick of the position
    /// @param tickUpper Upper tick of the position
    /// @return inRange Whether the position is in range
    function isPositionInRange(
        address poolAddress,
        int24 tickLower,
        int24 tickUpper
    ) external view returns (bool inRange) {
        require(poolAddress != address(0), "Invalid pool");
        IUniswapV3Pool pool = IUniswapV3Pool(poolAddress);
        (, int24 currentTick,,,,,) = pool.slot0();
        inRange = currentTick >= tickLower && currentTick < tickUpper;
    }

    /// @notice Get the best pool for a token pair based on liquidity
    /// @param tokenA First token address
    /// @param tokenB Second token address
    /// @return bestPool Address of the best pool
    /// @return bestFee Fee tier of the best pool
    function getBestPool(
        address tokenA,
        address tokenB
    ) external view returns (address bestPool, uint24 bestFee) {
        uint24[3] memory feeTiers = [FEE_LOW, FEE_MEDIUM, FEE_HIGH];
        uint128 maxLiquidity = 0;

        for (uint256 i = 0; i < 3; i++) {
            address poolAddress = factory.getPool(tokenA, tokenB, feeTiers[i]);

            if (poolAddress != address(0)) {
                IUniswapV3Pool pool = IUniswapV3Pool(poolAddress);
                uint128 liquidity = pool.liquidity();

                if (liquidity > maxLiquidity) {
                    maxLiquidity = liquidity;
                    bestPool = poolAddress;
                    bestFee = feeTiers[i];
                }
            }
        }
    }

    // ============ Internal Functions ============

    /// @notice Round tick down to nearest tick spacing
    function _roundDownToTickSpacing(int24 tick, int24 tickSpacing) internal pure returns (int24) {
        int24 compressed = tick / tickSpacing;
        if (tick < 0 && tick % tickSpacing != 0) compressed--;
        return compressed * tickSpacing;
    }

    /// @notice Round tick up to nearest tick spacing
    function _roundUpToTickSpacing(int24 tick, int24 tickSpacing) internal pure returns (int24) {
        int24 compressed = tick / tickSpacing;
        if (tick > 0 && tick % tickSpacing != 0) compressed++;
        return compressed * tickSpacing;
    }

    /// @notice Estimate APR based on fee tier and liquidity (simplified model)
    /// @dev This is a rough estimate - actual APR depends on trading volume
    function _estimateAPR(uint24 fee, uint128 liquidity) internal pure returns (uint256) {
        if (liquidity == 0) return 0;

        // Base APR estimate based on fee tier
        // Higher fee = potentially higher APR but less volume
        // This is a simplified model
        uint256 baseAPR;
        if (fee == FEE_LOW) {
            baseAPR = 500; // 5% base for 0.05% fee
        } else if (fee == FEE_MEDIUM) {
            baseAPR = 1500; // 15% base for 0.3% fee
        } else {
            baseAPR = 2500; // 25% base for 1% fee
        }

        return baseAPR;
    }

    /// @notice Get default range width for a fee tier
    function _getDefaultRangeWidth(uint24 fee) internal pure returns (int24) {
        if (fee == FEE_LOW) {
            return 200; // Narrow range for low fee (stables)
        } else if (fee == FEE_MEDIUM) {
            return 2000; // Medium range for standard pairs
        } else {
            return 4000; // Wide range for volatile pairs
        }
    }
}
