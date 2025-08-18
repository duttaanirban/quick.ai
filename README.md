# QuickAi

QuickAi is a full-stack AI-powered content and image generation platform. It allows users to generate articles, blog titles, AI images, remove backgrounds/objects from images, and review resumes. The app features authentication, a community feed, user dashboard, and real-time feedback with toasts and loaders.

## Features
- AI Article Writer
- Blog Title Generator
- AI Image Generation
- Background Removal
- Object Removal
- Resume Reviewer
- Community Feed (like/unlike, published creations)
- User Dashboard (recent creations, plan info)
- Authentication with Clerk
- Real-time notifications and loaders

## Tech Stack
- **Frontend:** React, Vite, Axios, Clerk, React Hot Toast, Lucide Icons
- **Backend:** Node.js, Express, PostgreSQL (Neon), Cloudinary, Multer
- **Deployment:** Vercel

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- PostgreSQL database (Neon or local)
- Cloudinary account (for image uploads)
- Clerk account (for authentication)

### Environment Variables
Create `.env` files in both `client/` and `server/` directories. Example:

#### `client/.env`
```
VITE_BASE_URL=http://localhost:3000
```

#### `server/.env`
```
DATABASE_URL=your_postgres_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLERK_SECRET_KEY=your_clerk_secret
```

### Installation

#### 1. Clone the repository
```
git clone https://github.com/duttaanirban/quick.ai.git
cd quick.ai
```

#### 2. Install dependencies
```
cd client
npm install
cd ../server
npm install
```

#### 3. Start the development servers
- Start backend:
  ```
  cd server
  npm run dev
  ```
- Start frontend:
  ```
  cd client
  npm run dev
  ```

#### 4. Open in browser
Visit `http://localhost:5173` (or the port shown in terminal).

## Deployment
- The project is ready for deployment on Vercel.
- Connect your GitHub repo to Vercel and set environment variables in the Vercel dashboard.
- Each push to the main branch will trigger an automatic deployment.

## Folder Structure
```
client/      # React frontend
server/      # Express backend
```

---
Made with ❤️ by Anirban Dutta
