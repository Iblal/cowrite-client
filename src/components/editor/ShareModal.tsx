import React, { useState } from "react";
import { X, UserPlus } from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (email: string, permission: "read" | "write") => void;
  title: string;
  owner?: {
    name: string;
    email: string;
  };
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  onShare,
  title,
  owner,
}) => {
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState<"read" | "write">("read");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onShare(email, permission);
    setEmail("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Share "{title}"
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {owner && (
              <div className="bg-gray-50 p-3 rounded-md border border-gray-200 mb-4">
                <p className="text-sm text-gray-500">Owner</p>
                <p className="text-sm font-medium text-gray-900">
                  {owner.name}{" "}
                  <span className="text-gray-500 font-normal">
                    ({owner.email})
                  </span>
                </p>
              </div>
            )}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="permission"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Permission
              </label>
              <select
                id="permission"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                value={permission}
                onChange={(e) =>
                  setPermission(e.target.value as "read" | "write")
                }
              >
                <option value="read">Read Only</option>
                <option value="write">Read & Write</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex items-center gap-2"
            >
              Share
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShareModal;
