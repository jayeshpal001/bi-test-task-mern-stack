import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function InviteMembersPage() {
  const { groupId } = useParams()
  const navigate = useNavigate()
  const [emails, setEmails] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const validateEmails = (emailString) => {
    const emailList = emailString
      .split(',')
      .map(email => email.trim())
      .filter(email => email !== '')
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const invalidEmails = emailList.filter(email => !emailRegex.test(email))

    return {
      isValid: invalidEmails.length === 0,
      emailList,
      invalidEmails
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { isValid, emailList, invalidEmails } = validateEmails(emails)

    if (!isValid) {
      setMessage({
        type: 'error',
        text: `Invalid email(s): ${invalidEmails.join(', ')}`
      })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      // TODO: Replace with actual backend call
      console.log('Inviting:', emailList)

      // Simulating success delay
      await new Promise(res => setTimeout(res, 1000))

      setMessage({ type: 'success', text: 'Invites sent successfully!' })
      setEmails('')
      navigate(`/groups/${groupId}`)
    } catch (err) {
        console.log(err);
      setMessage({ type: 'error', text: 'Failed to send invites. Try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Invite Members</h1>

        {message && (
          <div
            className={`mb-4 p-3 rounded ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-6 rounded-lg shadow-md"
        >
          <div>
            <label
              htmlFor="emails"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email addresses (comma separated)
            </label>
            <textarea
              id="emails"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 h-32"
              placeholder="e.g., user1@test.com, user2@test.com"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate emails with commas. E.g., alice@example.com, bob@example.com
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || emails.trim() === ''}
            className={`w-full text-white py-2 rounded-lg font-semibold ${
              loading
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Sending Invites...' : 'Send Invites'}
          </button>
        </form>
      </div>
    </div>
  )
}
