import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiShoppingCart, FiMinus, FiPlus, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';
import { getProduct } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getProduct(slug);
        setProduct(res.data);
        // Fetch related products from same category
        if (res.data.category?._id) {
          const { getProducts } = await import('../services/api');
          const rel = await getProducts({ category: res.data.category._id, limit: 4 });
          setRelated(rel.data.products.filter(p => p._id !== res.data._id));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <div style={{
          width: '36px', height: '36px', border: '3px solid var(--border)',
          borderTopColor: 'var(--primary)', borderRadius: '50%',
          animation: 'spin 1s linear infinite', margin: '0 auto 12px'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <h2>Product not found</h2>
        <Link to="/products" className="btn btn-primary" style={{ marginTop: '16px' }}>Browse Products</Link>
      </div>
    );
  }

  const discount = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : product.discount || 0;

  const imageUrl = product.images?.[0] || product.thumbnail || 'https://via.placeholder.com/600x600?text=No+Image';

  return (
    <div className="container" style={{ padding: '24px 16px' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: '24px', fontSize: '14px', color: 'var(--text-muted)' }}>
        <Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <Link to="/products" style={{ color: 'var(--text-muted)' }}>Products</Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <span style={{ color: 'var(--text-primary)' }}>{product.name}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }} className="product-detail-grid">
        {/* Image */}
        <div>
          <div style={{
            borderRadius: 'var(--radius)', overflow: 'hidden',
            background: '#f8f9fa', position: 'relative'
          }}>
            {discount > 0 && (
              <span className="badge badge-red" style={{
                position: 'absolute', top: '16px', left: '16px', zIndex: 2,
                fontSize: '14px', padding: '4px 12px'
              }}>-{discount}%</span>
            )}
            <img
              src={imageUrl}
              alt={product.name}
              style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }}
              onError={(e) => { e.target.src = 'https://via.placeholder.com/600x600?text=No+Image'; }}
            />
          </div>
        </div>

        {/* Details */}
        <div>
          {product.brand && (
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>
              {product.brand}
            </span>
          )}
          <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '8px 0 12px' }}>
            {product.name}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '2px' }}>
              {[1,2,3,4,5].map(s => (
                <span key={s} style={{ color: s <= Math.round(product.rating) ? '#fbbf24' : '#e2e8f0', fontSize: '16px' }}>★</span>
              ))}
            </div>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              ({product.reviewCount || 0} reviews)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <span style={{ fontSize: '32px', fontWeight: '800', color: 'var(--primary-dark)' }}>
              ৳{product.price.toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <span style={{ fontSize: '20px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                ৳{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {product.shortDescription && (
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.7 }}>
              {product.shortDescription}
            </p>
          )}

          {/* Quantity & Add to Cart */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              border: '2px solid var(--border)', borderRadius: 'var(--radius-sm)',
              overflow: 'hidden'
            }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={{
                padding: '10px 14px', background: 'none', border: 'none'
              }}><FiMinus /></button>
              <span style={{ padding: '10px 20px', fontWeight: '700', minWidth: '50px', textAlign: 'center' }}>{qty}</span>
              <button onClick={() => setQty(qty + 1)} style={{
                padding: '10px 14px', background: 'none', border: 'none'
              }}><FiPlus /></button>
            </div>
            <button
              onClick={() => addToCart(product, qty)}
              className="btn btn-primary btn-lg"
              style={{ flex: 1 }}
            >
              <FiShoppingCart /> Add to Cart
            </button>
          </div>

          {/* Stock & Delivery Info */}
          <div style={{
            background: 'var(--bg-secondary)', borderRadius: 'var(--radius)',
            padding: '16px', marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <FiTruck size={18} color="var(--primary-dark)" />
              <span style={{ fontSize: '14px' }}>
                {product.stock > 0 ? (
                  <span style={{ color: 'var(--primary-dark)', fontWeight: '600' }}>In Stock</span>
                ) : (
                  <span style={{ color: '#dc2626', fontWeight: '600' }}>Out of Stock</span>
                )}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <FiShield size={18} color="var(--primary-dark)" />
              <span style={{ fontSize: '14px' }}>100% Authentic Product</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiRefreshCw size={18} color="var(--primary-dark)" />
              <span style={{ fontSize: '14px' }}>7 Day Return Policy</span>
            </div>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {product.tags.map((tag, i) => (
                <span key={i} style={{
                  padding: '4px 12px', background: 'var(--bg-secondary)',
                  borderRadius: '20px', fontSize: '12px', color: 'var(--text-secondary)'
                }}>{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>Description</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{product.description}</p>
        </div>
      )}

      {/* Related Products */}
      {related.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>Related Products</h2>
          <div className="grid-4">
            {related.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .product-detail-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;
