import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import api from "../api/axios";

interface Document {
  id: string;
  title: string;
  content?: any; // JSON content if available
  yjs_state_blob?: any;
}

const DocumentEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "", // Initial content
    onUpdate: () => {
      // Handle updates, maybe auto-save in future
      // const json = editor.getJSON();
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
      },
    },
  });

  useEffect(() => {
    const fetchDocument = async () => {
      if (!id) return;
      try {
        const response = await api.get(`/api/documents/${id}`);
        const doc = response.data;
        setDocument(doc);

        // If the server returns content in a format Tiptap understands (JSON or HTML), set it.
        // For now, if there's a 'content' field, we use it.
        // If only yjs_state_blob is present and we don't have Yjs set up, we might start empty.
        if (editor && doc.content) {
          editor.commands.setContent(doc.content);
        } else if (editor && doc.yjs_state_blob) {
          // Placeholder: We can't decode Yjs blob without Yjs lib.
          // Assuming server might provide a converted content or we start empty.
          console.warn("Yjs blob found but Yjs not implemented in client yet.");
        }
      } catch (err) {
        console.error("Failed to fetch document", err);
        setError("Failed to load document");
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id, editor]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen font-serif">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-600 font-serif">
        Error: {error}
      </div>
    );
  if (!document)
    return (
      <div className="flex justify-center items-center h-screen font-serif">
        Document not found
      </div>
    );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-white border-b border-gray-200 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/dashboard")}
              className="mr-6 text-gray-400 hover:text-black transition-colors"
            >
              &larr; Back
            </button>
            <h1 className="text-xl font-serif font-bold text-gray-900 truncate max-w-md">
              {document.title}
            </h1>
          </div>
          <div>
            <span className="text-xs uppercase tracking-widest text-gray-400">
              Saved
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto min-h-[calc(100vh-10rem)]">
          <EditorContent
            editor={editor}
            className="h-full focus:outline-none"
          />
        </div>
      </main>
    </div>
  );
};

export default DocumentEditor;
