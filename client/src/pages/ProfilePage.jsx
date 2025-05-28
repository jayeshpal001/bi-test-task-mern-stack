import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserCircleIcon, EnvelopeIcon, DevicePhoneMobileIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'
import api from '../utils/api'
import LoadingSpinner from '../components/LoadingSpinner'

export default function ProfilePage() {
  const navigate = useNavigate()
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
  })
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/api/auth/me') // Updated endpoint
        setUserData({
          name: data.user.name,
          email: data.user.email,
          phoneNumber: data.user.phoneNumber,
        })
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to load profile'
        toast.error(errorMessage)
        
        if ([401, 403].includes(err.response?.status)) { // Handle more auth errors
          localStorage.clear()
          navigate('/login', { replace: true })
        }
      } finally {
        setLoading(false)
      }
    }
    
    if (localStorage.getItem('token')) {
      fetchProfile()
    } else {
      navigate('/login')
    }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUpdating(true)

    try {
      const { data } = await api.put('/api/users/update', { // Updated endpoint
        name: userData.name.trim(),
        phoneNumber: userData.phoneNumber
      })

      // Update both local storage and state
      const updatedUser = { 
        ...JSON.parse(localStorage.getItem('user')),
        ...data.updatedUser
      }
      
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUserData(updatedUser)
      
      toast.success('Profile updated successfully! 🎉', {
        iconTheme: { primary: '#4CAF50', secondary: '#fff' }
      })
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
        (err.response?.status === 400 ? 'Invalid phone number format' : 'Update failed')
      toast.error(errorMessage)
    } finally {
      setUpdating(false)
    }
  }

  const handlePhoneChange = (e) => {
    const input = e.target.value.replace(/\D/g, '').slice(0, 10)
    setUserData(prev => ({ ...prev, phoneNumber: input }))
  }

  if (loading) return <LoadingSpinner fullScreen />

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-8 group"
          aria-label="Go back to previous page"
        >
          <ArrowLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <UserCircleIcon className="w-9 h-9 text-blue-600" aria-hidden="true" />
            <span>Your Profile</span>
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2 flex items-center gap-2">
                <UserCircleIcon className="w-5 h-5 text-gray-500" aria-hidden="true" />
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={userData.name}
                onChange={(e) => setUserData(prev => ({...prev, name: e.target.value}))}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                minLength="2"
                maxLength="50"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 flex items-center gap-2">
                <EnvelopeIcon className="w-5 h-5 text-gray-500" aria-hidden="true" />
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={userData.email}
                readOnly
                className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
                aria-describedby="email-help"
              />
              <p id="email-help" className="text-sm text-gray-500 mt-1">
                Contact support to change email
              </p>
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2 flex items-center gap-2">
                <DevicePhoneMobileIcon className="w-5 h-5 text-gray-500" aria-hidden="true" />
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={userData.phoneNumber}
                onChange={handlePhoneChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                pattern="[0-9]{10}"
                inputMode="numeric"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={updating}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {updating ? (
                  <>
                    <div 
                      className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"
                      aria-hidden="true"
                    />
                    <span>Updating...</span>
                  </>
                ) : (
                  'Update Profile'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}