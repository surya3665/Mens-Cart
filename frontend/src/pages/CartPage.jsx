import React from "react";
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { cartAPI, orderAPI } from '../services/api'
import toast from 'react-hot-toast'

const CartPage = ({ onCartUpdate }) => {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [placingOrder, setPlacingOrder] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const { data } = await cartAPI.getCart()
      setCart(data)
    } catch (err) {
      toast.error('Failed to load cart')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (productId) => {
    try {
      const { data } = await cartAPI.removeFromCart(productId)
      setCart(data)
      onCartUpdate?.()
      toast.success('Item removed from cart')
    } catch (err) {
      toast.error('Failed to remove item')
    }
  }

  const handlePlaceOrder = async () => {
    setPlacingOrder(true)
    try {
      // Simple default shipping address for demo
      await orderAPI.placeOrder({
        street: '123 Main St',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        country: 'India',
      })
      toast.success('🎉 Order placed successfully!')
      setCart({ items: [] })
      onCartUpdate?.()
      navigate('/orders')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order')
    } finally {
      setPlacingOrder(false)
    }
  }

  // Calculate total price
  const total = cart?.items?.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  ) || 0

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 animate-pulse">
        {[1,2,3].map(i => (
          <div key={i} className="h-24 bg-stone-100 rounded-xl mb-4" />
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl font-bold text-stone-800 mb-8">Your Cart</h1>

      {!cart?.items?.length ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">🛒</p>
          <p className="text-xl font-medium text-stone-600 mb-2">Your cart is empty</p>
          <p className="text-stone-400 mb-6">Add some products to get started!</p>
          <Link to="/" className="btn-primary">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => {
              if (!item.product) return null
              const imageUrl = item.product.image || `https://placehold.co/100x100/f5f0eb/e8673a?text=P`
              return (
                <div key={item._id} className="card p-4 flex gap-4">
                  <img
                    src={imageUrl}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => { e.target.src = 'https://placehold.co/100x100/f5f0eb/e8673a?text=P' }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-stone-800 truncate">{item.product.name}</h3>
                    <p className="text-brand-500 font-bold mt-1">₹{item.product.price.toLocaleString()}</p>
                    <p className="text-stone-400 text-sm mt-1">Qty: {item.quantity}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <p className="font-bold text-stone-700">
                      ₹{(item.product.price * item.quantity).toLocaleString()}
                    </p>
                    <button
                      onClick={() => handleRemove(item.product._id)}
                      className="text-red-400 hover:text-red-600 text-sm transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Order Summary */}
          <div className="card p-6 h-fit sticky top-24">
            <h2 className="font-semibold text-stone-800 mb-4 text-lg">Order Summary</h2>
            <div className="space-y-2 text-sm text-stone-600">
              <div className="flex justify-between">
                <span>Items ({cart.items.length})</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
            </div>
            <div className="border-t border-stone-100 mt-4 pt-4 flex justify-between font-bold text-stone-800">
              <span>Total</span>
              <span className="text-brand-500 font-display text-xl">₹{total.toLocaleString()}</span>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className="btn-primary w-full py-3 mt-6 disabled:opacity-70"
            >
              {placingOrder ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CartPage
