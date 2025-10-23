'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaEdit, FaTrash, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface Note {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export default function ViewNotePage() {
  const params = useParams();
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchNote();
    }
  }, [params.id]);

  const fetchNote = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔄 Fetching note with ID:', params.id);
      
      const response = await fetch(`/api/notes/${params.id}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📡 API Response status:', response.status);
      console.log('📡 API Response ok:', response.ok);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ API Error:', errorData);
        setError(errorData.error || 'Failed to fetch note');
        toast.error(errorData.error || 'Failed to fetch note');
        return;
      }
      
      const data = await response.json();
      console.log('✅ Note loaded successfully:', data.note);
      setNote(data.note);
      
    } catch (error) {
      console.error('💥 Network error:', error);
      setError('Network error. Please check your connection.');
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!note) return;
    
    if (!confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/notes/${note._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        toast.success('Note deleted successfully');
        router.push('/notes');
        router.refresh();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete note');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete note');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="h-8 w-8 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading note...</p>
          <p className="text-sm text-gray-500 mt-2">ID: {params.id}</p>
        </div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Note Not Found</h1>
          <p className="text-gray-600 mb-4">
            {error || 'The note you are looking for does not exist or you do not have permission to access it.'}
          </p>
          <p className="text-sm text-gray-500 mb-4 break-all">
            Note ID: {params.id}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={fetchNote}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
            <Link
              href="/notes"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaArrowLeft className="mr-2 h-4 w-4" />
              Back to Notes
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <Link
              href="/notes"
              className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              <FaArrowLeft className="mr-2 h-4 w-4" />
              Back to Notes
            </Link>
            
            <div className="flex gap-3">
              <Link
                href={`/notes/${note._id}/edit`}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <FaEdit className="mr-2 h-4 w-4" />
                Edit Note
              </Link>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                <FaTrash className="mr-2 h-4 w-4" />
                Delete
              </button>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{note.title}</h1>
          
          {/* Note Metadata */}
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

        {/* Note Content */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: note.content }}
            />
          </div>
        </div>

        {/* Tags */}
        {note.tags.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}