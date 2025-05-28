import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  CurrencyDollarIcon,
  UserCircleIcon,
  ArrowLeftIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'
import api from '../utils/api'
import LoadingSpinner from '../components/LoadingSpinner'

export default function GroupDetailsPage() {
  const { groupId } = useParams()
  const navigate = useNavigate()
  const [group, setGroup] = useState(null)
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    paidBy: '',
    splitBetween: []
  })
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [settlements, setSettlements] = useState([])

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const { data } = await api.get(`/groups/${groupId}`)
        setGroup(data)
        calculateSettlements(data.expenses || [], data.members)
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load group details')
        navigate('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchGroupDetails()
  }, [groupId, navigate])

  const calculateSettlements = (expenses, members) => {
    const balances = {}
    members.forEach(member => balances[member._id] = 0)

    expenses.forEach(expense => {
      const share = expense.amount / expense.splitBetween.length
      balances[expense.paidBy._id] += expense.amount
      expense.splitBetween.forEach(member => {
        balances[member._id] -= share
      })
    })

    const settlements = []
    const debtors = Object.entries(balances).filter(([_, balance]) => balance < 0)
    const creditors = Object.entries(balances).filter(([_, balance]) => balance > 0)

    debtors.forEach(([debtorId, debt]) => {
      const debtor = members.find(m => m._id === debtorId)
      let remainingDebt = Math.abs(debt)
      
      creditors.forEach(([creditorId, credit]) => {
        const creditor = members.find(m => m._id === creditorId)
        if (remainingDebt > 0 && credit > 0) {
          const amount = Math.min(remainingDebt, credit)
          settlements.push({
            from: debtor.name,
            to: creditor.name,
            amount: parseFloat(amount.toFixed(2))
          })
          remainingDebt -= amount
          balances[creditorId] -= amount
        }
      })
    })

    setSettlements(settlements)
  }

  const handleAddExpense = async (e) => {
    e.preventDefault()
    
    try {
      const { data } = await api.post(`/groups/${groupId}/expenses`, {
        title: newExpense.title,
        amount: parseFloat(newExpense.amount),
        paidBy: newExpense.paidBy,
        splitBetween: group.members.map(m => m._id)
      })

      setGroup(prev => ({
        ...prev,
        expenses: [...prev.expenses, data]
      }))
      
      calculateSettlements([...group.expenses, data], group.members)
      setShowForm(false)
      setNewExpense({ title: '', amount: '', paidBy: '' })
      toast.success('Expense added successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add expense')
    }
  }

  if (loading) return <LoadingSpinner fullScreen />
  if (!group) return null

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-8"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Groups
        </button>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{group.name}</h1>
              <p className="text-gray-500 mt-2">
                Group ID: {group.shortId} • {group.members.length} members
              </p>
            </div>
            <div className="mt-4 md:mt-0 bg-green-100 px-4 py-2 rounded-full">
              <span className="font-semibold text-green-700">
                Total Expenses: ${group.expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Add Expense Section */}
          <div className="mb-8">
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              {showForm ? 'Cancel' : 'Add Expense'}
            </button>

            {showForm && (
              <form onSubmit={handleAddExpense} className="mt-4 bg-gray-50 p-4 rounded-lg space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={newExpense.title}
                    onChange={(e) => setNewExpense({...newExpense, title: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Paid By</label>
                  <select
                    required
                    value={newExpense.paidBy}
                    onChange={(e) => setNewExpense({...newExpense, paidBy: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">Select Payer</option>
                    {group.members.map(member => (
                      <option key={member._id} value={member._id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  Add Expense
                </button>
              </form>
            )}
          </div>

          {/* Settlements */}
          <div className="bg-white border rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
              Settlements Needed
            </h2>
            {settlements.length === 0 ? (
              <p className="text-gray-500">All balances are settled!</p>
            ) : (
              <div className="space-y-2">
                {settlements.map((settlement, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="font-medium">{settlement.from}</span>
                    <span className="text-gray-600">
                      owes ${settlement.amount} to 
                    </span>
                    <span className="font-medium">{settlement.to}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Expense History */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <UserCircleIcon className="w-6 h-6 text-blue-600" />
              Expense History
            </h2>
            {group.expenses.length === 0 ? (
              <p className="text-gray-500">No expenses recorded yet</p>
            ) : (
              <div className="space-y-4">
                {group.expenses.map((expense) => (
                  <div key={expense._id} className="border-b pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{expense.title}</h3>
                        <p className="text-gray-500 text-sm">
                          Paid by {expense.paidBy.name} • {new Date(expense.date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-lg font-semibold">
                        ${expense.amount.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Split between: {expense.splitBetween.map(m => m.name).join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}