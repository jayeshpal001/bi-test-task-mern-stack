import { useParams } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

export default function GroupDetailsPage() {
  const { groupId } = useParams();

  // Temporary mock data
  const [group, setGroup] = useState({
    id: groupId,
    name: 'Family Vacation',
    members: ['user1@test.com', 'user2@test.com'],
    expenses: [
      { id: 1, description: 'Hotel', amount: 200, paidBy: 'user1@test.com' },
      { id: 2, description: 'Dinner', amount: 150.5, paidBy: 'user2@test.com' },
    ]
  });

  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(group.members[0]);

  const total = group.expenses.reduce((sum, e) => sum + e.amount, 0);

  const handleAddExpense = (e) => {
    e.preventDefault();

    const newExpense = {
      id: group.expenses.length + 1,
      description: desc,
      amount: parseFloat(amount),
      paidBy
    };

    setGroup({
      ...group,
      expenses: [...group.expenses, newExpense]
    });

    setDesc('');
    setAmount('');
    setPaidBy(group.members[0]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{group.name}</h1>
          <div className="bg-green-100 px-4 py-2 rounded-full text-green-800 font-semibold text-sm">
            Total: ₹{total.toFixed(2)}
          </div>
        </div>

        {/* Add Expense Form */}
        <form onSubmit={handleAddExpense} className="mb-10 bg-white p-6 rounded-lg shadow-md space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Add Expense</h2>
          <input
            type="text"
            placeholder="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          >
            {group.members.map((member, idx) => (
              <option key={idx} value={member}>
                {member}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Add Expense
          </button>
        </form>

        {/* Expenses List */}
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Expenses</h2>
        <div className="space-y-4">
          {group.expenses.map((expense) => (
            <div
              key={expense.id}
              className="bg-white p-4 rounded-lg shadow-md border border-gray-100"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-800">{expense.description}</h3>
                  <p className="text-sm text-gray-500">Paid by {expense.paidBy}</p>
                </div>
                <div className="flex items-center gap-2">
                  <CurrencyDollarIcon className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-700">₹{expense.amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
