# ChatSpace — local run and deployment

## Before you start
- Node.js 20+ and npm
- MongoDB Atlas (or local MongoDB)
- Cloudinary credentials for image uploads
- Groq API key for AI chat
- A strong, unique JWT secret (never commit it)

## Local development
1. Copy `backend/.env.example` to `backend/.env` and fill in the values.
2. Set `MONGODB_URI` to the MongoDB connection string. The application appends `/chat-app`.
3. Set `CLIENT_URL=http://localhost:5173` and configure `AI_ASSISTANT_ID` / `ADMIN_ID` only if you have created those user records.
4. In `backend/`, run `npm ci && npm start`.
5. Copy `frontend/.env.example` to `frontend/.env`, then run `npm ci && npm run dev` in `frontend/`.
6. Open the Vite URL printed in the terminal.

## Deployment outline
- Deploy the backend as a persistent Node service (for example Render/Railway/Fly.io), not a Vercel serverless function: Socket.IO requires a long-lived server and serverless deployments may not support persistent realtime connections.
- Set backend environment variables in the hosting provider dashboard. `CLIENT_URL` must be the exact production frontend origin (comma-separated origins are supported).
- Deploy `frontend/` as a static Vite site (for example Vercel). Set `VITE_BACKEND_URL` to the HTTPS backend origin, plus the public IDs used by the UI if applicable.
- Provision MongoDB Atlas and Cloudinary; test signup/login, socket presence, text messages, image uploads, AI availability, and profile updates on the deployed domains.
- Do not add real `.env` files, API keys, tokens, or database credentials to Git.

## Current limitations
This package is not remotely deployed by this repair because deployment requires access to your hosting accounts and production secrets. Review and test the deployed instance before describing it as production-ready. See `README.md` for the feature inventory.
