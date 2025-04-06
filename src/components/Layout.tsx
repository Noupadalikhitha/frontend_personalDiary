import { FC } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { UserIcon, BookOpenIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { useTheme } from '../contexts/ThemeContext'
import { toast } from 'react-toastify'
import { apiRequest } from '../utils/api'

interface LayoutProps {
  setIsAuthenticated: (value: boolean) => void
}

const Layout: FC<LayoutProps> = ({ setIsAuthenticated }) => {
  const navigate = useNavigate()
  const { isDarkMode, toggleTheme } = useTheme()

  const handleLogout = async () => {
    try {
      console.log('Attempting to logout...')
      
      const response = await apiRequest('/api/logout/', {
        method: 'POST'
      })
      
      console.log('Logout response:', response)
      
      // Clear any remaining cookies manually
      document.cookie = 'sessionid=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;'
      document.cookie = 'csrftoken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;'
      
      setIsAuthenticated(false)
      navigate('/login', { replace: true })
      toast.success('Logged out successfully')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to logout. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white shadow-sm dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link
                to="/dashboard"
                className="flex items-center px-2 py-2 text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400"
              >
                <BookOpenIcon className="h-6 w-6 mr-2" />
                <span className="font-medium">Personal Diary</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <SunIcon className="h-6 w-6" />
                ) : (
                  <MoonIcon className="h-6 w-6" />
                )}
              </button>
              <Link
                to="/profile"
                className="p-2 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                aria-label="Profile"
              >
                <UserIcon className="h-6 w-6" />
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout 