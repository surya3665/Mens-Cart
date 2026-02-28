import { createContext, useContext, useState, useEffect } from 'react'

// 1. Create the context
const AuthContext = createContext(null)

// 2. Create the Provider component that wraps the app
export const AuthProvider = ({ children }) => {
  // Initialize user from localStorage so user stays logged in on page refresh
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  // login: Save user data + token to state and localStorage
  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  // logout: Clear everything
  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// 3. Custom hook — makes consuming the context clean and easy
// Usage: const { user, login, logout } = useAuth()
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}