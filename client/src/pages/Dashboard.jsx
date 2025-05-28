import { useState, useEffect } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  PlusIcon,
  ArrowRightOnRectangleIcon,
  UserGroupIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import LoadingSpinner from '../components/LoadingSpinner'
import api from '../utils/api'
import { toast } from 'react-hot-toast'

export default function Dashboard() {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true)
        const { data } = await api.get('/groups')
        setGroups(
          data.map(group => ({
            ...group,
            totalExpenses:
              group.expenses?.reduce((sum, e) => sum + e.amount, 0) || 0,
          }))
        )
        setError('')
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Failed to load groups'
        setError(errorMsg)
        if (err.response?.status === 401) {
          handleLogout()
        }
      } finally {
        setLoading(false)
      }
    }

    fetchGroups()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  const calculateSettlements = (expenses, members) => {
    const balances = {}
    members.forEach(member => (balances[member._id] = 0))

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
      let remainingDebt = Math.abs(debt)
      creditors.forEach(([creditorId, credit]) => {
        if (remainingDebt > 0 && credit > 0) {
          const amount = Math.min(remainingDebt, credit)
          settlements.push({
            from: members.find(m => m._id === debtorId).name,
            to: members.find(m => m._id === creditorId).name,
            amount: parseFloat(amount.toFixed(2)),
          })
          remainingDebt -= amount
          balances[creditorId] -= amount
        }
      })
    })

    return settlements
  }

  if (loading) return <LoadingSpinner fullScreen />

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
          <NavLink to="/profile" icon={<UserCircleIcon className="w-5 h-5" />}>
            Profile
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 flex-1 p-4 md:p-6">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Group Management</h1>
            <p className="text-gray-500 text-sm mt-1">
              {groups.length} groups • Updated: {new Date().toLocaleTimeString()}
            </p>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <Link
              to="/create-group"
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

        <div className="space-y-6">
          {error ? (
            <div className="bg-red-100 p-4 rounded-lg text-red-700">Error: {error}</div>
          ) : groups.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
              <div className="w-48 h-48 bg-gray-100 rounded-full mx-auto mb-4" />
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
              {groups.map(group => (
                <GroupCard
                  key={group._id}
                  group={group}
                  settlements={calculateSettlements(group.expenses || [], group.members)}
                />
              ))}
            </div>
          )}
        </div>

        <Outlet />
      </main>
    </div>
  )
}

// Sub-components
const GroupCard = ({ group, settlements }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-3">
      <h3 className="font-semibold text-gray-800 truncate">{group.name}</h3>
      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">ID: {group.shortId}</span>
    </div>

    <div className="text-sm text-gray-600 space-y-1 mb-4">
      <p className="truncate">
        Members: {group.members.slice(0, 3).map(m => m.name).join(', ')}
        {group.members.length > 3 && ` +${group.members.length - 3}`}
      </p>
      <p>Total Expenses: ${group.totalExpenses.toFixed(2)}</p>
    </div>

    <div className="border-t pt-2 mb-3">
      <p className="text-xs font-medium text-gray-500 mb-1">Settlements Needed:</p>
      {settlements.length === 0 ? (
        <p className="text-xs text-gray-500">All balances are settled!</p>
      ) : (
        settlements.map((settlement, index) => (
          <p key={index} className="text-xs text-gray-600">
            {settlement.from} owes ${settlement.amount.toFixed(2)} to {settlement.to}
          </p>
        ))
      )}
    </div>

    <div className="flex gap-2">
      <Link
        to={`/groups/${group._id}`}
        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
      >
        Manage Expenses →
      </Link>
    </div>
  </div>
)

const NavLink = ({ to, icon, children }) => {
  const location = useLocation()
  const active = location.pathname.startsWith(to)

  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-3 py-2 rounded-md font-semibold text-sm
      ${active ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
    >
      {icon}
      {children}
    </Link>
  )
}
