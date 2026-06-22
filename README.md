# Creative Birds - Design Marketplace

A Rapido-style design marketplace connecting customers with graphic designers through a 3-portal platform.

## Portals

- **Customer Portal**: Submit design requirements via text or Telugu voice, select packages, pay, and track jobs.
- **Designer Portal**: Onboard, accept jobs, manage earnings, and join meetings.
- **Admin Portal**: Manage users, transactions, complaints, and payouts.

## Theme Color

`#234997`

## Getting Started

### Prerequisites
- Node.js

### Installation

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Running the App

```bash
# Start server (from server folder)
npm start

# Start client (from client folder)
npm run dev
```

- Client runs on `http://localhost:3000`
- Server runs on `http://localhost:5000`

## Features

- Telugu text/voice input with AI translation simulation
- Real-time job assignment via Socket.io
- Automatic Google Meet link generation
- OTP-based meeting verification
- 50/50 revenue split with 6-day hold
- Minimal data sharing between customer and designer
- Admin-controlled payouts and complaints with Aadhaar tracking
