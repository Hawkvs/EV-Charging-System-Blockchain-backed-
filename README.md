# EV Charging P2P DApp

A decentralized peer-to-peer Electric Vehicle (EV) charging application. This project features a full stack including Smart Contracts (Solidity/Hardhat), a Backend Node.js server (Express.js), and a Frontend web application (Next.js).

## System Requirements
- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher
- **MetaMask**: Browser extension for connecting to the DApp
- **Git**: For cloning the repository

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/darkknight8670/Peer-to-peer-EV-charging-using-blockchain.git
cd Peer-to-peer-EV-charging-using-blockchain
```

### 2. Install Dependencies

Install the backend and smart contract dependencies at the root level:
```bash
npm install
```

Install the frontend dependencies:
```bash
cd frontend
npm install
cd ..
```

### 3. Environment Variables
Create a `.env` file in the root directory. Modify it to match .env.sample 
```env

#before deploy the contracts your env should be like this
RPC_URL=your_sepolia_rpc_url_here
ORACLE_PRIVATE_KEY=your_deployer_private_key_here
NEXT_PUBLIC_ADMIN_ADDRESS=your_admin_public_wallet_address

# Backend Settings
PORT=4000
```

### 4. Smart Contract Deployment (Local Testnet)

To run the complete system locally, you can start a local Hardhat node and deploy the contracts:

1. start the Hardhat network:
```bash
npx hardhat compile
```

2. deploy the contracts to your local network:
```bash
npm run deploy
```
### 5. After deploy add these in your env file 

VALIDATION_ADDRESS=validator_address from address.json
ESCROW_ADDRESS=EVChargingEscrow from address.json

PORT=4000

*Note: This script should generate/update an `Addresses.json` file in both the root and `frontend/` directories, which the backend and frontend use to locate the deployed contracts.*

### 6. Running the Application

  ## run frontend
  ```
  cd frontend
  npm run dev
  ```

  ## run backend in new terminal
  ```
  cd Peer-to-peer-EV-charging-using-blockchain
  npm run backend
  ```

### 7. Using the Application
1. Open your browser and navigate to `http://localhost:3000`
2. Ensure you have the **MetaMask** extension installed.
3. If running a local node, configure MetaMask to connect to `http://127.0.0.1:8545` (Chain ID: `31337`) and import one of the private keys provided by the `npx hardhat node` terminal output.

## Architecture Structure

- `contracts/`: Solidity smart contracts (`EVChargingEscrow.sol`, `VehicleRegistry.sol`, etc.)
- `scripts/`: Deployment and setup scripts for the blockchain environment.
- `backend/`: Node/Express server handling backend API interactions, validations, and blockchain polling via ethers.js.
- `frontend/`: Next.js DApp providing role-based user interfaces (`/donor`, `/receiver`, `/history`, etc.)
- `test/`: Mocha/Chai tests covering smart contract logic.

## Frontend Route Details

```
pages/
├── index.jsx                     → /
├── login.jsx                     → /login
├── dashboard.jsx                 → /dashboard
├── receiver/ (Receiver Role flows)
│   ├── dashboard.jsx             → /receiver/dashboard
│   ├── broadcast.jsx             → /receiver/broadcast
│   └── ...
├── donor/ (Donor Role flows)
│   ├── dashboard.jsx             → /donor/dashboard
│   ├── feed.jsx                  → /donor/feed
│   └── ...
├── history.jsx                   → /history
├── profile.jsx                   → /profile
├── error.jsx                     → /error
├── contact.jsx                   → /contact
├── about.jsx                     → /about
└── history.jsx                   → /history (duplicated above?)
```
