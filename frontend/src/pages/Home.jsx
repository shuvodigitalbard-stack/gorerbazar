import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { FiArrowRight, FiTruck, FiShield, FiRefreshCw, FiHeadphones } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { getFeaturedProducts, getBestSellingProducts, getBanners, getCategories } from '../services/api';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [bestSelling, setBestSelling] = useState([]);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fRes, bRes, banRes, cRes] = await Promise.all([
          getFeaturedProducts(),
          getBestSellingProducts(),
          getBanners({ position: 'hero' }),
          getCategories()
        ]);
        setFeatured(fRes.data);
        setBestSelling(bRes.data);
        setBanners(banRes.data);
        setCategories(cRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false
  };

  const features = [
    { icon: <FiTruck size={24} />, title: 'Free Delivery', desc: 'On orders over ৳2000' },
    { icon: <FiShield size={24} />, title: '100% Authentic', desc: 'Guaranteed quality' },
    { icon: <FiRefreshCw size={24} />, title: 'Easy Return', desc: '7 day return policy' },
    { icon: <FiHeadphones size={24} />, title: '24/7 Support', desc: 'Always here to help' }
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px', height: '40px', border: '4px solid var(--border)',
            borderTopColor: 'var(--primary)', borderRadius: '50%',
            animation: 'spin 1s linear infinite', margin: '0 auto 16px'
          }} />
          <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Slider */}
      <section style={{ position: 'relative' }}>
        {banners.length > 0 ? (
          <Slider {...sliderSettings}>
            {banners.map((banner, i) => (
              <div key={i}>
                <div style={{
                  background: banner.image
                    ? `linear-gradient(135deg, rgba(0,0,0,0.5), rgba(0,0,0,0.3)), url(${banner.image}) center/cover`
                    : 'linear-gradient(135deg, #1a1a2e, #16213e)',
                  padding: '80px 0',
                  color: '#fff',
                  minHeight: '400px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <div className="container">
                    <div style={{ maxWidth: '600px' }}>
                      <h1 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '16px', lineHeight: 1.2 }}>
                        {banner.title}
                      </h1>
                      <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: '24px' }}>
                        {banner.subtitle}
                      </p>
                      <Link
                        to={banner.link || '/products'}
                        className="btn btn-primary btn-lg"
                      >
                        {banner.buttonText || 'Shop Now'} <FiArrowRight />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        ) : (
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
            padding: '80px 0', color: '#fff', minHeight: '400px', display: 'flex', alignItems: 'center'
          }}>
            <div className="container">
              <div style={{ maxWidth: '600px' }}>
                <h1 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '16px', lineHeight: 1.2 }}>
                  100% Natural &<br />Organic Products
                </h1>
                <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: '24px' }}>
                  Fresh from nature to your doorstep. Premium honey, ghee, dates, spices and more.
                </p>
                <Link to="/products" className="btn btn-primary btn-lg">
                  Shop Now <FiArrowRight />
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Features Bar */}
      <section style={{ background: 'var(--bg-secondary)', padding: '24px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {features.map((f, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 16px', background: '#fff', borderRadius: 'var(--radius-sm)',
                boxShadow: 'var(--shadow)'
              }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #dcfce7, #f0fdf4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--primary-dark)', flexShrink: 0
                }}>{f.icon}</div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>{f.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Browse our wide range of natural products</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' }}>
              {categories.slice(0, 10).map(cat => (
                <Link
                  key={cat._id}
                  to={`/category/${cat.slug}`}
                  style={{
                    textAlign: 'center', padding: '20px 12px',
                    background: '#fff', borderRadius: 'var(--radius)',
                    boxShadow: 'var(--shadow)', transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{
                    width: '56px', height: '56px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #dcfce7, #f0fdf4)',
                    margin: '0 auto 12px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '24px'
                  }}>
                    {cat.name === 'Honey' ? '🍯' : cat.name === 'Dates' ? '🌴' : cat.name === 'Spices' ? '🌶️' : cat.name === 'Oil & Ghee' ? '🫒' : cat.name === 'Organic' ? '🌿' : cat.name === 'Mango' ? '🥭' : cat.name === 'Nuts & Seeds' ? '🥜' : cat.name === 'Rice' ? '🌾' : cat.name === 'Beverage' ? '☕' : '📦'}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '600' }}>{cat.name}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="section" style={{ background: 'var(--bg-secondary)' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 className="section-title" style={{ marginBottom: '4px' }}>Featured Products</h2>
                <p className="section-subtitle" style={{ marginBottom: 0 }}>Handpicked for you</p>
              </div>
              <Link to="/products" className="btn btn-outline btn-sm">View All <FiArrowRight /></Link>
            </div>
            <div className="grid-4">
              {featured.slice(0, 8).map(p => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Best Selling */}
      {bestSelling.length > 0 && (
        <section className="section">
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 className="section-title" style={{ marginBottom: '4px' }}>Best Selling</h2>
                <p className="section-subtitle" style={{ marginBottom: 0 }}>Our most popular products</p>
              </div>
              <Link to="/products?sort=bestselling" className="btn btn-outline btn-sm">View All <FiArrowRight /></Link>
            </div>
            <div className="grid-4">
              {bestSelling.slice(0, 8).map(p => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section style={{
        background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
        padding: '60px 0', color: '#fff', textAlign: 'center'
      }}>
        <div className="container">
          <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '12px' }}>
            Get 10% Off Your First Order
          </h2>
          <p style={{ fontSize: '16px', opacity: 0.8, marginBottom: '24px' }}>
            Subscribe to our newsletter for exclusive deals and updates
          </p>
          <div style={{ display: 'flex', gap: '8px', maxWidth: '400px', margin: '0 auto' }}>
            <input
              type="email"
              placeholder="Enter your email"
              style={{
                flex: 1, padding: '12px 16px', borderRadius: 'var(--radius-sm)',
                border: 'none', fontSize: '14px'
              }}
            />
            <button className="btn btn-primary">Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
