import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function AddExpensePage() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  // Mock group members (in real case, fetch this)
  const members = ['user1@test.com', 'user2@test.com'];

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    paidBy: members[0],
    splitAmong: [members[0], members[1]]
  });

  const handleCheckboxChange = (email) => {
    setFormData((prev) => {
      const updated = prev.splitAmong.includes(email)
        ? prev.splitAmong.filter((e) => e !== email)
        : [...prev.splitAmong, email];
      return { ...prev, splitAmong: updated };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mock submit logic (replace with API)
    console.log('Expense submitted:', formData);
    alert('Expense added successfully!');
    navigate(`/group/${groupId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Add New Expense</h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              id="description"
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount (₹)
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Paid By</label>
            <select
              value={formData.paidBy}
              onChange={(e) => setFormData({ ...formData, paidBy: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            >
              {members.map((email) => (
                <option key={email} value={email}>
                  {email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Split Among</label>
            <div className="flex flex-col gap-2">
              {members.map((email) => (
                <label key={email} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.splitAmong.includes(email)}
                    onChange={() => handleCheckboxChange(email)}
                  />
                  <span>{email}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold"
          >
            Add Expense
          </button>
        </form>
      </div>
    </div>
  );
}
