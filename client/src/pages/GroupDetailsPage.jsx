import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

export default function GroupDetailsPage() {
  const { groupId } = useParams();

  // Temporary mock data
  const group = {
    id: groupId,
    name: 'Family Vacation',
    members: ['user1@test.com', 'user2@test.com'],
    expenses: [
      { id: 1, description: 'Hotel', amount: 200, paidBy: 'user1@test.com' },
      { id: 2, description: 'Dinner', amount: 150.5, paidBy: 'user2@test.com' },
    ]
  };

  const total = group.expenses.reduce((sum, e) => sum + e.amount, 0);

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
