// src/app/page.tsx
import Link from 'next/link';
import { FaStickyNote, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <FaStickyNote className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">NoteApp</span>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/login"
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                <FaSignInAlt className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
              <Link
                href="/register"
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <FaUserPlus className="h-4 w-4" />
                <span>Sign Up</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Organize Your
            <span className="text-indigo-600"> Thoughts</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A beautiful, secure note-taking app that helps you capture your ideas, 
            organize your tasks, and access your notes from anywhere.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <FaUserPlus className="mr-2 h-5 w-5" />
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-indigo-700 bg-indigo-100 rounded-lg hover:bg-indigo-200 transition-colors"
            >
              <FaSignInAlt className="mr-2 h-5 w-5" />
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <FaStickyNote className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Rich Text Notes</h3>
            <p className="text-gray-600">Create beautiful notes with rich text formatting, lists, and more.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <FaStickyNote className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Tagging</h3>
            <p className="text-gray-600">Organize your notes with tags and find them instantly.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <FaStickyNote className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Private</h3>
            <p className="text-gray-600">Your notes are encrypted and only accessible by you.</p>
          </div>
        </div>
      </div>
    </div>
  );
}