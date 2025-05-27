import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { 
  PlusIcon, 
  ArrowRightOnRectangleIcon,
  UserGroupIcon,
  ChartBarIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';
export default function Dashboard() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }

        const response = await fetch('/api/groups', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch groups');
        }

        const data = await response.json();
        setGroups(data.groups.map(group => ({
          ...group,
          shortId: group._id.slice(-6).toUpperCase(),
          totalExpenses: group.expenses?.reduce((sum, e) => sum + e.amount, 0) || 0
        })));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:block w-64 bg-white shadow-lg p-4 fixed h-full">
        <div className="mb-8">
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
            <UserGroupIcon className="w-6 h-6 text-blue-600" />
            Expense Manager
          </h2>
        </div>
        
        <nav className="space-y-2">
          <NavLink to="/dashboard/groups" icon={<UserGroupIcon className="w-5 h-5" />}>
            Groups
          </NavLink>
          <NavLink to="/dashboard/expenses" icon={<ChartBarIcon className="w-5 h-5" />}>
            Expenses
          </NavLink>
          <NavLink to="/dashboard/profile" icon={<UserCircleIcon className="w-5 h-5" />}>
            Profile
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 flex-1 p-4 md:p-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Group Management</h1>
            <p className="text-gray-500 text-sm mt-1">
              {groups.length} groups • Updated: {new Date().toLocaleTimeString()}
            </p>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <Link
              to="/dashboard/create-group"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors text-sm md:text-base justify-center"
            >
              <PlusIcon className="w-4 h-4" />
              New Group
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2 transition-colors text-sm md:text-base"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="space-y-6">
          {error ? (
            <div className="bg-red-100 p-4 rounded-lg text-red-700">
              Error: {error}
            </div>
          ) : groups.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
              <img 
                src="/empty-state.svg" 
                className="w-48 mx-auto mb-4" 
                alt="No groups found" 
              />
              <h3 className="text-lg font-semibold mb-2">No Groups Found</h3>
              <p className="text-gray-500 mb-4">
                Start by creating your first expense sharing group
              </p>
              <Link
                to="/create-group"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg inline-block hover:bg-blue-700"
              >
                Create New Group
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {groups.map((group) => (
                <GroupCard key={group._id} group={group} />
              ))}
            </div>
          )}
        </div>

        {/* Nested Routes Container */}
        <Outlet />
      </main>
    </div>
  );
}

// Sub-components
const GroupCard = ({ group }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-3">
      <h3 className="font-semibold text-gray-800 truncate">{group.name}</h3>
      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
        ID: {group.shortId}
      </span>
    </div>
    
    <div className="text-sm text-gray-600 space-y-1 mb-4">
      <p className="truncate">
        Members: {group.members.slice(0, 3).join(', ')}
        {group.members.length > 3 && ` +${group.members.length - 3}`}
      </p>
      <p>Total Expenses: ${group.totalExpenses.toFixed(2)}</p>
    </div>

    <div className="flex gap-2">
      <Link
        to={`/dashboard/groups/${group._id}`}
        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
      >
        Manage Expenses →
      </Link>
    </div>
  </div>
);

const NavLink = ({ to, icon, children }) => (
  <Link
    to={to}
    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
  >
    {icon}
    {children}
  </Link>
);