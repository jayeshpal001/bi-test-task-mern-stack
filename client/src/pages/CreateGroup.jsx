import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline';

export default function CreateGroup() {
  const [groupName, setGroupName] = useState('');
  const [emails, setEmails] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Connect to backend
    navigate('/dashboard');
  };

  return (
    <div className=" bg-gray-50 p-6 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-2xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
        >
          <ArrowUturnLeftIcon className="w-5 h-5" />
          Back
        </button>

        <h1 className="text-3xl font-bold mb-8 text-gray-800">Create New Group</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-1">
              Group Name
            </label>
            <input
              type="text"
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="emails" className="block text-sm font-medium text-gray-700 mb-1">
              Invite Members (comma-separated emails)
            </label>
            <textarea
              id="emails"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 resize-none"
              placeholder="e.g., member1@test.com, member2@test.com"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Group
          </button>
        </form>
      </div>
    </div>
  );
}
