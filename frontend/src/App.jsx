import React from "react";
import { useState, useEffect, useCallback } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { cartAPI } from './services/api'

// Layout
import Navbar from './components/Navbar'
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute'

// Pages
import ProductListPage from './pages/ProductListPage'
import ProductDetailPage from './pages/ProductDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CartPage from './pages/CartPage'
import MyOrdersPage from './pages/MyOrdersPage'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  const { user } = useAuth()
  const [cartCount, setCartCount] = useState(0)

  // Fetch cart item count for the Navbar badge
  const fetchCartCount = useCallback(async () => {
    if (!user || user.role === 'admin') {
      setCartCount(0)
      return
    }
    try {
      const { data } = await cartAPI.getCart()
      setCartCount(data?.items?.length || 0)
    } catch {
      setCartCount(0)
    }
  }, [user])

  // Re-fetch cart count when user logs in/out
  useEffect(() => {
    fetchCartCount()
  }, [fetchCartCount])

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar cartCount={cartCount} />

      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<ProductListPage onCartUpdate={fetchCartCount} />} />
          <Route path="/products/:id" element={<ProductDetailPage onCartUpdate={fetchCartCount} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected User Routes */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage onCartUpdate={fetchCartCount} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <MyOrdersPage />
              </ProtectedRoute>
            }
          />

          {/* Admin-only Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
      </main>
    </div>
  )
}

export default App