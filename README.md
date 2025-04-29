# Mumbai DAO

A community platform for the Mumbai DAO that allows users to connect with MetaMask, track wallet age, earn points, and connect social accounts.

## Features

- MetaMask wallet integration
- User points system based on wallet age and social connections
- Social account verification (Twitter, Google, LinkedIn)
- Community leaderboard
- User profile management

## Tech Stack

- **Frontend**: React, React Router, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT, Ethereum wallet signatures
- **Social Integration**: Clerk

## Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- MetaMask browser extension

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
NODE_ENV=development
PORT=3000
JWT_SECRET=yourSecretKeyHere
CLERK_SECRET_KEY=your_clerk_key_here
MONGODB_URI=mongodb://localhost:27017/mumbai_dao
```

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/mumbai-dao.git
cd mumbai-dao
```

2. Install backend dependencies
```
npm install
```

3. Install frontend dependencies
```
cd frontend
npm install
cd ..
```

4. Seed the database (optional)
```
npm run seed
```

5. Start the development server
```
npm run dev
```

### Production Deployment

To build and deploy for production:

```
npm run deploy
```

This will install frontend dependencies, build the frontend, and start the production server.

## API Routes

- **Authentication**
  - `POST /auth/nonce`: Generate nonce for wallet signature
  - `POST /auth/verify`: Verify wallet signature

- **User Data**
  - `GET /main`: Get user info and leaderboard

- **Leaderboard**
  - `GET /leaderboard`: Get top users sorted by wallet age/points

- **Profile**
  - `POST /profile/username`: Update username
  - `POST /profile/connect-social`: Connect social account

## License

MIT