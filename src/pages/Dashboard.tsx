import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { type Document } from "../components/DocumentCard";
import DashboardHeader from "../components/DashboardHeader";
import DocumentList from "../components/DocumentList";

const Dashboard = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await api.get("/api/documents");
        setDocuments(response.data);
      } catch (err) {
        console.error("Failed to fetch documents", err);
        setError("Failed to load documents");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleCreateDocument = async () => {
    try {
      const response = await api.post("/api/documents", {
        title: "Untitled Document",
      });
      const newDoc = response.data;
      navigate(`/doc/${newDoc.id}`);
    } catch (err) {
      console.error("Failed to create document", err);
      setError("Failed to create new document");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen font-serif">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-4 text-red-600 border border-red-200 bg-red-50 p-2">
            {error}
          </div>
        )}

        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-2xl font-serif font-bold text-gray-900">
            Your Documents
          </h2>
          <button
            onClick={handleCreateDocument}
            className="px-6 py-2 border border-black text-sm font-medium text-white bg-black hover:bg-white hover:text-black transition-colors duration-200"
          >
            + New Document
          </button>
        </div>

        <div className="bg-white">
          <DocumentList
            documents={documents}
            onCreateDocument={handleCreateDocument}
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
