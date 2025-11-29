import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

const DashboardHeader = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Logo size="md" animated />
        <div className="flex items-center space-x-6">
          <span className="text-gray-900 font-light">
            Hello, {user?.name || user?.email}
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
  );
};

export default DashboardHeader;
