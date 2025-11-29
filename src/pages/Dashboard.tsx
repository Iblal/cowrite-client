import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";

interface Document {
  id: string;
  title: string;
  updatedAt: string;
}

const Dashboard = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

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
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Logo size="md" />
          <div className="flex items-center space-x-6">
            <span className="text-gray-900 font-light">
              Welcome, {user?.name || user?.email}
            </span>
            <button
              onClick={logout}
              className="text-sm font-medium text-gray-500 hover:text-black transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

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
          {documents.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500 mb-4">No documents found.</p>
              <button
                onClick={handleCreateDocument}
                className="text-black underline hover:text-gray-600"
              >
                Create one to get started
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {documents.map((doc) => (
                <Link
                  key={doc.id}
                  to={`/doc/${doc.id}`}
                  className="block group p-6 border border-gray-200 hover:border-black transition-colors duration-200"
                >
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 group-hover:text-black truncate font-serif">
                        {doc.title || "Untitled"}
                      </h3>
                      <p className="mt-2 text-sm text-gray-500">
                        Edited {new Date(doc.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <span className="text-xs font-medium text-gray-400 group-hover:text-black transition-colors">
                        Open &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
