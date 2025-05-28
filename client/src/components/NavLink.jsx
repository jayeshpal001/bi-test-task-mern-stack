import { Link, useNavigate } from 'react-router-dom';
import { HomeIcon, UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function NavLink() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo + Home Link */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <HomeIcon className="w-6 h-6 text-blue-600" />
          <span className="text-xl font-bold text-gray-800">ExpenseSplit</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Profile */}
          <Link
            to="/profile"
            className="text-gray-600 hover:text-blue-600 transition"
            title="Profile"
          >
            <UserCircleIcon className="w-6 h-6" />
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-red-600 transition"
            title="Logout"
          >
            <ArrowRightOnRectangleIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}
