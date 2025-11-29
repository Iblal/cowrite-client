import DocumentCard, { type Document } from "./DocumentCard";

interface DocumentListProps {
  documents: Document[];
  onCreateDocument: () => void;
}

const DocumentList = ({ documents, onCreateDocument }: DocumentListProps) => {
  if (documents.length === 0) {
    return (
      <div className="p-12 text-center border border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500 mb-4">No documents found.</p>
        <button
          onClick={onCreateDocument}
          className="text-black underline hover:text-gray-600"
        >
          Create one to get started
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {documents.map((doc) => (
        <DocumentCard key={doc.id} doc={doc} />
      ))}
    </div>
  );
};

export default DocumentList;
