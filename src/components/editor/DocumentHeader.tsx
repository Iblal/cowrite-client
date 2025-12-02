import React from "react";

interface DocumentHeaderProps {
  title: string;
  status: string;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTitleBlur: () => void;
}

const DocumentHeader = ({
  title,
  status,
  onTitleChange,
  onTitleBlur,
}: DocumentHeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-200 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center relative group">
            <input
              className="text-xl font-serif font-bold text-gray-900 bg-transparent border border-transparent hover:border-gray-300 hover:bg-gray-50 rounded px-2 -ml-2 focus:border-gray-400 focus:bg-white focus:outline-none truncate max-w-md transition-colors duration-200"
              value={title}
              onChange={onTitleChange}
              onBlur={onTitleBlur}
              placeholder="Untitled document"
            />
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
              Rename
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {status === "Saving..." ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="text-xs uppercase tracking-widest text-gray-400">
                  Saving...
                </span>
              </>
            ) : status === "Saved" ? (
              <>
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                  />
                </svg>
                <span className="text-xs uppercase tracking-widest text-gray-400">
                  Saved
                </span>
              </>
            ) : (
              <span className="text-xs uppercase tracking-widest text-gray-400">
                {status}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DocumentHeader;
