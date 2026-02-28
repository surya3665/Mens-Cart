import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { productAPI, cartAPI } from '../services/api'
import ProductCard from '../components/ProductCard'
import toast from 'react-hot-toast'

const CATEGORIES = ['All', 'T-Shirts', 'Shirts', 'Jeans', 'Pants', 'Jackets', 'Hoodies', 'Ethnic', 'Footwear', 'Accessories', 'Innerwear', 'Activewear', 'Grooming']

const ProductListPage = ({ onCartUpdate }) => {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [category, setCategory] = useState('All')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    fetchProducts()
  }, [page, search, category])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = { page, limit: 12, search }
      if (category !== 'All') params.category = category
      const { data } = await productAPI.getAll(params)
      setProducts(data.products)
      setTotalPages(data.totalPages)
      setTotal(data.total)
    } catch {
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  const handleCategoryChange = (cat) => {
    setCategory(cat)
    setPage(1)
  }

  const handleAddToCart = async (productId) => {
    if (!user) { toast.error('Please login to add to cart'); return }
    try {
      await cartAPI.addToCart(productId, 1)
      toast.success('Added to cart!')
      onCartUpdate?.()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed')
    }
  }

  return (
    <div className="bg-zinc-50 min-h-screen">
      {/* Hero Banner */}
      <div className="bg-zinc-900 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-display text-3xl sm:text-5xl font-bold mb-2">
            Men's <span className="text-amber-400">Fashion</span> Store
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base mb-6">
            {total > 0 ? `${total} products across ${CATEGORIES.length - 1} categories` : 'Discover premium men\'s fashion'}
          </p>
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-lg mx-auto">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search shirts, shoes, watches..."
              className="flex-1 bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-400 text-sm"
            />
            <button type="submit" className="bg-amber-400 hover:bg-amber-300 text-zinc-900 font-bold px-5 py-3 rounded-xl transition-colors text-sm">
              Search
            </button>
            {search && (
              <button type="button" onClick={() => { setSearch(''); setSearchInput(''); setPage(1) }}
                className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-3 rounded-xl transition-colors text-sm">
                ✕
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Category Filter Chips - Horizontal Scroll on Mobile */}
      <div className="bg-white border-b border-zinc-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2 py-3 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                  category === cat
                    ? 'bg-zinc-900 text-white border-zinc-900'
                    : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Active filter pill */}
        {(search || category !== 'All') && (
          <div className="flex flex-wrap gap-2 mb-4">
            {search && (
              <span className="bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                Search: "{search}"
                <button onClick={() => { setSearch(''); setSearchInput('') }} className="ml-1">✕</button>
              </span>
            )}
            {category !== 'All' && (
              <span className="bg-zinc-100 text-zinc-700 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                {category}
                <button onClick={() => setCategory('All')} className="ml-1">✕</button>
              </span>
            )}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-zinc-100" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-zinc-100 rounded w-3/4" />
                  <div className="h-3 bg-zinc-100 rounded w-1/2" />
                  <div className="h-8 bg-zinc-100 rounded mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-xl font-semibold text-zinc-700">No products found</p>
            <p className="text-zinc-400 mt-1 text-sm">Try a different search or category</p>
            <button onClick={() => { setSearch(''); setSearchInput(''); setCategory('All') }}
              className="mt-6 bg-zinc-900 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-zinc-700 transition-colors">
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <p className="text-zinc-500 text-sm mb-4">{total} product{total !== 1 ? 's' : ''} found</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {products.map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={user?.role !== 'admin' ? handleAddToCart : null}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm font-medium text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 transition-colors"
                >
                  ← Prev
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${
                      page === i + 1
                        ? 'bg-zinc-900 text-white'
                        : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm font-medium text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ProductListPage