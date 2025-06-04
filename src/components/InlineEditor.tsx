import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

interface InlineEditorProps {
  content: string;
  onUpdate: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export const InlineEditor: React.FC<InlineEditorProps> = ({
  content,
  onUpdate,
  placeholder = 'Clique para editar...',
  className = ''
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: 'text-inherit',
          },
        },
        heading: {
          HTMLAttributes: {
            class: 'text-inherit',
          },
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      onUpdate(text);
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none ${className}`,
      },
    },
  });

  if (!editor) {
    return <div>{content}</div>;
  }

  return (
    <div className="inline-editor">
      <EditorContent 
        editor={editor} 
        className="min-h-[20px] cursor-text"
      />
    </div>
  );
};

export default InlineEditor; 