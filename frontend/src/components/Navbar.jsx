import React from "react";
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const Navbar = ({ cartCount = 0 }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Logged out!')
    navigate('/login')
    setMenuOpen(false)
  }

  const close = () => setMenuOpen(false)

  return (
    <nav className="bg-zinc-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" onClick={close} className="flex items-center gap-2 font-display text-xl font-bold text-white tracking-tight">
          <img src="/src/assets/logo.png" alt="Men's Cart" className="h-20 w-auto" />
            <span>Men's<span className="text-amber-400">Cart</span></span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-zinc-300 hover:text-white text-sm font-medium transition-colors">
              Products
            </Link>

            {user ? (
              <>
                {user.role !== 'admin' && (
                  <Link to="/cart" className="relative text-zinc-300 hover:text-white text-sm font-medium transition-colors flex items-center gap-1">
                    🛒 Cart
                    {cartCount > 0 && (
                      <span className="bg-amber-400 text-zinc-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                )}
                {user.role !== 'admin' && (
                  <Link to="/orders" className="text-zinc-300 hover:text-white text-sm font-medium transition-colors">
                    My Orders
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-amber-400 hover:text-amber-300 text-sm font-semibold transition-colors">
                    ⚙️ Dashboard
                  </Link>
                )}
                <div className="flex items-center gap-3 pl-4 border-l border-zinc-700">
                  <span className="text-zinc-400 text-xs">
                    Hi, <span className="text-white font-medium">{user.name.split(' ')[0]}</span>
                  </span>
                  <button onClick={handleLogout}
                    className="bg-zinc-700 hover:bg-red-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-zinc-300 hover:text-white text-sm font-medium transition-colors">Login</Link>
                <Link to="/register" className="bg-amber-400 hover:bg-amber-300 text-zinc-900 font-semibold text-sm px-4 py-2 rounded-lg transition-colors">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile: cart icon + hamburger */}
          <div className="flex md:hidden items-center gap-3">
            {user && user.role !== 'admin' && (
              <Link to="/cart" onClick={close} className="relative">
                <span className="text-xl">🛒</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-400 text-zinc-900 text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-white p-1">
              <div className="w-6 flex flex-col gap-1.5">
                <span className={`block h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-zinc-800 border-t border-zinc-700 px-4 py-4 flex flex-col gap-3">
          <Link to="/" onClick={close} className="text-zinc-200 py-2 border-b border-zinc-700 text-sm font-medium">🏠 Products</Link>
          {user ? (
            <>
              {user.role !== 'admin' && (
                <Link to="/cart" onClick={close} className="text-zinc-200 py-2 border-b border-zinc-700 text-sm font-medium">🛒 Cart {cartCount > 0 && `(${cartCount})`}</Link>
              )}
              {user.role !== 'admin' && (
                <Link to="/orders" onClick={close} className="text-zinc-200 py-2 border-b border-zinc-700 text-sm font-medium">📦 My Orders</Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" onClick={close} className="text-amber-400 py-2 border-b border-zinc-700 text-sm font-semibold">⚙️ Admin Dashboard</Link>
              )}
              <div className="flex items-center justify-between pt-1">
                <span className="text-zinc-400 text-sm">Hi, <span className="text-white font-medium">{user.name}</span></span>
                <button onClick={handleLogout} className="bg-red-600 text-white text-sm px-4 py-1.5 rounded-lg font-medium">Logout</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" onClick={close} className="text-zinc-200 py-2 border-b border-zinc-700 text-sm font-medium">Login</Link>
              <Link to="/register" onClick={close} className="bg-amber-400 text-zinc-900 text-center py-2 rounded-lg text-sm font-semibold">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar