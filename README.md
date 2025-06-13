# CertChain - Blockchain Certificate Management System

## Overview
CertChain is a decentralized certificate management system that leverages blockchain technology to provide secure, verifiable, and tamper-proof digital certificates. The system ensures the authenticity and integrity of certificates through smart contracts and blockchain verification.

## Features
- Secure certificate issuance and verification
- Blockchain-based certificate storage
- Smart contract integration
- User authentication and authorization
- Admin dashboard for certificate management
- Password reset functionality via https://resetpassword.karadurbanbank.com/

## Tech Stack
- Frontend: React.js with TypeScript
- Backend: Node.js with Express
- Database: MongoDB
- Blockchain: Ethereum
- Smart Contracts: Solidity
- Authentication: JWT

## Prerequisites
- Node.js (v14 or higher)
- MongoDB
- MetaMask or other Web3 wallet
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd CertChain
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
npm install
```

3. Configure environment variables:
   - Create `.env` file in the backend directory
   - Add necessary environment variables (see `.env.example`)

4. Start the development servers:
```bash
# Start backend server
cd backend
npm run dev

# Start frontend server
cd frontend
npm start
```

## Project Structure
```
CertChain/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── config/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   ├── services/
│   │   └── utils/
│   └── public/
└── smart-contracts/
    └── contracts/
```

## API Endpoints

### Authentication
- POST `/api/auth/signup` - User registration
- POST `/api/auth/login` - User login
- POST `/api/auth/forgot-password` - Request password reset
- POST `/api/auth/reset-password` - Reset password

### Certificates
- GET `/api/certificates` - Get all certificates
- POST `/api/certificates` - Issue new certificate
- GET `/api/certificates/:id` - Get certificate by ID
- PUT `/api/certificates/:id` - Update certificate
- DELETE `/api/certificates/:id` - Delete certificate

## Smart Contracts
The system uses smart contracts for:
- Certificate issuance
- Certificate verification
- Ownership management
- Access control

## Security Features
- JWT-based authentication
- Password hashing
- Role-based access control
- Blockchain verification
- Secure password reset flow

## Acknowledgments
- Ethereum Foundation
- OpenZeppelin
- React.js community
- Node.js community 