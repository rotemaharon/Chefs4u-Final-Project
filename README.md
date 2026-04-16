# Chefs4u - Final Project
**Student:** Rotem Aharon  

## Project Overview
Chefs4u is a platform designed to connect restaurants with professional cooks. The system allows restaurants to post and manage shifts while providing cooks with tools to find work and manage their applications. The application is fully responsive and supports all screen sizes.

## User Roles and Functionality
- **Cook:** Browse jobs, filter by location and wage, save favorites, and apply for shifts.
- **Restaurant:** Post job openings, manage active shifts, and review applicants.
- **Admin:** Manage users, update permissions, delete content, and view system statistics.

## Key Features & Bonuses
- **Security:** JWT authentication with 4-hour expiration and rate limiting for API protection.
- **Admin Dashboard:** Management interface for users and popularity reports based on favorites.
- **Password Recovery:** Email-based password reset system using secure tokens.
- **Profile Image Upload:** User profile images are uploaded and stored on the server.
- **Validation:** Comprehensive server and client-side validation using Joi and Regex.

## Tech Stack
- **Frontend:** React, TypeScript, Redux Toolkit, React-Bootstrap, Axios.
- **Backend:** Node.js, Express, MongoDB, Mongoose.
- **Utilities:** Nodemailer, Morgan, Bcryptjs, Multer.

## Installation and Setup
### Server
1. Navigate to `/server` and run `npm install`.
2. Configure `.env` with: `MONGO_URI`, `JWT_SECRET`, `EMAIL_USER`, `EMAIL_PASS`.
3. Run `npm run dev`.

### Client
1. Navigate to `/client` and run `npm install`.
2. Configure `.env` with: `VITE_API_URL`.
3. Run `npm run dev`.

## Demo Users
For testing the project, you can use the following demo accounts:

**Admin:**
- Email: admin@gmail.com
- Password: Admin123123!

**Restaurant:**
- Email: restaurant@gmail.com
- Password: Aa123123!

**Cook:**
- Email: test@rest.com
- Password: Admin123123!