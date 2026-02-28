import React from "react";
import { Link } from 'react-router-dom'

const ProductCard = ({ product, onAddToCart }) => {
  const imageUrl = product.image?.startsWith('http')
    ? product.image
    : product.image
      ? product.image
      : `https://placehold.co/400x400/f4f4f5/71717a?text=${encodeURIComponent(product.name.slice(0,10))}`

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 group flex flex-col">
      {/* Image */}
      <Link to={`/products/${product._id}`} className="block relative overflow-hidden bg-zinc-50">
        <div className="aspect-square">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = `https://placehold.co/400x400/f4f4f5/71717a?text=Product`
            }}
          />
        </div>
        {/* Category badge */}
        <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
          {product.category}
        </span>
        {/* Out of stock overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-zinc-700 text-xs font-semibold px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <Link to={`/products/${product._id}`}>
          <h3 className="text-zinc-800 font-semibold text-sm leading-tight hover:text-amber-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mt-2">
          <span className="text-zinc-900 font-bold text-base">₹{product.price.toLocaleString()}</span>
          <span className="text-zinc-400 text-[11px]">{product.stock > 0 ? `${product.stock} left` : 'Sold out'}</span>
        </div>

        {onAddToCart && (
          <button
            onClick={() => onAddToCart(product._id)}
            disabled={product.stock === 0}
            className="mt-3 w-full bg-zinc-900 hover:bg-amber-400 hover:text-zinc-900 text-white text-xs font-semibold py-2.5 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        )}
      </div>
    </div>
  )
}

export default ProductCard