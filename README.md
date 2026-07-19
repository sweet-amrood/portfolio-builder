# Novafolio — Portfolio Builder (MERN)

A step-by-step portfolio builder platform built with MongoDB, Express, React, and Node.js.

## Features (Step 1)

- **Authentication**: Email/password signup & login
- **Google OAuth**: Sign in / sign up with Google
- **Email verification**: Nodemailer confirmation emails on signup
- **Password security**: Min 8 chars, uppercase, lowercase, number + show/hide toggle
- **Forgot password**: Reset flow with Google email confirmation for manual signups
- **Protected routes**: Home page accessible only after login
- **Animated UI**: Framer Motion animations on auth pages and home dashboard

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Google Cloud OAuth credentials
- SMTP credentials (Gmail App Password recommended)

## Setup

### 1. Install dependencies

```bash
npm run install:all
npm install
```

### 2. Configure environment

Copy and fill in the env files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

**server/.env** — MongoDB URI, JWT secret, SMTP, Google Client ID

**client/.env** — `VITE_GOOGLE_CLIENT_ID` (same as server)

### 3. Google OAuth setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID (Web application)
4. Add authorized origins: `http://localhost:5173`
5. Copy Client ID to both `.env` files

### 4. SMTP setup (Gmail example)

1. Enable 2FA on your Google account
2. Generate an [App Password](https://myaccount.google.com/apppasswords)
3. Set `SMTP_USER` and `SMTP_PASS` in `server/.env`

### 5. Start MongoDB & run

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Project Structure

```
portfolio-builder/
├── client/          React + Vite frontend
│   ├── src/
│   │   ├── pages/       Login, Signup, Home, etc.
│   │   ├── components/  PasswordInput, GoogleButton
│   │   ├── context/     AuthContext
│   │   └── services/    API client
├── server/          Express backend
│   ├── models/      User model
│   ├── routes/      Auth routes
│   ├── utils/       Email, JWT, Google, tokens
│   └── middleware/  Auth protection
└── package.json     Root scripts
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register with email/password |
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/google` | Google OAuth login |
| GET | `/api/auth/verify-email/:token` | Verify email |
| POST | `/api/auth/resend-verification` | Resend verification email |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password with token |
| GET | `/api/auth/me` | Get current user (protected) |
| POST | `/api/auth/logout` | Logout |

## Next Steps

- Portfolio editor (drag & drop)
- Template gallery
- User dashboard
- Custom domain support
- Analytics
