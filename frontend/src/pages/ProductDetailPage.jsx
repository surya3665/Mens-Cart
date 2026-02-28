import React from "react";
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { productAPI, cartAPI } from '../services/api'
import toast from 'react-hot-toast'

const ProductDetailPage = ({ onCartUpdate }) => {
  const { id } = useParams()  // Get product ID from URL
  const { user } = useAuth()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await productAPI.getById(id)
        setProduct(data)
      } catch (err) {
        toast.error('Product not found')
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login first')
      navigate('/login')
      return
    }
    setAddingToCart(true)
    try {
      await cartAPI.addToCart(product._id, quantity)
      toast.success(`${quantity} item(s) added to cart!`)
      onCartUpdate?.()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="h-96 bg-stone-100 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 bg-stone-100 rounded w-3/4" />
            <div className="h-6 bg-stone-100 rounded w-1/3" />
            <div className="h-24 bg-stone-100 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) return null

  const imageUrl = product.image || `https://placehold.co/600x500/f5f0eb/e8673a?text=${encodeURIComponent(product.name)}`

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="text-stone-500 hover:text-stone-700 text-sm mb-6 flex items-center gap-1"
      >
        ← Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Image */}
        <div className="card overflow-hidden">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-96 object-cover"
            onError={(e) => {
              e.target.src = `https://placehold.co/600x500/f5f0eb/e8673a?text=${encodeURIComponent(product.name)}`
            }}
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-between">
          <div>
            <span className="text-xs font-medium text-brand-500 bg-brand-50 px-3 py-1 rounded-full">
              {product.category || 'General'}
            </span>
            <h1 className="font-display text-3xl font-bold text-stone-800 mt-3">
              {product.name}
            </h1>
            <p className="font-display text-4xl font-bold text-brand-500 mt-3">
              ₹{product.price.toLocaleString()}
            </p>
            <p className="text-stone-500 mt-4 leading-relaxed">{product.description}</p>

            <div className="mt-4 flex items-center gap-2">
              <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {product.stock > 0 ? `✓ In Stock (${product.stock} left)` : '✗ Out of Stock'}
              </span>
            </div>
          </div>

          {/* Add to Cart Section */}
          {user?.role !== 'admin' && (
            <div className="mt-8">
              {/* Quantity Selector */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-medium text-stone-700">Quantity:</span>
                <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-3 py-2 hover:bg-stone-50 text-stone-600"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 border-x border-stone-200 font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    className="px-3 py-2 hover:bg-stone-50 text-stone-600"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addingToCart}
                className="btn-primary w-full py-3 text-base disabled:opacity-50"
              >
                {addingToCart ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart 🛒'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage