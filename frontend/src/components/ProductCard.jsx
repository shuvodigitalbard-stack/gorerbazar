import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const discount = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : product.discount || 0;

  const imageUrl = product.images?.[0] || product.thumbnail || 'https://via.placeholder.com/300x300?text=No+Image';

  return (
    <div style={{
      background: '#fff', borderRadius: 'var(--radius)', overflow: 'hidden',
      boxShadow: 'var(--shadow)', transition: 'transform 0.2s, box-shadow 0.2s',
      position: 'relative', display: 'flex', flexDirection: 'column'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'var(--shadow)';
    }}
    >
      {/* Badges */}
      <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '4px', zIndex: 2 }}>
        {discount > 0 && (
          <span className="badge badge-red">-{discount}%</span>
        )}
        {product.isBestSelling && (
          <span className="badge badge-gold">Best Selling</span>
        )}
        {product.isNewArrival && (
          <span className="badge badge-blue">New</span>
        )}
        {product.isOrganic && (
          <span className="badge badge-green">Organic</span>
        )}
        {product.isPreOrder && (
          <span className="badge" style={{ background: '#ede9fe', color: '#7c3aed' }}>Pre-Order</span>
        )}
      </div>

      {/* Wishlist */}
      <button style={{
        position: 'absolute', top: '10px', right: '10px', zIndex: 2,
        width: '32px', height: '32px', borderRadius: '50%',
        background: 'rgba(255,255,255,0.9)', border: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <FiHeart size={16} color="#64748b" />
      </button>

      {/* Image */}
      <Link to={`/product/${product.slug}`} style={{ display: 'block', overflow: 'hidden' }}>
        <div style={{
          width: '100%', aspectRatio: '1', background: '#f8f9fa',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden'
        }}>
          <img
            src={imageUrl}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'; }}
          />
        </div>
      </Link>

      {/* Content */}
      <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {product.brand && (
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500', textTransform: 'uppercase' }}>
            {product.brand}
          </span>
        )}
        <Link to={`/product/${product.slug}`}>
          <h3 style={{
            fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)',
            margin: '4px 0 8px', lineHeight: 1.4,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {product.name}
          </h3>
        </Link>

        {product.weight && (
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
            {product.weight}
          </span>
        )}

        <div style={{ marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span className="price-current">৳{product.price.toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <span className="price-original">৳{product.originalPrice.toLocaleString()}</span>
            )}
          </div>

          <button
            onClick={() => addToCart(product)}
            style={{
              width: '100%', padding: '8px', borderRadius: 'var(--radius-sm)',
              background: 'var(--gradient-primary)', color: '#fff',
              border: 'none', fontSize: '13px', fontWeight: '600',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.9'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            <FiShoppingCart size={14} /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
