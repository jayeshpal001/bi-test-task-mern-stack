import { Link } from 'react-router-dom'
import { HomeIcon, UserCircleIcon } from '@heroicons/react/24/outline'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/dashboard" className="flex items-center gap-2">
          <HomeIcon className="w-6 h-6 text-blue-600" />
          <span className="text-xl font-bold text-gray-800">ExpenseSplit</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link to="/profile" className="text-gray-600 hover:text-blue-600">
            <UserCircleIcon className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </nav>
  )
}