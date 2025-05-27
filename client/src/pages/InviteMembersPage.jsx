import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function InviteMembersPage() {
  const { groupId } = useParams()
  const navigate = useNavigate()
  const [emails, setEmails] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Connect to backend
    navigate(`/groups/${groupId}`)
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-8">Invite Members</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter email addresses (comma separated)
            </label>
            <textarea
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 h-32"
              placeholder="e.g., member1@test.com, member2@test.com"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Send Invites
          </button>
        </form>
      </div>
    </div>
  )
}