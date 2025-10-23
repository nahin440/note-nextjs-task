# NoteApp - Personal Note-Taking Application

A modern, full-stack note-taking application built with Next.js featuring rich text editing, authentication, and real-time CRUD operations.

![NoteApp](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)

## 🌟 Features

### 🔐 Authentication & Security
- **Secure Authentication** with NextAuth.js
- Email/Password registration and login
- Protected routes and API endpoints
- Password hashing with bcrypt
- Session management

### 📝 Rich Note Management
- **Rich Text Editor** with TipTap
- Create, read, update, and delete notes
- Real-time content editing with formatting tools
- Auto-save functionality
- Responsive note previews

### 🏷️ Advanced Organization
- **Tagging System** for note categorization
- Multiple tags per note
- Tag-based filtering and search
- Quick tag management

### 🔍 Smart Search & Filtering
- Full-text search across titles and content
- Tag-based filtering
- Sort by date created, updated, or title
- Real-time search results

### 🎨 Modern UI/UX
- **Dark/Light Theme** with smooth transitions
- Responsive design for all devices
- Glass morphism effects
- Smooth animations with Framer Motion
- Professional color scheme
- Loading states and skeleton screens

## 🚀 Tech Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **React Icons** for beautiful icons

### Backend
- **Next.js API Routes**
- **NextAuth.js** for authentication
- **MongoDB** with Mongoose (database)
- **bcryptjs** for password hashing

### Rich Text Editor
- **TipTap** with Starter Kit
- Bold, italic, headings, lists, quotes
- Undo/redo functionality
- Clean HTML output

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth routes
│   │   ├── notes/         # Notes CRUD operations
│   │   └── register/      # User registration
│   ├── dashboard/         # Protected dashboard
│   ├── notes/             # Notes management
│   │   ├── [id]/         # Individual note view
│   │   ├── create/        # Create new note
│   │   └── edit/          # Edit existing note
│   ├── login/             # Login page
│   └── register/          # Registration page
├── components/            # React components
│   ├── AuthProvider.tsx   # Authentication context
│   ├── ClientAOS.tsx      # Animation setup
│   ├── Navigation.tsx     # Main navigation
│   ├── NoteForm.tsx       # Note creation/editing form
│   ├── RichTextEditor.tsx # TipTap editor component
│   └── ThemeProvider.tsx  # Dark/light theme context
└── lib/                   # Utility libraries
    ├── auth.ts           # NextAuth configuration
    └── db.ts             # Database connection
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- MongoDB database
- npm or yarn

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd note-app
```

### 2. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/noteapp

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-nextauth-secret-key-here

# Optional: For production
NEXTAUTH_URL=https://your-app.vercel.app
```

### 4. Database Setup
Make sure MongoDB is running. The application will automatically create the necessary collections.

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Notes
- `GET /api/notes` - Get user's notes (with search & filter)
- `POST /api/notes` - Create new note
- `GET /api/notes/[id]` - Get specific note
- `PUT /api/notes/[id]` - Update note
- `DELETE /api/notes/[id]` - Delete note

## 🎯 Usage Guide

### Creating an Account
1. Navigate to `/register`
2. Enter your name, email, and password
3. Click "Create Account"
4. You'll be redirected to login

### Managing Notes
1. **Create Note**: Click "New Note" from dashboard or notes page
2. **Edit Note**: Click the edit icon on any note card
3. **View Note**: Click on any note title or view icon
4. **Delete Note**: Click the trash icon (confirmation required)

### Using Tags
- Add tags when creating/editing notes
- Use the tag filter in the notes page
- Tags are automatically converted to lowercase

### Search & Filter
- Use the search bar to find notes by title or content
- Filter by specific tags using the tag dropdown
- Sort by date created, updated, or title

## 🌙 Theme System
- Click the theme toggle in the navigation bar
- System remembers your preference
- Smooth transitions between themes

## 🚀 Deployment on Vercel

### Step 1: Prepare for Deployment
1. **Update Environment Variables** for production:
```env
NEXTAUTH_URL=https://your-app.vercel.app
MONGODB_URI=your-mongodb-atlas-connection-string
```

2. **Create MongoDB Atlas** (if using cloud database):
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Get your connection string
   - Add your IP to whitelist
   - Create a database user

### Step 2: Deploy to Vercel

#### Option A: Deploy from GitHub
1. **Push to GitHub:**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables:
     - `NEXTAUTH_URL`: Your Vercel app URL
     - `NEXTAUTH_SECRET`: Generate a strong secret
     - `MONGODB_URI`: Your MongoDB connection string

3. **Click Deploy**

#### Option B: Deploy using Vercel CLI
1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Deploy:**
```bash
vercel
```

3. **Follow the prompts** and add environment variables

### Step 3: Post-Deployment Setup

1. **Verify Deployment:**
   - Check if your app is running
   - Test authentication flow
   - Verify note CRUD operations

2. **Set up Custom Domain** (Optional):
   - In Vercel dashboard, go to your project
   - Click "Domains"
   - Add your custom domain

### Environment Variables for Vercel

Add these in your Vercel project settings:

```env
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=generate-a-strong-secret-here
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/noteapp
```

### Generating NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```

## 🔧 Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Check NEXTAUTH_URL matches your deployment URL
   - Verify NEXTAUTH_SECRET is set
   - Ensure MongoDB connection is working

2. **Database Connection Issues**
   - Verify MONGODB_URI is correct
   - Check if IP is whitelisted in MongoDB Atlas
   - Ensure database user has correct permissions

3. **Build Failures**
   - Check for TypeScript errors
   - Verify all environment variables are set
   - Ensure all dependencies are installed

## 📝 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the troubleshooting section
2. Search existing GitHub issues
3. Create a new issue with details

---

**Built with ❤️ using Next.js, TypeScript, and TailwindCSS**

## 🎉 Success Criteria Met
