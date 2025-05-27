import { Link } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
  const groups = [
    { id: 1, name: 'Family Trip', members: ['you@test.com', 'mom@test.com'] },
    { id: 2, name: 'Office Team', members: ['you@test.com', 'john@office.com'] }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">Your Groups</h1>
          <Link
            to="/create-group"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition"
          >
            <PlusIcon className="w-5 h-5" />
            New Group
          </Link>
        </div>

        {groups.length === 0 ? (
          <p className="text-gray-500">You have not created or joined any groups yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {groups.map((group) => (
              <div
                key={group.id}
                className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-all duration-200"
              >
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{group.name}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Members: <span className="text-gray-700">{group.members.join(', ')}</span>
                </p>
                <Link
                  to={`/group/${group.id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium transition"
                >
                  View Expenses →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
