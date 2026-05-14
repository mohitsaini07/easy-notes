# EasyNotes - Online Notes Sharing Web App

A modern, production-ready full-stack web application designed for students to share study materials, notes, PDFs, assignments, and resources.

## 🚀 Features

- **User Authentication**: JWT-based auth with Refresh tokens, Role-based access (Student, Teacher, Admin).
- **Notes Management**: Upload PDFs, DOCX, Images, and more. Auto-thumbnail generation.
- **Search & Filter**: Advanced search engine with filtering by subject, university, semester, and trending notes.
- **AI Features Integration Ready**: Architecture setup for AI summarizer and smart recommendations.
- **Premium UI/UX**: Built with React, Tailwind CSS, Framer Motion, and Shadcn UI.
- **Dockerized**: Full Docker and Docker Compose support for easy deployment.
- **Database**: MongoDB with Mongoose ORM.

## 🛠️ Tech Stack

**Frontend**
- React.js (Vite)
- TypeScript
- Tailwind CSS
- React Router DOM
- Zustand (State Management)
- React Query (Data Fetching)
- Framer Motion

**Backend**
- Node.js
- Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- Bcrypt.js

**DevOps & Deployment**
- Docker
- Docker Compose

## 📂 Project Structure

```text
EasyNotes/
├── backend/            # Express.js backend application
│   ├── src/            # Source code (controllers, models, routes)
│   ├── Dockerfile
│   └── package.json
├── frontend/           # React.js frontend application
│   ├── src/            # Components, pages, hooks, store
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml  # Docker Compose configuration
└── README.md
```

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB
- Docker (optional but recommended)

### Running with Docker (Recommended)

1. Clone the repository
2. Run Docker Compose:
   ```bash
   docker-compose up --build
   ```
3. Access the application:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

### Running Locally

**1. Backend Setup**
```bash
cd backend
npm install
npm run dev
```

**2. Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

## 📝 API Documentation

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- *(More routes in development...)*
