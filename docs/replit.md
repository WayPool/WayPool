# WayBank - Decentralized Liquidity Management Platform

## Overview

WayBank is a decentralized finance (DeFi) platform that provides advanced liquidity management and portfolio optimization for blockchain assets. The platform allows users to manage NFT positions, track portfolio performance, and interact with various DeFi protocols through a comprehensive dashboard interface.

The application serves as a bridge between traditional financial interfaces and blockchain technology, offering users tools to monitor and manage their digital assets, liquidity positions, and yield farming strategies across multiple blockchain networks including Ethereum and Polygon.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety and component-based development
- **Styling**: TailwindCSS for utility-first styling approach
- **State Management**: React hooks and context for local state management
- **Internationalization**: Multi-language support with a translation system covering 9 languages (Spanish, English, French, German, Portuguese, Italian, Chinese, Hindi, Arabic)
- **Web3 Integration**: Ethers.js for blockchain interactions and wallet connectivity
- **Component Structure**: Modular components with dedicated pages for positions, dashboard, and NFT management

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Database Layer**: Drizzle ORM for type-safe database operations
- **API Architecture**: RESTful API endpoints for data retrieval and management
- **Authentication**: Wallet-based authentication using cryptographic signatures
- **Data Processing**: Real-time data aggregation for position tracking and portfolio analytics

### Database Design
- **Primary Database**: PostgreSQL hosted on Neon (Serverless Postgres)
- **Connection Management**: Pooled connections using @neondatabase/serverless
- **Schema Management**: Drizzle ORM with TypeScript schema definitions
- **Key Tables**:
  - `users`: User account management and wallet associations
  - `position_history`: Historical data for trading positions and performance
  - `managed_nfts`: NFT position tracking and metadata
  - `custodial_wallets`: Managed wallet information and balances
  - `real_positions`: Live position data with current valuations
  - `billing_profiles`: Payment and subscription management
  - `referral_system`: Multi-table referral tracking and commission system

### Blockchain Integration
- **Multi-Network Support**: Ethereum mainnet and Polygon network compatibility
- **Wallet Connectivity**: Support for 170+ wallets including MetaMask, Coinbase Wallet, WalletConnect, hardware wallets
- **Smart Contract Interaction**: Direct integration with Uniswap V3 NFT positions and DeFi protocols
- **Token Management**: ERC20, ERC721, and ERC1155 token support with real-time balance tracking
- **Transaction Monitoring**: Comprehensive transaction history and status tracking

### Geographic Redundancy System
- **Multi-Region Deployment**: Primary database in US-East, secondary in Europe
- **Automated Backup System**: Daily automated backups with 7-day retention policy
- **Sync Mechanisms**: Real-time synchronization between geographic regions
- **Failover Strategy**: Automatic failover capabilities for high availability
- **Data Protection**: 99.9% uptime guarantee with intercontinental redundancy

### Security Architecture
- **Wallet Security**: Private keys never stored on servers, device-only credential management
- **Connection Security**: End-to-end encrypted connections using military-grade cryptography
- **Authentication**: Cryptographic signature-based authentication without password storage
- **Data Protection**: All sensitive operations require explicit user approval
- **Audit Trail**: Complete transaction and action logging for security monitoring

## External Dependencies

### Blockchain Infrastructure
- **Neon Database**: Serverless PostgreSQL for primary data storage with geographic redundancy
- **Alchemy/Infura**: Blockchain node providers for Ethereum and Polygon network access
- **Ethers.js**: Primary library for blockchain interactions and smart contract communications
- **WalletConnect**: Universal wallet connection protocol supporting 170+ wallets

### Development and Runtime
- **Drizzle ORM**: Type-safe database operations with automatic schema management
- **React Ecosystem**: Frontend framework with TypeScript, TailwindCSS for responsive design
- **Node.js**: Backend runtime environment for API services and data processing
- **ESLint**: Code quality enforcement with custom configuration for TypeScript projects

### Financial Data Services
- **CoinGecko/CoinMarketCap**: Real-time cryptocurrency pricing and market data
- **DeFiPulse**: DeFi protocol analytics and yield farming data
- **Uniswap Subgraph**: Real-time DEX data for liquidity pool information and trading metrics

### Infrastructure Services
- **Replit**: Development and deployment environment with integrated database management
- **GitHub**: Version control and collaborative development platform
- **WebSocket Connections**: Real-time data streaming for live price feeds and portfolio updates
- **IPFS**: Decentralized storage for NFT metadata and immutable data storage

## Recent Changes (January 7, 2026)

### Email Service SMTP Fix - Direct IP Configuration
- **Problem Identified**: SMTP server elysiumdubai.net was behind Cloudflare proxy, blocking all SMTP connections (timeout errors)
- **Root Cause**: Cloudflare does not proxy SMTP traffic, so connections to the domain were timing out
- **Solution Applied**:
  - Configured email service to use direct IP address (185.68.111.228) instead of domain name
  - Implemented multi-configuration fallback system trying SSL (port 465) and STARTTLS (port 587)
  - Added automatic retry logic with 3 SMTP configurations before falling back to Resend API
- **SMTP Configuration**:
  - Primary: Direct IP 185.68.111.228:465 (SSL)
  - Fallback 1: Direct IP 185.68.111.228:587 (STARTTLS)
  - Fallback 2: Domain from env vars (for future use if DNS is fixed)
- **Password Recovery System**: Now fully functional with OTP codes (6-digit, 5-minute expiration)
- **Technical Details**:
  - Email service location: `server/email-service.ts`
  - Password recovery: `server/custodial-wallet/password-recovery-route.ts`
  - OTP management: `server/custodial-wallet/otp-recovery.ts`

## Recent Changes (November 24, 2025)

### Critical Bug Fix: Position History with Historical Dates
- **Problem Identified**: Positions created with `startDate` prior to current date (historical positions) were causing server errors and not visible to users in their positions page, though visible in admin panel
- **Root Cause**: Auto-renewal logic in `/api/position-history/:walletAddress` endpoint attempted to update non-existent `contractPeriod` field in database, causing TypeError when processing positions with historical start dates
- **Fix Applied**:
  - Removed problematic auto-renewal logic that tried to renew positions after contract expiration
  - Eliminated all references to non-existent `contractPeriod` database field
  - Simplified position processing to use existing `timestamp` and `startDate` fields correctly
- **Impact**: Users can now see all their positions regardless of start date, including positions with historical dates (e.g., Position ID 324 with startDate: 2024-05-15)
- **Technical Details**: 
  - Error was: `TypeError: value.toISOString is not a function` at PgTimestamp.mapToDriverValue
  - Fix location: `server/routes.ts` lines 1175-1224 (removed), lines 1243-1250 (simplified), line 1948 (removed field reference)

### Fee Withdrawals Admin System Enhancement (November 10, 2025)
- **Email Integration**: Enhanced fee withdrawal tracking to include user email addresses
  - Created `getFeeWithdrawalsWithUserEmail()` method in storage layer that joins `fee_withdrawals` with `users` table
  - Email column now displays in admin Fee Withdrawals Manager with clickable mailto links
  - Improved data visibility for investor reporting and administrative monitoring

- **API Endpoints Security**:
  - All fee withdrawal endpoints now protected with `isAdmin` middleware
  - GET `/api/fee-withdrawals` - Retrieve all fee withdrawals with user emails (admin only)
  - PATCH `/api/fee-withdrawals/:id` - Update withdrawal status or details (admin only)
  - DELETE `/api/fee-withdrawals/:id` - Remove withdrawal record (admin only)

- **Enhanced Logging**: 
  - Improved diagnostic logging in `/api/fees/collect` endpoint for email notification troubleshooting
  - Added detailed emoji-based logs to track email service initialization and send status
  - Better error tracking for SMTP failures and notification delivery issues

- **Frontend Updates**:
  - FeeWithdrawalsManager component now displays user email in dedicated column
  - Added data-testid attributes for automated testing
  - Email addresses are clickable for quick contact access

- **Database Compatibility**:
  - DatabaseStorage implementation uses SQL join for production data
  - MemStorage stub implementation maintains interface compliance for testing environments