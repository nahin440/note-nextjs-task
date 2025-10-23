// src/app/notes/page.tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaPlus, FaSearch, FaSort, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface Note {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    fetchNotes();
  }, [search, selectedTag, sortBy]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedTag) params.append('tag', selectedTag);
      if (sortBy) params.append('sort', sortBy);

      const response = await fetch(`/api/notes?${params}`, {
        credentials: 'include',
      });
      const data = await response.json();
      
      if (response.ok) {
        setNotes(data.notes);
        // Extract all unique tags
        const tags = new Set<string>();
        data.notes.forEach((note: Note) => {
          note.tags.forEach(tag => tags.add(tag));
        });
        setAllTags(Array.from(tags));
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        toast.success('Note deleted successfully');
        fetchNotes(); // Refresh the list
      } else {
        toast.error('Failed to delete note');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
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
    return html.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Notes</h1>
            <p className="text-gray-600 mt-2">Manage your notes and ideas</p>
          </div>
          <Link
            href="/notes/create"
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            <FaPlus className="mr-2 h-4 w-4" />
            New Note
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Tag Filter */}
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>

            {/* Sort */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSort className="h-4 w-4 text-gray-400" />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="updatedAt">Last Updated</option>
                <option value="createdAt">Date Created</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border p-6 h-64">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <FaSearch className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No notes found</h3>
            <p className="mt-2 text-gray-500">
              {search || selectedTag ? 'Try changing your filters' : 'Get started by creating your first note'}
            </p>
            <Link
              href="/notes/create"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              <FaPlus className="mr-2 h-4 w-4" />
              Create Note
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div
                key={note._id}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <Link 
                      href={`/notes/${note._id}`}
                      className="text-lg font-semibold text-gray-900 line-clamp-2 hover:text-indigo-600 transition-colors flex-1 mr-2"
                    >
                      {note.title}
                    </Link>
                    <div className="flex space-x-2">
                      {/* View Button */}
                      <Link
                        href={`/notes/${note._id}`}
                        className="text-gray-400 hover:text-indigo-600 transition-colors"
                        title="View Note"
                      >
                        <FaEye className="h-4 w-4" />
                      </Link>
                      {/* Edit Button */}
                      <Link
                        href={`/notes/${note._id}/edit`}
                        className="text-gray-400 hover:text-indigo-600 transition-colors"
                        title="Edit Note"
                      >
                        <FaEdit className="h-4 w-4" />
                      </Link>
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(note._id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete Note"
                      >
                        <FaTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <Link 
                    href={`/notes/${note._id}`}
                    className="block"
                  >
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 hover:text-gray-800 transition-colors">
                      {stripHtml(note.content)}
                    </p>
                  </Link>

                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
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

                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Updated {formatDate(note.updatedAt)}</span>
                    <span>Created {formatDate(note.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {notes.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/notes/create"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <FaPlus className="mr-2 h-4 w-4" />
                Create New Note
              </Link>
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedTag('');
                  setSortBy('updatedAt');
                }}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaSearch className="mr-2 h-4 w-4" />
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}