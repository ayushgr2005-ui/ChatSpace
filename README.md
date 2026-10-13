\# ChatSpace — Real-Time Chat Application



ChatSpace is a full-stack chat application built with React, Node.js, Express, MongoDB, and Socket.IO. It supports user authentication, real-time messaging, conversation history, and online presence.



\## Features



\- \*\*Authentication:\*\* JWT-based authentication for protected API routes.

\- \*\*Real-Time Messaging:\*\* Send and receive messages using Socket.IO.

\- \*\*Conversation History:\*\* Store and retrieve messages from MongoDB.

\- \*\*Read Status:\*\* Mark received messages as seen.

\- \*\*Online Presence:\*\* Display connected users.

\- \*\*Profile Management:\*\* User profile and avatar functionality.

\- \*\*Image Messaging:\*\* Image upload support, subject to server configuration.

\- \*\*AI Integration:\*\* Groq-based AI functionality, subject to configuration.

\- \*\*Responsive Interface:\*\* React-based chat interface.



\## Tech Stack



\*\*Frontend\*\*

\- React

\- Vite

\- Tailwind CSS

\- Socket.IO Client



\*\*Backend\*\*

\- Node.js

\- Express

\- Socket.IO

\- MongoDB and Mongoose

\- JSON Web Tokens (JWT)

\- Multer and Cloudinary for image uploads



\## Project Structure



```text

chatspace\_review/

├── backend/

│   ├── controllers/

│   ├── lib/

│   ├── middlewares/

│   ├── models/

│   ├── routes/

│   ├── .env

│   └── server.js

├── frontend/

│   ├── public/

│   ├── src/

│   ├── .env

│   └── package.json

└── README.md

```



\## Prerequisites



\- Node.js and npm

\- MongoDB running locally or a MongoDB connection URI

\- Optional: Cloudinary and Groq credentials for configured features



\## Local Setup



\### 1. Backend



Open a terminal in the project root:



```bash

cd backend

npm install

```



Create a `backend/.env` file with the configuration required by the backend. Example:



```dotenv

PORT=5000

MONGODB\_URI=mongodb://127.0.0.1:27017/chatspace

JWT\_SECRET\_KEY=replace-with-a-long-random-secret

CLIENT\_URL=http://localhost:5173,http://localhost:5174

```



Add any additional Cloudinary, Groq, or feature-control variables required by your local configuration. Never commit real secrets to source control.



Start the backend:



```bash

npm start

```



The backend is expected to listen on port `5000` when configured as above.



\### 2. Frontend



Open a second terminal in the project root:



```bash

cd frontend

npm install

```



Create `frontend/.env`:



```dotenv

VITE\_BACKEND\_URL=http://localhost:5000

```



Add any optional frontend environment variables required by the features you enable.



Start the frontend:



```bash

npm run dev

```



Open the local URL printed by Vite in your terminal.



\## API Endpoints



The following endpoints are defined by the application routes.



\### Authentication and Profiles



| Method | Endpoint | Purpose |

|---|---|---|

| POST | `/api/auth/signup` | Register a user |

| POST | `/api/auth/login` | Log in |

| GET | `/api/auth/get-profile` | Retrieve the authenticated profile |

| PUT | `/api/auth/update-profile` | Update the authenticated profile |



\### Messaging



| Method | Endpoint | Purpose |

|---|---|---|

| GET | `/api/messages/users` | Retrieve users for the sidebar |

| GET | `/api/messages/:userId` | Retrieve conversation history |

| POST | `/api/messages/send/:userId` | Send a text or image message |

| PUT | `/api/messages/seen/:msgId` | Mark a message as seen |



Protected endpoints require a valid bearer token:



```http

Authorization: Bearer YOUR\_TOKEN

```



Additional AI endpoints may be available depending on the backend routes and configuration.



\## Security and Configuration Notes



\- Keep `.env` files and credentials private.

\- Use a strong, unique JWT secret.

\- Configure `CLIENT\_URL` with only the frontend origins you trust.

\- Validate uploads and enforce size limits on the server.

\- Use HTTPS and production-grade configuration when deploying.

\- Add rate limiting, automated tests, and robust production logging before a public launch.

\- In-memory Socket.IO presence may not support multi-instance deployments without a shared adapter.



\## Verification Status



The frontend production build has completed successfully during development. Local backend startup, MongoDB connectivity, authenticated API behavior, and basic messaging have also been exercised.



This does not establish that every optional feature or production deployment path has been fully tested. Verify image uploads, AI configuration, and deployment separately before relying on them.



\## License



ISC license, as indicated by the existing project documentation. Confirm the repository's license file before redistribution.



