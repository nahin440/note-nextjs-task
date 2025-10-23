// src/app/notes/[id]/edit/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import NoteForm from '@/components/NoteForm';
import { FaEdit, FaArrowLeft, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

interface Note {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export default function EditNotePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const noteId = params.id as string;
  
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (noteId && status === 'authenticated') {
      fetchNote();
    }
  }, [noteId, status]);

  const fetchNote = async () => {
    try {
      console.log('🔄 Fetching note with ID:', noteId);
      setLoading(true);
      setError('');
      
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'GET',
        credentials: 'include', // Add this line
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📡 API Response status:', response.status);
      console.log('📡 API Response ok:', response.ok);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.log('❌ API Error:', errorData);
        throw new Error(errorData.error || 'Failed to fetch note');
      }
      
      const data = await response.json();
      console.log('✅ Note data received:', data);
      setNote(data.note);
    } catch (err) {
      console.error('Error fetching note:', err);
      setError(err instanceof Error ? err.message : 'Failed to load note');
      toast.error(err instanceof Error ? err.message : 'Failed to load note');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="h-8 w-8 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading note...</p>
          <p className="text-sm text-gray-500 mt-2">ID: {noteId}</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect in useEffect
  }

  if (error && !note) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/notes"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-6"
          >
            <FaArrowLeft className="mr-2 h-4 w-4" />
            Back to Notes
          </Link>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <FaExclamationTriangle className="h-5 w-5 text-red-400 mr-2" />
              <h2 className="text-lg font-semibold text-red-800">Error Loading Note</h2>
            </div>
            <p className="text-red-700 mb-4">{error}</p>
            <div className="flex space-x-3">
              <button
                onClick={fetchNote}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
              <Link
                href="/notes"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Notes
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Note Not Found</h1>
            <p className="text-gray-600 mb-4">
              The note you are looking for does not exist or you do not have permission to access it.
            </p>
            <p className="text-sm text-gray-500 mb-4 break-all">
              Note ID: {noteId}
            </p>
            <Link
              href="/notes"
              className="text-indigo-600 hover:text-indigo-700"
            >
              Return to Notes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FaEdit className="h-8 w-8 text-indigo-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Note</h1>
                <p className="text-gray-600 mt-1">
                  Update your note content, title, or tags.
                </p>
              </div>
            </div>
            <Link
              href={`/notes/${noteId}`}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaArrowLeft className="mr-2 h-4 w-4" />
              Back to Note
            </Link>
          </div>
          
          {/* Note Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex flex-wrap gap-4 text-sm text-blue-800">
              <div>
                <span className="font-medium">Created:</span>{' '}
                {new Date(note.createdAt).toLocaleDateString()} at{' '}
                {new Date(note.createdAt).toLocaleTimeString()}
              </div>
              <div>
                <span className="font-medium">Last Updated:</span>{' '}
                {new Date(note.updatedAt).toLocaleDateString()} at{' '}
                {new Date(note.updatedAt).toLocaleTimeString()}
              </div>
              <div>
                <span className="font-medium">Tags:</span>{' '}
                {note.tags.length > 0 ? note.tags.join(', ') : 'No tags'}
              </div>
            </div>
          </div>
        </div>

        {/* Note Form */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <NoteForm 
            initialData={note}
            isEditing={true}
          />
        </div>
      </div>
    </div>
  );
}