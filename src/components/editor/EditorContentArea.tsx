import React from "react";
import { EditorContent, Editor } from "@tiptap/react";

interface EditorContentAreaProps {
  editor: Editor | null;
}

const EditorContentArea: React.FC<EditorContentAreaProps> = ({ editor }) => {
  return (
    <main className="flex-1 overflow-y-auto py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-3xl mx-auto min-h-[calc(100vh-10rem)] border border-gray-200 rounded-lg shadow-sm p-6 bg-white">
        <EditorContent editor={editor} className="h-full focus:outline-none" />
      </div>
    </main>
  );
};

export default EditorContentArea;
