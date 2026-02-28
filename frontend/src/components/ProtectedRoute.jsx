import React from "react";
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// ProtectedRoute: Only allows logged-in users
export const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />
  }

  return children
}

// AdminRoute: Only allows users with admin role
export const AdminRoute = ({ children }) => {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />

  return children
}


