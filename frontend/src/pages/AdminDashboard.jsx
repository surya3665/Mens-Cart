import React from "react";
import { useState, useEffect } from 'react'
import { adminAPI, productAPI } from '../services/api'
import toast from 'react-hot-toast'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

// ─── Product Form Modal ───────────────────────────────────────────────────────
const ProductForm = ({ product, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: product?.name || '',
    price: product?.price || '',
    description: product?.description || '',
    stock: product?.stock || '',
    category: product?.category || 'General',
  })
  const [imageFile, setImageFile] = useState(null)
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      // Use FormData because we're sending a file
      const formData = new FormData()
      Object.entries(form).forEach(([k, v]) => formData.append(k, v))
      if (imageFile) formData.append('image', imageFile)

      if (product) {
        await adminAPI.updateProduct(product._id, formData)
        toast.success('Product updated!')
      } else {
        await adminAPI.createProduct(formData)
        toast.success('Product created!')
      }
      onSave()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="p-6 border-b border-stone-100 flex justify-between items-center">
          <h2 className="font-display text-xl font-bold">{product ? 'Edit Product' : 'New Product'}</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700 text-2xl leading-none">×</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Name</label>
            <input name="name" required value={form.name} onChange={handleChange} className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Price (₹)</label>
              <input name="price" type="number" required min="0" value={form.price} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Stock</label>
              <input name="stock" type="number" required min="0" value={form.stock} onChange={handleChange} className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Category</label>
            <input name="category" value={form.category} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
            <textarea name="description" required rows={3} value={form.description} onChange={handleChange} className="input-field resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Image</label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="text-sm text-stone-600" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-70">
              {saving ? 'Saving...' : 'Save Product'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Main Admin Dashboard ─────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [tab, setTab] = useState('products')
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [editProduct, setEditProduct] = useState(null)   // null = closed, {} = new, {...} = editing
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    loadData()
  }, [tab])

  const loadData = async () => {
    setLoading(true)
    try {
      if (tab === 'products') {
        const { data } = await productAPI.getAll({ limit: 100 })
        setProducts(data.products)
      } else if (tab === 'users') {
        const { data } = await adminAPI.getAllUsers()
        setUsers(data)
      } else if (tab === 'orders') {
        const { data } = await adminAPI.getAllOrders()
        setOrders(data)
      }
    } catch (err) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product? This cannot be undone.')) return
    try {
      await adminAPI.deleteProduct(id)
      toast.success('Product deleted')
      loadData()
    } catch {
      toast.error('Delete failed')
    }
  }

  const handleStatusChange = async (orderId, status) => {
    try {
      await adminAPI.updateOrderStatus(orderId, status)
      toast.success('Status updated')
      loadData()
    } catch {
      toast.error('Update failed')
    }
  }

  const tabs = ['products', 'users', 'orders']

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="font-display text-3xl font-bold text-stone-800">Admin Dashboard</h1>
        {tab === 'products' && (
          <button onClick={() => { setEditProduct({}); setShowForm(true) }} className="btn-primary">
            + Add Product
          </button>
        )}
      </div>

      {/* Tab Bar */}
      <div className="flex border-b border-stone-200 mb-6">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-3 font-medium text-sm capitalize transition-colors border-b-2 -mb-px ${
              tab === t ? 'text-brand-500 border-brand-500' : 'text-stone-500 border-transparent hover:text-stone-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-16 bg-stone-100 rounded-lg animate-pulse" />)}
        </div>
      ) : (
        <>
          {/* ── Products Tab ── */}
          {tab === 'products' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100 text-left">
                    <th className="pb-3 font-semibold text-stone-600">Product</th>
                    <th className="pb-3 font-semibold text-stone-600">Price</th>
                    <th className="pb-3 font-semibold text-stone-600">Stock</th>
                    <th className="pb-3 font-semibold text-stone-600">Category</th>
                    <th className="pb-3 font-semibold text-stone-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {products.map(p => (
                    <tr key={p._id} className="hover:bg-stone-50">
                      <td className="py-3 font-medium text-stone-800">{p.name}</td>
                      <td className="py-3 text-brand-500 font-bold">₹{p.price.toLocaleString()}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="py-3 text-stone-500">{p.category}</td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setEditProduct(p); setShowForm(true) }}
                            className="text-blue-500 hover:text-blue-700 font-medium text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(p._id)}
                            className="text-red-400 hover:text-red-600 font-medium text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length === 0 && (
                <p className="text-center text-stone-400 py-10">No products yet. Add your first product!</p>
              )}
            </div>
          )}

          {/* ── Users Tab ── */}
          {tab === 'users' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100 text-left">
                    <th className="pb-3 font-semibold text-stone-600">Name</th>
                    <th className="pb-3 font-semibold text-stone-600">Email</th>
                    <th className="pb-3 font-semibold text-stone-600">Role</th>
                    <th className="pb-3 font-semibold text-stone-600">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {users.map(u => (
                    <tr key={u._id} className="hover:bg-stone-50">
                      <td className="py-3 font-medium text-stone-800">{u.name}</td>
                      <td className="py-3 text-stone-500">{u.email}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-brand-100 text-brand-600' : 'bg-stone-100 text-stone-600'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 text-stone-400 text-xs">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── Orders Tab ── */}
          {tab === 'orders' && (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order._id} className="card p-5">
                  <div className="flex flex-wrap justify-between gap-3 mb-3">
                    <div>
                      <span className="text-xs font-mono text-stone-400">#{order._id.slice(-8).toUpperCase()}</span>
                      <p className="font-semibold text-stone-700 mt-0.5">{order.user?.name}</p>
                      <p className="text-xs text-stone-400">{order.user?.email}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="font-display font-bold text-brand-500">
                        ₹{order.totalPrice.toLocaleString()}
                      </span>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`text-xs font-semibold px-2 py-1 rounded-full border-0 focus:ring-1 focus:ring-brand-300 ${statusColors[order.status] || ''}`}
                      >
                        {['pending','processing','shipped','delivered','cancelled'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="text-sm text-stone-500 space-y-0.5">
                    {order.items.map((item, i) => (
                      <div key={i}>{item.name} × {item.quantity} — ₹{(item.price * item.quantity).toLocaleString()}</div>
                    ))}
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <p className="text-center text-stone-400 py-10">No orders yet.</p>
              )}
            </div>
          )}
        </>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editProduct && editProduct._id ? editProduct : null}
          onClose={() => setShowForm(false)}
          onSave={loadData}
        />
      )}
    </div>
  )
}

export default AdminDashboard