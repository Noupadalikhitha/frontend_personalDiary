import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { apiRequest } from '../utils/api'

interface ProfileData {
  id: number
  username: string
  bio: string
  created_at: string
  updated_at: string
}

const Profile = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [bio, setBio] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const data = await apiRequest('/api/profile/')
      
      // Validate the response data
      if (!Array.isArray(data) || !data.length) {
        console.error('Expected non-empty array of profiles but got:', data)
        throw new Error('No profile data received')
      }
      
      const profileData = data[0]
      if (!profileData || typeof profileData.bio === 'undefined') {
        console.error('Invalid profile data:', profileData)
        throw new Error('Invalid profile data received')
      }
      
      setProfile(profileData)
      setBio(profileData.bio || '') // Use empty string if bio is null
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('Failed to fetch profile')
      setProfile(null)
      setBio('')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile?.id) {
      toast.error('Profile not found')
      return
    }

    try {
      const updatedProfile = await apiRequest(`/api/profile/${profile.id}/`, {
        method: 'PUT',
        body: { bio }
      })
      
      // Validate the response data
      if (!updatedProfile || typeof updatedProfile.bio === 'undefined') {
        throw new Error('Invalid response from server')
      }
      
      setProfile(updatedProfile)
      setBio(updatedProfile.bio || '')
      setIsEditing(false)
      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Profile</h2>
        {profile && (
          <div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              <span className="font-medium">Username:</span> {profile.username}
            </p>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false)
                      setBio(profile.bio)
                    }}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  <span className="font-medium">Bio:</span> {profile.bio || 'No bio yet'}
                </p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Edit Bio
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile 