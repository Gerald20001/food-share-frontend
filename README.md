# Food Share - Full Stack Application

A platform for sharing surplus food between organizations and volunteers, built with Vue.js frontend and Node.js/Express/PostgreSQL backend.

## Features

- 🎨 **Modern Design** - Beautiful, responsive UI with dark/light theme support
- 🌍 **Multilingual** - English and Ukrainian language support
- 🗺️ **Interactive Maps** - Leaflet maps with markers for food locations
- 👥 **User Roles** - Support for Organizations and Volunteers
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile
- 🔐 **JWT Authentication** - Secure authentication system
- 🔔 **Toast Notifications** - User-friendly notifications
- 🎯 **Dashboard** - Organization dashboard for managing announcements
- 📦 **Reservations** - Volunteer booking system with approval workflow
- 🗄️ **PostgreSQL Database** - Robust data storage

## Tech Stack

### Frontend
- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next-generation frontend tooling
- **Vue Router** - Official router for Vue.js
- **Pinia** - State management for Vue
- **Vue I18n** - Internationalization
- **Leaflet** - Interactive maps
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **PostgreSQL** - Relational database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Project Structure

```
├── backend/
│   ├── config/          # Database configuration
│   ├── database/        # Database schema and initialization
│   ├── middleware/      # Auth middleware
│   ├── routes/          # API routes
│   └── server.js        # Express server
├── src/
│   ├── components/      # Vue components
│   ├── i18n/           # Internationalization
│   ├── router/         # Vue Router
│   ├── services/       # API service
│   ├── stores/         # Pinia stores
│   └── views/          # Page components
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 16+
- PostgreSQL 12+
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create PostgreSQL database:
```sql
CREATE DATABASE foodshare;
```

4. Create `.env` file:
```bash
cp .env.example .env
```

5. Update `.env` with your database credentials:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=foodshare
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your-secret-key-change-in-production
```

6. Initialize database:
```bash
node database/init.js
```

7. Start backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:3000`

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (optional):
```
VITE_API_URL=http://localhost:3000/api
```

3. Start development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Announcements
- `GET /api/announcements` - Get all announcements (with filters)
- `GET /api/announcements/:id` - Get single announcement
- `POST /api/announcements` - Create announcement (organization only)
- `PUT /api/announcements/:id` - Update announcement
- `DELETE /api/announcements/:id` - Delete announcement

### Reservations
- `GET /api/reservations/organization` - Get organization's reservations
- `GET /api/reservations/volunteer` - Get volunteer's bookings
- `POST /api/reservations` - Create reservation
- `POST /api/reservations/:id/approve` - Approve reservation
- `POST /api/reservations/:id/reject` - Reject reservation
- `POST /api/reservations/:id/complete` - Complete reservation
- `DELETE /api/reservations/:id` - Cancel reservation

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `POST /api/users/:id/change-password` - Change password

## Database Schema

- **users** - User accounts (volunteers and organizations)
- **organizations** - Additional organization information
- **announcements** - Food announcements with multilingual support (en/uk)
- **reservations** - Volunteer reservations/requests

## Features

### Multilingual Support
- English and Ukrainian
- Language switcher in navbar
- All content translated
- Language preference saved in database

### Map Integration
- Interactive Leaflet maps
- Markers for food locations
- Map preview in announcement details
- Full map view on map page

### User Roles
- **Organization**: Can create announcements, approve/reject reservations
- **Volunteer**: Can browse food, create reservations, manage bookings

## Development

### Backend
```bash
cd backend
npm run dev  # Development with auto-reload
npm start    # Production
```

### Frontend
```bash
npm run dev     # Development
npm run build   # Production build
npm run preview # Preview production build
```

## Environment Variables

### Backend (.env)
```
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=foodshare
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/api
```

## License

MIT
