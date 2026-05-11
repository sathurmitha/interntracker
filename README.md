# Internship Tracker — MERN Stack

A full-stack web application to manage and track internship applications with analytics, reminders, and resume uploads.

## Tech Stack

- **Frontend**: React.js, Tailwind CSS, Chart.js, React Router v6
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Auth**: JWT + bcryptjs
- **Storage**: Cloudinary (resumes & profile images)
- **Email**: Nodemailer

---

## Project Structure

```
internship/
├── client/          # React frontend
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── context/      # AuthContext, ThemeContext
│       ├── pages/        # All page components
│       ├── services/     # Axios API calls
│       └── utils/        # Constants & helpers
└── server/          # Express backend
    ├── config/       # DB & Cloudinary config
    ├── controllers/  # Route handlers
    ├── middleware/   # Auth & error middleware
    ├── models/       # Mongoose schemas
    └── routes/       # Express routers
```

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account (optional, for file uploads)

### 1. Clone & Install

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 2. Environment Variables

**Server** — copy `server/.env.example` to `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/internship-tracker
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

**Client** — copy `client/.env.example` to `client/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Run Development Servers

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm start
```

App runs at: http://localhost:3000

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |
| GET | `/api/internships` | List internships (search, filter, paginate) |
| POST | `/api/internships` | Create internship |
| GET | `/api/internships/:id` | Get single internship |
| PUT | `/api/internships/:id` | Update internship |
| DELETE | `/api/internships/:id` | Delete internship |
| GET | `/api/analytics/stats` | Get dashboard stats |
| GET | `/api/reminders` | List reminders |
| POST | `/api/reminders` | Create reminder |
| DELETE | `/api/reminders/:id` | Delete reminder |

---

## Deployment

### Frontend → Vercel / Netlify

```bash
cd client
npm run build
# Deploy the build/ folder
```

Set environment variable: `REACT_APP_API_URL=https://your-backend.render.com/api`

### Backend → Render / Railway

1. Connect your GitHub repo
2. Set root directory to `server/`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add all environment variables from `.env.example`

### Database → MongoDB Atlas

1. Create a free cluster at https://cloud.mongodb.com
2. Add your server IP to the IP whitelist (or use `0.0.0.0/0` for all)
3. Copy the connection string to `MONGO_URI`

---

## Features

- ✅ JWT Authentication (register, login, persistent sessions)
- ✅ Full CRUD for internship applications
- ✅ 6 application statuses with color-coded badges
- ✅ Search, filter by status, sort, pagination
- ✅ Analytics dashboard with Pie & Bar charts
- ✅ Resume upload via Cloudinary
- ✅ Profile image upload
- ✅ Reminders system
- ✅ Dark/Light mode toggle
- ✅ Fully responsive (mobile + desktop)
- ✅ Rate limiting & error handling middleware
- ✅ Protected routes (frontend & backend)
