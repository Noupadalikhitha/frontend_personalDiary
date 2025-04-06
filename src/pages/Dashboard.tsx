import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline'
import { apiRequest } from '../utils/api'
import { config } from '../config'

interface DiaryEntry {
  id: number
  title: string
  content: string
  created_at: string
  updated_at: string
  username: string
}

const Dashboard = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState<number | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState<string | null>(null)

  const fetchEntries = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await apiRequest('/api/entries/')
      
      if (!Array.isArray(data)) {
        console.error('Expected array of entries but got:', data)
        throw new Error('Invalid data format received from server')
      }
      
      setEntries(data)
    } catch (error) {
      console.error('Error fetching entries:', error)
      setError('Failed to load diary entries. Please try again.')
      toast.error('Failed to load diary entries')
      setEntries([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEntries()
  }, [])

  const handleCreate = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }
    
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in both title and content')
      return
    }

    try {
      setError(null)
      const response = await apiRequest('/api/entries/', {
        method: 'POST',
        body: { 
          title: title.trim(),
          content: content.trim()
        }
      })
      
      console.log('Create entry response:', response)
      
      if (!response || typeof response.id === 'undefined') {
        console.error('Invalid response data:', response)
        throw new Error('Invalid response from server')
      }
      
      toast.success('Entry created successfully!')
      setIsCreating(false)
      setTitle('')
      setContent('')
      await fetchEntries() // Refresh the list
    } catch (error) {
      console.error('Error creating entry:', error)
      toast.error('Failed to create entry. Please try again.')
    }
  }

  const handleUpdate = async (id: number) => {
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in both title and content')
      return
    }

    try {
      await apiRequest(`/api/entries/${id}/`, {
        method: 'PUT',
        body: { title, content }
      })
      
      toast.success('Entry updated successfully')
      setIsEditing(null)
      setTitle('')
      setContent('')
      await fetchEntries()
    } catch (error) {
      console.error('Error updating entry:', error)
      toast.error('Failed to update entry')
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return

    try {
      await apiRequest(`/api/entries/${id}/`, {
        method: 'DELETE'
      })
      
      toast.success('Entry deleted successfully')
      await fetchEntries()
    } catch (error) {
      console.error('Error deleting entry:', error)
      toast.error('Failed to delete entry')
    }
  }

  const startEdit = (entry: DiaryEntry) => {
    setIsEditing(entry.id)
    setTitle(entry.title)
    setContent(entry.content)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Diary Entries</h1>
        <div className="flex items-center space-x-4">
          {error && (
            <button
              onClick={() => fetchEntries()}
              className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
            >
              Retry Loading
            </button>
          )}
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New Entry
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error loading entries</h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
            </div>
          </div>
        </div>
      )}

      {(isCreating || isEditing) && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            {isCreating ? 'Create New Entry' : 'Edit Entry'}
          </h2>
          <form onSubmit={isEditing ? (e) => { e.preventDefault(); handleUpdate(isEditing); } : handleCreate} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false)
                  setIsEditing(null)
                  setTitle('')
                  setContent('')
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {isEditing ? 'Save Changes' : 'Create Entry'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {entries.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No diary entries yet. Click "New Entry" to create one!
          </div>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{entry.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(entry.created_at).toLocaleDateString()} by {entry.username}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => startEdit(entry)}
                    className="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{entry.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Dashboard 