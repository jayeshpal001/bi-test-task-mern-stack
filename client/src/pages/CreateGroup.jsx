import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUturnLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';

export default function CreateGroup() {
  const [groupName, setGroupName] = useState('');
  const [emails, setEmails] = useState([]);
  const [inputEmail, setInputEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAddEmail = (e) => {
    e.preventDefault();
    if (inputEmail.trim() && validateEmail(inputEmail)) {
      setEmails([...emails, inputEmail.trim()]);
      setInputEmail('');
      setError('');
    } else {
      setError('Please enter a valid email address');
    }
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const removeEmail = (indexToRemove) => {
    setEmails(emails.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: groupName,
          members: emails
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create group');

      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-8"
        >
          <ArrowUturnLeftIcon className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="bg-white p-8 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Create New Group</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Name
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invite Members
              </label>
              <div className="border rounded-lg p-2 focus-within:ring-2 focus-within:ring-blue-500">
                <div className="flex flex-wrap gap-2 mb-2">
                  {emails.map((email, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {email}
                      <button
                        type="button"
                        onClick={() => removeEmail(index)}
                        className="hover:text-blue-600"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddEmail(e)}
                    placeholder="Enter email and press Enter/Add"
                    className="flex-1 p-1 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddEmail}
                    className="bg-gray-100 px-4 py-1 rounded-lg hover:bg-gray-200"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !groupName || emails.length === 0}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="small" />
                  Creating...
                </>
              ) : (
                'Create Group'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}