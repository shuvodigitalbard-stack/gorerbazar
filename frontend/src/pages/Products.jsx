import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiFilter, FiGrid, FiList } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { getProducts, getCategories } from '../services/api';

const Products = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const categorySlug = searchParams.get('category');
  const searchQuery = searchParams.get('search') || '';
  const sortBy = searchParams.get('sort') || 'newest';

  useEffect(() => {
    getCategories().then(res => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const catId = categories.find(c => c.slug === categorySlug)?._id;
        const res = await getProducts({
          search: searchQuery,
          sort: sortBy,
          page,
          category: catId,
          limit: 20
        });
        setProducts(res.data.products);
        setTotal(res.data.total);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categorySlug, searchQuery, sortBy, page, categories]);

  const pages = Math.ceil(total / 20);
  const categoryName = categories.find(c => c.slug === categorySlug)?.name || '';

  return (
    <div className="container" style={{ padding: '24px 16px' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: '16px', fontSize: '14px', color: 'var(--text-muted)' }}>
        <Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <Link to="/products" style={{ color: 'var(--text-muted)' }}>Products</Link>
        {categoryName && (
          <>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: 'var(--text-primary)' }}>{categoryName}</span>
          </>
        )}
      </div>

      <div style={{ display: 'flex', gap: '24px' }}>
        {/* Sidebar Filters - Desktop */}
        <aside style={{ width: '240px', flexShrink: 0 }} className="hide-mobile">
          <div style={{
            background: '#fff', borderRadius: 'var(--radius)',
            padding: '20px', boxShadow: 'var(--shadow)'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Categories</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link to="/products" style={{
                padding: '8px 12px', borderRadius: 'var(--radius-sm)',
                background: !categorySlug ? 'var(--primary)' : 'transparent',
                color: !categorySlug ? '#fff' : 'var(--text-secondary)',
                fontSize: '14px', fontWeight: '500'
              }}>All Products</Link>
              {categories.map(cat => (
                <Link
                  key={cat._id}
                  to={`/products?category=${cat.slug}`}
                  style={{
                    padding: '8px 12px', borderRadius: 'var(--radius-sm)',
                    background: categorySlug === cat.slug ? 'var(--primary)' : 'transparent',
                    color: categorySlug === cat.slug ? '#fff' : 'var(--text-secondary)',
                    fontSize: '14px'
                  }}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div style={{ flex: 1 }}>
          {/* Header */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '20px', flexWrap: 'wrap', gap: '12px'
          }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '700' }}>
                {categoryName || searchQuery ? `${categoryName || searchQuery}` : 'All Products'}
              </h1>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                {total} products found
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn btn-outline btn-sm"
                style={{ display: 'none' }}
                classNameMobile="show-mobile"
              >
                <FiFilter /> Filter
              </button>
              <select
                value={sortBy}
                onChange={(e) => {
                  const params = new URLSearchParams(searchParams);
                  params.set('sort', e.target.value);
                  window.location.search = params.toString();
                }}
                className="form-input"
                style={{ width: 'auto', padding: '8px 12px' }}
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{
                width: '36px', height: '36px', border: '3px solid var(--border)',
                borderTopColor: 'var(--primary)', borderRadius: '50%',
                animation: 'spin 1s linear infinite', margin: '0 auto 12px'
              }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>No products found</h3>
              <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <div className="grid-4">
                {products.map(p => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '32px' }}>
                  {Array.from({ length: Math.min(pages, 10) }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      style={{
                        width: '36px', height: '36px', borderRadius: 'var(--radius-sm)',
                        border: 'none', fontWeight: '600', fontSize: '14px',
                        background: p === page ? 'var(--primary)' : 'var(--bg-secondary)',
                        color: p === page ? '#fff' : 'var(--text-primary)'
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </div>
  );
};

export default Products;
