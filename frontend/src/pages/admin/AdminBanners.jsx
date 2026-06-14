import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { getBanners, createBanner, deleteBanner } from '../../services/api';

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', subtitle: '', link: '', buttonText: 'Shop Now', position: 'hero', order: 0, isActive: true });
  const [image, setImage] = useState(null);

  useEffect(() => { fetchBanners(); }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await getBanners();
      setBanners(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (image) data.append('image', image);
      await createBanner(data);
      setShowModal(false);
      setForm({ title: '', subtitle: '', link: '', buttonText: 'Shop Now', position: 'hero', order: 0, isActive: true });
      setImage(null);
      fetchBanners();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    try {
      await deleteBanner(id);
      fetchBanners();
    } catch (err) { alert('Error deleting banner'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700' }}>Banners</h1>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <FiPlus /> Add Banner
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {loading ? (
          <div>Loading...</div>
        ) : banners.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No banners yet</div>
        ) : (
          banners.map(b => (
            <div key={b._id} style={{
              background: '#fff', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow)'
            }}>
              <div style={{
                height: '160px', background: b.image ? `url(${b.image}) center/cover` : 'linear-gradient(135deg, #1a1a2e, #16213e)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
              }}>
                {!b.image && <span style={{ fontSize: '48px' }}>🖼️</span>}
              </div>
              <div style={{ padding: '16px' }}>
                <h3 style={{ fontWeight: '700', marginBottom: '4px' }}>{b.title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>{b.subtitle}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="badge badge-blue">{b.position}</span>
                  <button onClick={() => handleDelete(b._id)} style={{ background: 'none', border: 'none', color: '#dc2626' }}>
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: '16px'
        }} onClick={() => setShowModal(false)}>
          <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: '24px', width: '100%', maxWidth: '450px' }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>Add Banner</h2>
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input className="form-input" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Subtitle</label>
              <input className="form-input" value={form.subtitle} onChange={(e) => setForm({...form, subtitle: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Link</label>
              <input className="form-input" value={form.link} onChange={(e) => setForm({...form, link: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Button Text</label>
              <input className="form-input" value={form.buttonText} onChange={(e) => setForm({...form, buttonText: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Position</label>
              <select className="form-input" value={form.position} onChange={(e) => setForm({...form, position: e.target.value})}>
                <option value="hero">Hero</option>
                <option value="middle">Middle</option>
                <option value="bottom">Bottom</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Image</label>
              <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="form-input" />
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '20px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} className="btn btn-outline">Cancel</button>
              <button onClick={handleSave} className="btn btn-primary">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBanners;
