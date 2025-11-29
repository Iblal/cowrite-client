import { Link } from "react-router-dom";

export interface Document {
  id: string;
  title: string;
  updated_at: string;
}

const DocumentCard = ({ doc }: { doc: Document }) => (
  <Link
    to={`/doc/${doc.id}`}
    className="block group p-6 border border-gray-200 hover:border-black transition-colors duration-200"
  >
    <div className="flex flex-col h-full justify-between">
      <div>
        <h3 className="text-lg font-medium text-gray-900 group-hover:text-black truncate font-serif">
          {doc.title || "Untitled"}
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Edited {new Date(doc.updated_at).toLocaleString()}
        </p>
      </div>
      <div className="mt-4 flex justify-end">
        <span className="text-xs font-medium text-gray-400 group-hover:text-black transition-colors">
          Open &rarr;
        </span>
      </div>
    </div>
  </Link>
);

export default DocumentCard;
