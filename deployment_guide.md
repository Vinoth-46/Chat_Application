# Deploying to Render

This guide explains how to host your MERN application on Render as a **Unified Service** (Backend + Frontend together).

## Prerequisites
- Push your latest code to GitHub.

## Step 1: Create New Web Service on Render
1.  Log in to [dashboard.render.com](https://dashboard.render.com).
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub repository.

## Step 2: Configure Settings
Use the following settings for your service:

- **Name**: `your-app-name`
- **Region**: Closest to you (e.g., Singapore, Oregon).
- **Branch**: `main`
- **Root Directory**: **LEAVE THIS BLANK**. (Do NOT type `main` here. It should be empty or `.`).
- **Runtime**: `Node`
- **Build Command**: `npm run build`
    - *This runs our custom script to install dependencies for both frontend/backend and build the React app.*
- **Start Command**: `npm start`
    - *This starts the backend server, which serves the frontend.*

## Step 3: Environment Variables
Scroll down to "Environment Variables" and add these:

| Key | Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Optimizes build and runtime. |
| `MONGODB_URI` | `...` | Your MongoDB connection string (from your `.env`). |
| `JWT_SECRET` | `...` | Your secret key for tokens. |
| `GEMINI_API_KEY` | `...` | Your Google Gemini API Key. |
| `CLIENT_URL` | `https://your-app-name.onrender.com` | **Important**: The URL Render assigns you. |

## Step 4: Deploy
Click **Create Web Service**. Render will start the build process:
1.  Install backend dependencies.
2.  Install frontend dependencies.
3.  Build frontend to `frontend/dist`.
4.  Start backend server.

## Troubleshooting
- **Error: "Service Root Directory is missing"**: You likely typed `main` in the **Root Directory** field settings. Go to **Settings** -> **Root Directory**, clear it completely, and save.
- **Build Failed**: Check the logs. If it says `npm not found` inside a folder, ensure the root `package.json` scripts are using `--prefix` correctly (we set this up).
- **White Screen**: If the frontend doesn't load, check the browser console. If 404 on API calls, check `CLIENT_URL`.
- **Socket Error**: If real-time chat fails, ensure `CLIENT_URL` effectively matches your browser URL (no trailing slash usually best, but check consistency).

Good luck!
