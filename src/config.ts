// Get the API URL from environment variable or use default
const getApiUrl = () => {
  // You can set this in your .env file
  const apiUrl = import.meta.env.VITE_API_URL

  if (apiUrl) {
    return apiUrl
  }

  // Default to localhost if no environment variable is set
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8000'
  }

  // If accessing from another computer, use the current hostname
  return `http://${window.location.hostname}:8000`
}

export const API_URL = getApiUrl()

export const config = {
  apiUrl: API_URL,
  // Add other configuration options here
} 