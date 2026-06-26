import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const categories = [
    {
      title: 'Premium Furniture',
      subtitle: 'Beds, Sofas, Office tables, Chairs & more',
      category: 'Furniture',
      img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80',
    },
    {
      title: 'Smart Appliances',
      subtitle: 'Refrigerators, Washing Machines, LED TVs, ACs',
      category: 'Appliances',
      img: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80',
    },
  ];

  const benefits = [
    { icon: '🛠️', title: 'Zero Maintenance Cost', desc: 'Free repair and servicing support for all products during your tenure.' },
    { icon: '🚚', title: 'Free Relocation', desc: 'Moving inside the city? We will pack and transport your rentals for free.' },
    { icon: '📈', title: 'Flexible Tenures', desc: 'Choose plans from 3 to 24 months. Upgrade or extend easily.' },
    { icon: '💰', title: 'Refundable Deposits', desc: 'Secure security deposits returned fully within 7 days of pickup.' },
  ];

  const stats = [
    { value: '15,000+', label: 'Active Rentals' },
    { value: '5 Major', label: 'Cities Covered' },
    { value: '99.2%', label: 'Happy Customers' },
    { value: '24 Hours', label: 'Maintenance Response' },
  ];

  return (
    <div className="fade-in" style={{ minHeight: '80vh' }}>
      
      {/* 1. Hero Section */}
      <section style={{
        padding: '80px 0 60px 0',
        position: 'relative',
        textAlign: 'center',
        background: 'radial-gradient(circle at 50% 30%, rgba(99, 102, 241, 0.15), transparent 60%)',
      }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          <span className="badge badge-info" style={{ marginBottom: '16px', letterSpacing: '1px' }}>
            ⚡ Relocation Simplified
          </span>
          <h1 style={{
            fontFamily: 'var(--font-secondary)',
            fontSize: '3.6rem',
            lineHeight: '1.15',
            fontWeight: 800,
            marginBottom: '20px',
            letterSpacing: '-1px',
            background: 'linear-gradient(135deg, var(--text-primary) 30%, var(--color-primary) 80%, var(--color-secondary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Rent Furniture & Appliances on Your Terms
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: 'var(--text-secondary)',
            marginBottom: '32px',
            maxWidth: '650px',
            margin: '0 auto 32px auto',
          }}>
            Relocating for a job or studies? Ditch the burden of buying. Get premium beds, sofas, refrigerators, and TVs on low monthly rent.
          </p>
          <div className="flex-center" style={{ gap: '16px' }}>
            <button 
              onClick={() => navigate('/catalog')} 
              className="btn btn-primary"
              style={{ padding: '14px 28px', fontSize: '1.05rem' }}
            >
              Explore Catalog 🚀
            </button>
            <button 
              onClick={() => navigate('/login')} 
              className="btn btn-outline"
              style={{ padding: '14px 28px', fontSize: '1.05rem' }}
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* 2. Quick Categories */}
      <section style={{ padding: '40px 0' }}>
        <div className="container">
          <h2 className="section-title text-center" style={{ textAlign: 'center' }}>Choose by Category</h2>
          <p className="section-subtitle" style={{ textAlign: 'center' }}>High-quality rental inventory catered to your needs</p>
          
          <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>
            {categories.map((cat) => (
              <div 
                key={cat.category}
                className="card"
                onClick={() => navigate(`/catalog?category=${cat.category}`)}
                style={{
                  cursor: 'pointer',
                  position: 'relative',
                  height: '280px',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  padding: '30px',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {/* Background image overlay */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 1,
                  backgroundImage: `linear-gradient(to top, rgba(8, 11, 17, 0.95) 20%, rgba(8, 11, 17, 0.3) 100%), url(${cat.img})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transition: 'transform var(--transition-slow)',
                }}
                className="category-bg"
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                />
                
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <h3 style={{ fontFamily: 'var(--font-secondary)', fontSize: '1.8rem', fontWeight: 700, marginBottom: '6px' }}>
                    {cat.title}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '16px' }}>
                    {cat.subtitle}
                  </p>
                  <span className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }}>
                    Browse {cat.category} →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Platform Benefits */}
      <section style={{ padding: '60px 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center' }}>The RentEase Experience</h2>
          <p className="section-subtitle" style={{ textAlign: 'center' }}>Enjoy worry-free rentals with premium services bundled standard</p>

          <div className="grid-4" style={{ gap: '28px' }}>
            {benefits.map((b) => (
              <div 
                key={b.title} 
                className="glass"
                style={{
                  padding: '24px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--glass-border)',
                  textAlign: 'center',
                  transition: 'all var(--transition-normal)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'var(--color-primary)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-neon)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--glass-border)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{b.icon}</div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-primary)' }}>
                  {b.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Statistics */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div className="glass" style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            flexWrap: 'wrap',
            padding: '40px 24px',
            borderRadius: 'var(--radius-xl)',
            gap: '24px',
          }}>
            {stats.map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <h3 style={{
                  fontFamily: 'var(--font-secondary)',
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  color: 'var(--color-secondary)',
                  textShadow: '0 0 10px rgba(6,182,212,0.2)',
                }}>
                  {s.value}
                </h3>
                <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA Section */}
      <section style={{
        padding: '80px 0',
        textAlign: 'center',
      }}>
        <div className="container">
          <div className="glass" style={{
            padding: '60px 40px',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-glow)',
            boxShadow: 'var(--shadow-neon)',
            background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.8) 0%, rgba(99, 102, 241, 0.05) 100%)',
          }}>
            <h2 style={{ fontFamily: 'var(--font-secondary)', fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px' }}>
              Ready to Upgrade Your Living Space?
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 28px auto', fontSize: '1.05rem' }}>
              Relocate stress-free. Rent gorgeous furniture and appliances. Order today and get delivery scheduled in as fast as 48 hours.
            </p>
            <button 
              onClick={() => navigate('/catalog')} 
              className="btn btn-primary btn-lg"
              style={{ padding: '14px 28px' }}
            >
              Start Renting Now 🛋️
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
