import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { UserGroupIcon, EnvelopeIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'
import api from '../utils/api'
import LoadingSpinner from '../components/LoadingSpinner'

export default function InviteAcceptPage() {
  const { groupId } = useParams()
  const navigate = useNavigate()
  const [group, setGroup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isMember, setIsMember] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get group details
        const { data: groupData } = await api.get(`/groups/invite/${groupId}`)
        setGroup(groupData)

        // Check authentication status
        const token = localStorage.getItem('token')
        if (token) {
          try {
            const { data: userData } = await api.get('/users/me')
            setUser(userData)
            setIsMember(groupData.members.some(m => m.user === userData._id))
          } catch (err) {
            console.error('Auth check failed:', err)
            localStorage.removeItem('token')
          }
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Invalid or expired invitation link')
        navigate('/')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [groupId, navigate])

  const handleJoinGroup = async () => {
    try {
      await api.post(`/groups/${groupId}/join`)
      toast.success(`You've joined ${group.name}!`)
      navigate(`/groups/${groupId}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to join group')
    }
  }

  if (loading) return <LoadingSpinner fullScreen />
  if (!group) return null

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
        <EnvelopeIcon className="w-16 h-16 text-blue-600 mx-auto mb-6" />

        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          {isMember ? 'Already a Member' : 'Group Invitation'}
        </h1>

        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <UserGroupIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">{group.name}</h2>
          <p className="text-gray-600 mb-2">Group ID: {group.shortId}</p>
          <p className="text-sm text-gray-500">
            {group.members.length} members • Created {new Date(group.createdAt).toLocaleDateString()}
          </p>
        </div>

        {user ? (
          isMember ? (
            <div className="space-y-4">
              <p className="text-gray-600">You're already a member of this group</p>
              <button
                onClick={() => navigate(`/groups/${groupId}`)}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                View Group
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">
                You're invited to join as <span className="font-semibold">{user.email}</span>
              </p>
              <button
                onClick={handleJoinGroup}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <ArrowRightIcon className="w-5 h-5" />
                Accept Invitation
              </button>
            </div>
          )
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600">
              You need to {group.members.length === 0 ? 'create an account' : 'login'} to accept this invitation
            </p>
            <div className="flex gap-4">
              <Link
                to="/login"
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="flex-1 bg-gray-100 text-gray-800 py-2 rounded-lg hover:bg-gray-200"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}