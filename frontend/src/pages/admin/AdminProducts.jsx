import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import { getProducts, deleteProduct, createProduct, updateProduct } from '../../services/api';
import { getCategories } from '../../services/api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const emptyForm = {
    name: '', slug: '', description: '', shortDescription: '', price: '',
    originalPrice: '', category: '', brand: 'Gorerbazar', stock: '', unit: 'piece',
    weight: '', tags: '', isFeatured: false, isBestSelling: false,
    isNewArrival: false, isOrganic: false, isPreOrder: false, isActive: true
  };
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState([]);

  useEffect(() => {
    getCategories().then(res => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts({ page, limit: 20, search: search || undefined });
      setProducts(res.data.products);
      setTotal(res.data.total);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (typeof v === 'boolean') data.append(k, v ? 'true' : 'false');
        else if (v !== '' && v !== undefined) data.append(k, v);
      });
      images.forEach(img => data.append('images', img));

      if (editId) {
        await updateProduct(editId, data);
      } else {
        await createProduct(data);
      }
      setShowModal(false);
      setForm(emptyForm);
      setImages([]);
      setEditId(null);
      fetchProducts();
    } catch (err) {
      alert('Error saving product: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (p) => {
    setEditId(p._id);
    setForm({
      name: p.name, slug: p.slug, description: p.description || '',
      shortDescription: p.shortDescription || '', price: p.price,
      originalPrice: p.originalPrice || '', category: p.category?._id || p.category || '',
      brand: p.brand || '', stock: p.stock, unit: p.unit || 'piece',
      weight: p.weight || '', tags: p.tags?.join(', ') || '',
      isFeatured: p.isFeatured, isBestSelling: p.isBestSelling,
      isNewArrival: p.isNewArrival, isOrganic: p.isOrganic,
      isPreOrder: p.isPreOrder, isActive: p.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (err) { alert('Error deleting product'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700' }}>Products ({total})</h1>
        <button onClick={() => { setForm(emptyForm); setEditId(null); setImages([]); setShowModal(true); }} className="btn btn-primary">
          <FiPlus /> Add Product
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
        <input
          type="text" placeholder="Search products..." value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="form-input" style={{ maxWidth: '300px' }}
        />
      </div>

      {/* Products Table */}
      <div style={{ background: '#fff', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600' }}>Product</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600' }}>Price</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600' }}>Stock</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={p.images?.[0] || p.thumbnail || 'https://via.placeholder.com/40'} alt={p.name}
                        style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }}
                      />
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '14px' }}>{p.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{p.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: '600' }}>৳{p.price?.toLocaleString()}</td>
                  <td style={{ padding: '12px 16px' }}>{p.stock}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge ${p.isActive ? 'badge-green' : 'badge-red'}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <button onClick={() => handleEdit(p)} style={{ background: 'none', border: 'none', color: 'var(--primary-dark)', marginRight: '8px' }}>
                      <FiEdit2 />
                    </button>
                    <button onClick={() => handleDelete(p._id)} style={{ background: 'none', border: 'none', color: '#dc2626' }}>
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {Math.ceil(total / 20) > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
          {Array.from({ length: Math.min(Math.ceil(total / 20), 10) }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} style={{
              width: '36px', height: '36px', borderRadius: 'var(--radius-sm)',
              border: 'none', fontWeight: '600',
              background: p === page ? 'var(--primary)' : 'var(--bg-secondary)',
              color: p === page ? '#fff' : 'var(--text-primary)'
            }}>{p}</button>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: '16px'
        }} onClick={() => setShowModal(false)}>
          <div style={{
            background: '#fff', borderRadius: 'var(--radius)', padding: '24px',
            width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>
              {editId ? 'Edit Product' : 'Add Product'}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Product Name *</label>
                <input className="form-input" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Slug</label>
                <input className="form-input" value={form.slug} onChange={(e) => setForm({...form, slug: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Brand</label>
                <input className="form-input" value={form.brand} onChange={(e) => setForm({...form, brand: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Price *</label>
                <input type="number" className="form-input" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Original Price</label>
                <input type="number" className="form-input" value={form.originalPrice} onChange={(e) => setForm({...form, originalPrice: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-input" value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}>
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Stock</label>
                <input type="number" className="form-input" value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Unit</label>
                <input className="form-input" value={form.unit} onChange={(e) => setForm({...form, unit: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Weight</label>
                <input className="form-input" placeholder="e.g. 1kg, 500g" value={form.weight} onChange={(e) => setForm({...form, weight: e.target.value})} />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Short Description</label>
                <input className="form-input" value={form.shortDescription} onChange={(e) => setForm({...form, shortDescription: e.target.value})} />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Description</label>
                <textarea className="form-input" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Tags (comma separated)</label>
                <input className="form-input" value={form.tags} onChange={(e) => setForm({...form, tags: e.target.value})} />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Product Images</label>
                <input type="file" multiple accept="image/*" onChange={(e) => setImages(Array.from(e.target.files))}
                  className="form-input" />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  {[
                    { key: 'isFeatured', label: 'Featured' },
                    { key: 'isBestSelling', label: 'Best Selling' },
                    { key: 'isNewArrival', label: 'New Arrival' },
                    { key: 'isOrganic', label: 'Organic' },
                    { key: 'isPreOrder', label: 'Pre-Order' },
                    { key: 'isActive', label: 'Active' }
                  ].map(toggle => (
                    <label key={toggle.key} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
                      <input type="checkbox" checked={form[toggle.key]}
                        onChange={(e) => setForm({...form, [toggle.key]: e.target.checked})} />
                      {toggle.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '20px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} className="btn btn-outline">Cancel</button>
              <button onClick={handleSave} className="btn btn-primary">
                {editId ? 'Update' : 'Create'} Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
