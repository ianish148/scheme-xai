# XAI Recommender

> Explainable AI Scheme & Scholarship Recommender

A modern web application built with a React/Vite frontend and a lightweight Python/Flask backend. The engine evaluates user credentials and demographics (age, income, occupation, etc.) and cross-references them with mathematical rules to confidently recommend applicable social, educational, and commercial schemes.

## 🚀 Deployment

This application is structurally configured for zero-setup deployment on [Vercel](https://vercel.com/):
- **Frontend**: Automatically built via Vercel's Vite preset.
- **Backend (Python)**: Vercel natively interprets the `/api` directory and mounts it as Serverless Functions (`@vercel/python`).

## 🛠️ Local Development

### 1. Run the Python Backend
The backend runs using Flask. Ensure you have Python 3 installed.
```bash
cd api
pip install -r requirements.txt
python index.py
```
*The server will start on `http://127.0.0.1:5000`*

### 2. Run the React Frontend
In a new terminal window, run the Vite development server. It comes pre-configured with a development proxy that automatically forwards frontend `/api` requests to your local Python server.
```bash
npm install
npm run dev
```

## 📁 Repository Structure

- `/api/` — The Python backend containing the Flask server `index.py`, the recommendation `engine.py`, and the evaluation `data/`. (Note: Vercel strictly requires this folder to be named `/api` for python serverless execution).
- `/src/` — The React application source code, containing `pages`, `components`, and `context`.
- `vercel.json` — Production deployment routing configurations.

## 📄 License
MIT License
