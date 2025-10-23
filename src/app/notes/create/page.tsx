// src/app/notes/create/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import NoteForm from '@/components/NoteForm';
import { FaPlus, FaArrowLeft } from 'react-icons/fa';
import { useSession } from 'next-auth/react';

export default function CreateNotePage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FaPlus className="h-8 w-8 text-indigo-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Create New Note</h1>
                <p className="text-gray-600 mt-1">
                  Create a new note with rich text formatting and tags for better organization.
                </p>
              </div>
            </div>
            <Link
              href="/notes"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaArrowLeft className="mr-2 h-4 w-4" />
              Back to Notes
            </Link>
          </div>
          
          {/* Quick Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Tips for creating notes:</h3>
            <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
              <li>Use a descriptive title that summarizes your note</li>
              <li>Add tags to categorize and easily find your notes later</li>
              <li>Use the rich text editor to format your content with headings, lists, and more</li>
              <li>You can always edit your note later if needed</li>
            </ul>
          </div>
        </div>

        {/* Note Form */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <NoteForm />
        </div>
      </div>
    </div>
  );
}