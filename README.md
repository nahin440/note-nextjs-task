# NoteApp

A modern note-taking app built with Next.js, TypeScript, and MongoDB.

**Live Demo: https://note-nextjs-task.vercel.app/**

## Features
- User authentication (register/login)
- Create, edit, delete notes
- Rich text editor with TipTap
- Tag system for organization
- Search and filter notes
- Responsive design

## Tech Stack
- Next.js 14
- TypeScript
- MongoDB
- NextAuth.js
- TailwindCSS
- TipTap Editor

## Quick Start
```bash
git clone <repo>
cd note-app
npm install
npm run dev
```

Set up environment variables:
```env
MONGODB_URI=your_mongodb_connection
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret
```

Visit `http://localhost:3000` to use the app.