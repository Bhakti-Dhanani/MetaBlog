"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useState, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="border rounded-md p-2 min-h-[150px] bg-gray-50"></div>;

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="border-b p-1 bg-gray-50 flex space-x-1">
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`p-1 rounded ${editor?.isActive('bold') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        >
          <span className="font-bold">B</span>
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`p-1 rounded ${editor?.isActive('italic') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        >
          <span className="italic">I</span>
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={`p-1 rounded ${editor?.isActive('bulletList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        >
          <span className="text-sm">• List</span>
        </button>
      </div>
      <EditorContent
        editor={editor}
        className="p-3 min-h-[200px] prose max-w-none"
      />
    </div>
  );
}