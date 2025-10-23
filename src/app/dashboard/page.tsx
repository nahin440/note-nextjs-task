// src/app/dashboard/page.tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaStickyNote, FaPlus, FaClock, FaSearch } from 'react-icons/fa';

interface Note {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const [recentNotes, setRecentNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalNotes: 0,
    totalTags: 0,
  });

  useEffect(() => {
    fetchRecentNotes();
  }, []);

  const fetchRecentNotes = async () => {
    try {
      const response = await fetch('/api/notes?sort=updatedAt&limit=5', {
        credentials: 'include',
      });
      const data = await response.json();
      
      if (response.ok) {
        setRecentNotes(data.notes);
        // Calculate stats
        const allTags = new Set();
        data.notes.forEach((note: Note) => {
          note.tags.forEach(tag => allTags.add(tag));
        });
        setStats({
          totalNotes: data.notes.length,
          totalTags: allTags.size,
        });
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '').substring(0, 100) + '...';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded mb-4"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here is your recent activity.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <FaStickyNote className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Notes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalNotes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <FaSearch className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tags</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTags}</p>
              </div>
            </div>
          </div>

          <Link
            href="/notes/create"
            className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-indigo-100 mr-4">
                <FaPlus className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Create New Note</p>
                <p className="text-lg font-semibold text-indigo-600">Add Note</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Notes */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <FaClock className="mr-2 h-5 w-5 text-gray-400" />
              Recent Notes
            </h2>
          </div>
          
          {recentNotes.length === 0 ? (
            <div className="p-12 text-center">
              <FaStickyNote className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No notes yet</h3>
              <p className="mt-2 text-gray-500">Get started by creating your first note.</p>
              <Link
                href="/notes/create"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                <FaPlus className="mr-2 h-4 w-4" />
                Create Note
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {recentNotes.map((note) => (
                <Link
                  key={note._id}
                  href={`/notes/${note._id}`}
                  className="block p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{note.title}</h3>
                    <span className="text-sm text-gray-500">
                      {formatDate(note.updatedAt)}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3 line-clamp-2">
                    {stripHtml(note.content)}
                  </p>
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {note.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        {recentNotes.length > 0 && (
          <div className="mt-6 text-center">
            <Link
              href="/notes"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              View all notes
              <FaSearch className="ml-2 h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}