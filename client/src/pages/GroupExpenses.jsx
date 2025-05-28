import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PlusIcon, CurrencyDollarIcon, UserGroupIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'
import api from '../utils/api'
import LoadingSpinner from '../components/LoadingSpinner'

export default function GroupExpenses() {
    const { groupId } = useParams()
    const navigate = useNavigate()
    const [group, setGroup] = useState(null)
    const [expenses, setExpenses] = useState([])
    const [newExpense, setNewExpense] = useState({
        title: '',
        amount: '',
        paidBy: '',
        splitBetween: []
    })
    const [settlements, setSettlements] = useState([])
    const [loading, setLoading] = useState(true)
    const [showAddForm, setShowAddForm] = useState(false)
    const [inviteEmail, setInviteEmail] = useState('')
    const [inviteLoading, setInviteLoading] = useState(false)

    useEffect(() => {
        const loadGroupData = async () => {
            try {
                const { data } = await api.get(`/groups/${groupId}`)
                setGroup(data)
                setExpenses(data.expenses || [])
                calculateSettlements(data.expenses || [], data.members)
            } catch (err) {
                const errorMsg = err.response?.data?.message || 'Failed to load group data'
                toast.error(errorMsg)
                if (err.response?.status === 401) {
                    localStorage.removeItem('token')
                    localStorage.removeItem('user')
                    navigate('/login')
                } else {
                    navigate('/dashboard')
                }
            } finally {
                setLoading(false)
            }
        }

        loadGroupData()
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
            if (!newExpense.paidBy) {
                throw new Error('Please select a payer')
            }

            const amount = parseFloat(newExpense.amount)
            if (isNaN(amount) || amount <= 0) {
                throw new Error('Please enter a valid amount')
            }

            const { data } = await api.post(`/groups/${groupId}/expenses`, {
                title: newExpense.title.trim(),
                amount,
                paidBy: newExpense.paidBy,
                splitBetween: group.members.map(m => m._id)
            })

            const updatedExpenses = [...expenses, data]
            setExpenses(updatedExpenses)
            calculateSettlements(updatedExpenses, group.members)
            setShowAddForm(false)
            setNewExpense({ title: '', amount: '', paidBy: '' })
            toast.success('Expense added successfully!')
        } catch (err) {
            toast.error(err.response?.data?.message || err.message)
        }
    }

    const handleInvite = async () => {
        try {
            setInviteLoading(true)
            const email = inviteEmail.trim().toLowerCase()

            if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                throw new Error('Please enter a valid email address')
            }

            await api.post(`/groups/${groupId}/invite`, { email })
            toast.success(`Invitation sent to ${email}`)
            setInviteEmail('')
        } catch (err) {
            toast.error(err.response?.data?.message || err.message)
        } finally {
            setInviteLoading(false)
        }
    }

    if (loading) return <LoadingSpinner fullScreen />
    if (!group) return null

    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-8 group"
                >
                    <ArrowLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    Back to Groups
                </button>

                <div className="bg-white rounded-xl shadow-md p-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">{group.name}</h1>
                            <p className="text-gray-500 mt-2">
                                Group ID: {group.shortId} • {group.members.length} members
                            </p>
                        </div>
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="mt-4 md:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
                        >
                            <PlusIcon className="w-5 h-5" />
                            {showAddForm ? 'Cancel' : 'Add Expense'}
                        </button>
                    </div>

                    {/* Add Expense Form */}
                    {showAddForm && (
                        <form onSubmit={handleAddExpense} className="bg-gray-50 p-4 rounded-lg mb-8">
                            <h3 className="text-xl font-semibold mb-4">New Expense</h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={newExpense.title}
                                        onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        maxLength={50}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Amount ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        required
                                        value={newExpense.amount}
                                        onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Paid By</label>
                                    <select
                                        required
                                        value={newExpense.paidBy}
                                        onChange={(e) => setNewExpense({ ...newExpense, paidBy: e.target.value })}
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Payer</option>
                                        {group.members.map(member => (
                                            <option key={member._id} value={member._id}>{member.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Add Expense
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Invite Section */}
                    <div className="bg-blue-50 p-4 rounded-lg mb-8">
                        <h3 className="text-lg font-semibold mb-4">Invite More Members</h3>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                placeholder="Enter email address"
                                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                onKeyPress={(e) => e.key === 'Enter' && handleInvite()}
                            />
                            <button
                                onClick={handleInvite}
                                disabled={inviteLoading}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-75 disabled:cursor-not-allowed transition-colors"
                            >
                                {inviteLoading ? 'Sending...' : 'Send Invite'}
                            </button>
                        </div>
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
                                            owes ${settlement.amount.toFixed(2)} to
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
                            <UserGroupIcon className="w-6 h-6 text-blue-600" />
                            Expense History
                        </h2>
                        {expenses.length === 0 ? (
                            <p className="text-gray-500">No expenses recorded yet</p>
                        ) : (
                            <div className="space-y-4">
                                {expenses.map((expense) => (
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