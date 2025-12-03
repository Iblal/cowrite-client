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
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import { HocuspocusProvider } from "@hocuspocus/provider";

interface DocumentMetaData {
  id: string;
  title: string;
  owner: {
    name: string;
    email: string;
  };
  collaborators: {
    email: string;
    permission: "read" | "write";
  }[];
  currentUserPermission?: "owner" | "write" | "read";
}

const DocumentEditor = () => {
  const { id } = useParams<{ id: string }>();

  const [document, setDocument] = useState<DocumentMetaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("Saved");

  const titleDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const DEBOUNCE_MS = 1000;

  const provider = new HocuspocusProvider({
    url: "ws://localhost:5002",
    name: id ?? "unknown",
    token: localStorage.getItem("token") || "",
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
      CollaborationCaret.configure({
        provider,
        user: {
          name: "A user",
          color: "#f783ac",
        },
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
    if (editor && document) {
      const isReadOnly = document.currentUserPermission === "read";
      editor.setEditable(!isReadOnly);
    }
  }, [editor, document]);

  useEffect(() => {
    if (!editor) return;

    let timeout: ReturnType<typeof setTimeout> | null = null;

    const handleUpdate = () => {
      setStatus("Saving...");

      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        setStatus("Saved");
      }, DEBOUNCE_MS);
    };

    editor.on("update", handleUpdate);

    return () => {
      editor.off("update", handleUpdate);
      if (timeout) clearTimeout(timeout);
    };
  }, [editor]);

  useEffect(() => {
    const fetchDocument = async () => {
      if (!id) return;
      try {
        const response = await api.get(`/api/documents/${id}`);
        const doc = response.data as DocumentMetaData | null;

        if (!doc) {
          setLoading(false);
          return;
        }

        setDocument(doc);
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
      setStatus("Saved");
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
    }, DEBOUNCE_MS);
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

  const handleShare = async (email: string, permission: "read" | "write") => {
    try {
      await api.post(`/api/documents/${id}/share`, { email, permission });

      const isUpdate = document?.collaborators?.some((c) => c.email === email);

      setDocument((prev) => {
        if (!prev) return prev;
        const newCollaborators = [...(prev.collaborators || [])];
        const existingIndex = newCollaborators.findIndex(
          (c) => c.email === email
        );

        if (existingIndex >= 0) {
          newCollaborators[existingIndex] = { email, permission };
        } else {
          newCollaborators.push({ email, permission });
        }

        return { ...prev, collaborators: newCollaborators };
      });

      if (!isUpdate) {
        alert("Shared successfully!");
      }
    } catch (error) {
      console.error("Failed to share document:", error);
      alert("Failed to share document");
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
        owner={document.owner}
        collaborators={document.collaborators}
        isOwner={document.currentUserPermission === "owner"}
        onTitleChange={handleTitleChange}
        onTitleBlur={handleTitleBlur}
        onShare={handleShare}
      />
      <EditorToolbar editor={editor} />
      <EditorContentArea editor={editor} />
    </div>
  );
};

export default DocumentEditor;
