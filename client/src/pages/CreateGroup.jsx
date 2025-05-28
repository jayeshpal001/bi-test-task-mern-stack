import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'
import api from '../utils/api'



export default function CreateGroup() {
  const navigate = useNavigate()
  const [groupData, setGroupData] = useState({
    name: '',
    members: []
  })
  const [inputEmail, setInputEmail] = useState('')
  const [loading, setLoading] = useState(false)

  // Enhanced email validation
  const validateEmail = (email) => 
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)

  const handleAddEmail = (e) => {
    e.preventDefault()
    const email = inputEmail.trim()
    if (!email) return

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    if (groupData.members.includes(email)) {
      toast.error('Email already added')
      return
    }

    setGroupData(prev => ({
      ...prev,
      members: [...prev.members, email]
    }))
    setInputEmail('')
  }

  const removeEmail = (indexToRemove) => {
    setGroupData(prev => ({
      ...prev,
      members: prev.members.filter((_, index) => index !== indexToRemove)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate inputs
      if (!groupData.name.trim()) throw new Error('Group name is required')
      if (groupData.name.length > 50) throw new Error('Group name too long (max 50 chars)')
      if (groupData.members.length === 0) throw new Error('Add at least one member')

      // Create group through API
       const { data } = await api.post('/groups', { 
        name: groupData.name.trim(),
        members: groupData.members
      });

      // Show success and redirect
      toast.success(`"${data.group.name}" created successfully! Invitations sent.`)
      navigate('/dashboard', {
        state: {
          newGroup: data.group // Pass the created group to dashboard
        }
      })
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         'Failed to create group'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-8 group"
          aria-label="Return to previous page"
        >
          <ArrowLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          Back to Dashboard
        </button>

        <div className="bg-white p-8 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Create New Group</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Group Name Field */}
            <div>
              <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-2">
                Group Name
              </label>
              <input
                id="groupName"
                type="text"
                value={groupData.name}
                onChange={(e) => setGroupData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter group name"
                required
                maxLength={50}
                disabled={loading}
                aria-describedby="nameHelp"
              />
              <p id="nameHelp" className="text-sm text-gray-500 mt-1">
                Maximum 50 characters
              </p>
            </div>

            {/* Member Emails Field */}
            <div>
              <label htmlFor="memberEmails" className="block text-sm font-medium text-gray-700 mb-2">
                Invite Members
              </label>
              <div className="border rounded-lg p-2 focus-within:ring-2 focus-within:ring-blue-500">
                <div className="flex flex-wrap gap-2 mb-2">
                  {groupData.members.map((email, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      aria-label={`Member email: ${email}`}
                    >
                      {email}
                      <button
                        type="button"
                        onClick={() => removeEmail(index)}
                        className="hover:text-blue-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label={`Remove ${email}`}
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    id="memberEmails"
                    type="email"
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddEmail(e)}
                    placeholder="Enter member emails"
                    className="flex-1 p-1 outline-none bg-transparent disabled:opacity-50"
                    disabled={loading}
                    aria-label="Add member email"
                  />
                  <button
                    type="button"
                    onClick={handleAddEmail}
                    className="bg-gray-100 px-4 py-1 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
                    disabled={loading || !inputEmail}
                    aria-label="Add email to list"
                  >
                    Add
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Members will receive invitation emails with join link
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !groupData.name || groupData.members.length === 0}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center gap-2 transition-colors"
              aria-label="Create group"
            >
              {loading ? (
                <>
                  <div 
                    className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"
                    aria-hidden="true"
                  />
                  <span>Creating Group...</span>
                </>
              ) : (
                'Create Group'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}