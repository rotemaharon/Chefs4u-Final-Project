# Chefs4u - Full Stack Final Project
Live Demo: https://chefs4u-final-project.vercel.app

**Developed by Rotem Aharon**

A platform connecting restaurants with professional chefs. Restaurants post shifts, chefs apply and manage their applications.

## Getting Started

### Server
```bash
cd server
npm install
npm run dev
```
Create a `.env` file based on `server/.env.example`:
```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
FRONTEND_URL=http://localhost:5173
```
### Client
```bash
cd client
npm install
npm run dev
```
Create a `.env` file based on `client/.env.example`:
```
VITE_API_URL=http://localhost:3000/api
```

The app will open at `http://localhost:5173`.

## User Roles

| Role | Permissions |
|------|-------------|
| Cook | Browse and filter jobs, save favorites, apply for shifts, manage applications |
| Restaurant | Post, edit and delete jobs, manage applicants and statuses |
| Admin | Full access, user management, role changes, favorites stats report |

## Features

- Full CRUD for job listings with applicant management (pending / accepted / rejected)
- Favorites saved to database — accessible from any device
- Internal messaging system between cooks and restaurants
- Password reset via email with a one-time token
- Profile image upload
- Search, filtering by location and wage, grid and table view modes
- JWT authentication with automatic logout after 4 hours
- Rate limiting, restricted CORS, dual validation (Joi + client-side)

## Tech Stack

**Frontend:** React 19, TypeScript, Redux Toolkit, React Bootstrap, Axios

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, Multer, Nodemailer

## API Overview

| Prefix | Description |
|--------|-------------|
| `/api/auth` | Register, login, profile, favorites, admin user management, password reset |
| `/api/jobs` | Job CRUD, apply/cancel, applicant status, popularity report |
| `/api/messages` | Send messages, conversations, read/unread status |

## Demo Users

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@gmail.com | Admin123123! |
| Restaurant | restaurant@gmail.com | Aa123123! |
| Cook | test@rest.com | Admin123123! |
