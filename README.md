# Golf Preorder App

This project includes a small React frontend and a minimal Express backend used to handle orders.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the backend server:
   ```bash
   npm run server
   ```
   The server listens on `http://localhost:5000` and exposes `POST /api/order`.
3. In another terminal, start the React development server:
   ```bash
   npm start
   ```
   The development server proxies API calls to the Express backend thanks to the `proxy` setting in `package.json`.

## API

- **POST `/api/order`**
  - Request body: `{ hole: string, items: array }`
  - Response: `{ orderId: string }`
  - Returns `400` if the payload is missing `hole` or `items`.

