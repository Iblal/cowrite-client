import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import api from "../api/axios";
import DocumentHeader from "../components/editor/DocumentHeader";
import EditorToolbar from "../components/editor/EditorToolbar";
import EditorContentArea from "../components/editor/EditorContentArea";
import Collaboration from "@tiptap/extension-collaboration";
import { HocuspocusProvider } from "@hocuspocus/provider";

interface Document {
  id: string;
  title: string;
  content?: any;
  yjs_state_blob?: any;
}

const DocumentEditor = () => {
  const { id } = useParams<{ id: string }>();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("Saved");
  const isContentDirty = useRef(false);
  const titleDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const provider = new HocuspocusProvider({
    url: "ws://localhost:5002",
    name: id ?? "unknown",
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        undoRedo: false,
        link: false,
        underline: false,
      }),
      Collaboration.configure({
        document: provider.document,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Superscript,
      Subscript,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Image,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (!editor || !id) return;

    let debounceTimer: ReturnType<typeof setTimeout>;

    const saveContent = async () => {
      const html = editor.getHTML();
      try {
        await api.put(`/api/documents/${id}`, {
          content: html,
        });
        isContentDirty.current = false;
        setStatus("Saved");
      } catch (err) {
        console.error("Failed to save content", err);
        setStatus("Error saving");
      }
    };

    const handleUpdate = () => {
      isContentDirty.current = true;
      setStatus("Saving...");
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(saveContent, 1000);
    };

    editor.on("update", handleUpdate);

    return () => {
      editor.off("update", handleUpdate);
      clearTimeout(debounceTimer);
    };
  }, [editor, id]);

  useEffect(() => {
    const fetchDocument = async () => {
      if (!id) return;
      try {
        const response = await api.get(`/api/documents/${id}`);
        const doc = response.data;
        setDocument(doc);

        if (!doc) {
          return;
        }
      } catch (err) {
        console.error("Failed to fetch document", err);
        setError("Failed to load document");
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  const saveTitle = async (newTitle: string) => {
    if (!id) return;
    try {
      await api.put(`/api/documents/${id}`, {
        title: newTitle.trim(),
      });
      if (!isContentDirty.current) {
        setStatus("Saved");
      }
    } catch (err) {
      console.error("Failed to save title", err);
      setStatus("Error saving");
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDocument((prev) => (prev ? { ...prev, title: value } : prev));

    setStatus("Saving...");

    if (titleDebounceRef.current) {
      clearTimeout(titleDebounceRef.current);
    }

    titleDebounceRef.current = setTimeout(() => {
      saveTitle(value);
    }, 1000);
  };

  const handleTitleBlur = () => {
    if (!document) return;
    const trimmed = document.title.trim();
    if (trimmed !== document.title) {
      setDocument((prev) => (prev ? { ...prev, title: trimmed } : prev));
      if (titleDebounceRef.current) {
        clearTimeout(titleDebounceRef.current);
      }
      saveTitle(trimmed);
    }
  };

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
      <DocumentHeader
        title={document.title ?? ""}
        status={status}
        onTitleChange={handleTitleChange}
        onTitleBlur={handleTitleBlur}
      />
      <EditorToolbar editor={editor} />
      <EditorContentArea editor={editor} />
    </div>
  );
};

export default DocumentEditor;
