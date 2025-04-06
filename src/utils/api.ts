import { config } from '../config'

export const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

interface RequestOptions extends RequestInit {
  body?: any
}

// Function to ensure we have a CSRF token
export const ensureCsrfToken = async () => {
  try {
    // Make a GET request to the CSRF endpoint
    const response = await fetch(`${config.apiUrl}/api/user-info/`, {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to get CSRF token')
    }
    
    // The response should set the CSRF cookie
    return getCookie('csrftoken')
  } catch (error) {
    console.error('Error getting CSRF token:', error)
    throw error
  }
}

export const apiRequest = async (endpoint: string, options: RequestOptions = {}) => {
  // For POST, PUT, DELETE requests, ensure we have a CSRF token
  if (options.method && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(options.method.toUpperCase())) {
    try {
      await ensureCsrfToken()
    } catch (error) {
      console.warn('Failed to get CSRF token:', error)
    }
  }
  
  const csrfToken = getCookie('csrftoken')
  const sessionId = getCookie('sessionid')
  
  console.log('Cookies:', {
    csrfToken: csrfToken ? 'present' : 'missing',
    sessionId: sessionId ? 'present' : 'missing'
  })
  
  const defaultHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }

  // Only add CSRF token for non-GET methods
  if (options.method && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(options.method.toUpperCase())) {
    if (!csrfToken) {
      console.warn('No CSRF token found for non-GET request')
    }
    Object.assign(defaultHeaders, {
      'X-CSRFToken': csrfToken || ''
    })
  }

  const requestConfig: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    },
    credentials: 'include'  // Important for sending cookies
  }

  if (options.body && typeof options.body === 'object') {
    requestConfig.body = JSON.stringify(options.body)
  }

  const url = `${config.apiUrl}${endpoint}`

  try {
    console.log(`Making ${options.method || 'GET'} request to ${url}`)
    console.log('Request config:', {
      method: options.method,
      headers: requestConfig.headers,
      credentials: requestConfig.credentials
    })
    
    const response = await fetch(url, requestConfig)
    console.log(`Response status:`, response.status)
    
    // Log response headers for debugging
    const headers: { [key: string]: string } = {}
    response.headers.forEach((value, key) => {
      headers[key] = value
    })
    console.log('Response headers:', headers)
    
    if (!response.ok) {
      const contentType = response.headers.get('content-type')
      let errorMessage = `HTTP error! status: ${response.status}`
      try {
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        }
      } catch (e) {
        console.error('Error parsing error response:', e)
      }
      throw new Error(errorMessage)
    }

    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json()
      console.log('Response data:', data)
      return data
    }

    return response
  } catch (error) {
    console.error('API Request failed:', {
      endpoint,
      method: options.method || 'GET',
      error
    })
    throw error
  }
} 