// src/components/RichTextEditor.tsx
'use client';
import dynamic from 'next/dynamic';
import { FaSpinner } from 'react-icons/fa';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

// Dynamic import with ALL TipTap components to avoid any SSR
const TipTapEditor = dynamic(
  () => {
    return Promise.all([
      import('@tiptap/react'),
      import('@tiptap/starter-kit'),
      import('react-icons/fa')
    ]).then(([{ useEditor, EditorContent }, StarterKit, icons]) => {
      const { 
        FaBold, 
        FaItalic, 
        FaListUl, 
        FaListOl, 
        FaQuoteLeft,
        FaUndo,
        FaRedo,
        FaHeading 
      } = icons;

      return function TipTapEditorComponent({ content, onChange }: RichTextEditorProps) {
        const editor = useEditor({
          extensions: [StarterKit.default],
          content: content,
          onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
          },
          editorProps: {
            attributes: {
              class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4',
            },
          },
          immediatelyRender: false,
        });

        if (!editor) {
          return (
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="min-h-[300px] p-4 bg-white flex items-center justify-center">
                <FaSpinner className="h-6 w-6 text-indigo-600 animate-spin" />
              </div>
            </div>
          );
        }

        return (
          <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
            {/* Toolbar */}
            <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 flex flex-wrap items-center gap-1">
              {/* Text Formatting */}
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                  editor.isActive('bold') ? 'bg-gray-300' : ''
                }`}
                title="Bold"
              >
                <FaBold className="h-4 w-4" />
              </button>
              
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                  editor.isActive('italic') ? 'bg-gray-300' : ''
                }`}
                title="Italic"
              >
                <FaItalic className="h-4 w-4" />
              </button>

              {/* Headings */}
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                  editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''
                }`}
                title="Heading"
              >
                <FaHeading className="h-4 w-4" />
              </button>

              {/* Lists */}
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                  editor.isActive('bulletList') ? 'bg-gray-300' : ''
                }`}
                title="Bullet List"
              >
                <FaListUl className="h-4 w-4" />
              </button>
              
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                  editor.isActive('orderedList') ? 'bg-gray-300' : ''
                }`}
                title="Numbered List"
              >
                <FaListOl className="h-4 w-4" />
              </button>

              {/* Blockquote */}
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                  editor.isActive('blockquote') ? 'bg-gray-300' : ''
                }`}
                title="Quote"
              >
                <FaQuoteLeft className="h-4 w-4" />
              </button>

              {/* Divider */}
              <div className="w-px h-6 bg-gray-300 mx-1"></div>

              {/* Undo/Redo */}
              <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                className="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Undo"
              >
                <FaUndo className="h-4 w-4" />
              </button>
              
              <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                className="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Redo"
              >
                <FaRedo className="h-4 w-4" />
              </button>
            </div>

            {/* Editor Content */}
            <EditorContent 
              editor={editor} 
              className="min-h-[300px] max-h-[500px] overflow-y-auto"
            />
          </div>
        );
      };
    });
  },
  {
    ssr: false,
    loading: () => (
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 flex flex-wrap items-center gap-1">
          {/* Toolbar skeleton */}
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
        <div className="min-h-[300px] p-4 bg-white flex items-center justify-center">
          <div className="text-center">
            <FaSpinner className="h-6 w-6 text-indigo-600 animate-spin mx-auto mb-2" />
            <p className="text-sm text-gray-500">Loading editor...</p>
          </div>
        </div>
      </div>
    ),
  }
);

export default function RichTextEditor(props: RichTextEditorProps) {
  return <TipTapEditor {...props} />;
}