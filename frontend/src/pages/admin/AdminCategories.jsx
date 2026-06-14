import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/api';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '', order: 0, isActive: true });

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    try {
      if (editId) {
        await updateCategory(editId, form);
      } else {
        await createCategory(form);
      }
      setShowModal(false);
      setForm({ name: '', slug: '', description: '', order: 0, isActive: true });
      setEditId(null);
      fetchCategories();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (c) => {
    setEditId(c._id);
    setForm({ name: c.name, slug: c.slug, description: c.description || '', order: c.order || 0, isActive: c.isActive });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await deleteCategory(id);
      fetchCategories();
    } catch (err) { alert('Error deleting category'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700' }}>Categories</h1>
        <button onClick={() => { setForm({ name: '', slug: '', description: '', order: 0, isActive: true }); setEditId(null); setShowModal(true); }} className="btn btn-primary">
          <FiPlus /> Add Category
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600' }}>Name</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600' }}>Slug</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600' }}>Order</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(c => (
                <tr key={c._id} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '600' }}>{c.name}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{c.slug}</td>
                  <td style={{ padding: '12px 16px' }}>{c.order}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge ${c.isActive ? 'badge-green' : 'badge-red'}`}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <button onClick={() => handleEdit(c)} style={{ background: 'none', border: 'none', color: 'var(--primary-dark)', marginRight: '8px' }}>
                      <FiEdit2 />
                    </button>
                    <button onClick={() => handleDelete(c._id)} style={{ background: 'none', border: 'none', color: '#dc2626' }}>
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: '16px'
        }} onClick={() => setShowModal(false)}>
          <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: '24px', width: '100%', maxWidth: '450px' }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>
              {editId ? 'Edit Category' : 'Add Category'}
            </h2>
            <div className="form-group">
              <label className="form-label">Name *</label>
              <input className="form-input" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Slug</label>
              <input className="form-input" value={form.slug} onChange={(e) => setForm({...form, slug: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Order</label>
              <input type="number" className="form-input" value={form.order} onChange={(e) => setForm({...form, order: e.target.value})} />
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '20px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} className="btn btn-outline">Cancel</button>
              <button onClick={handleSave} className="btn btn-primary">{editId ? 'Update' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
