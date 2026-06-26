import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      padding: '48px 0 24px 0',
      marginTop: '64px',
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '40px',
        marginBottom: '40px',
      }}>
        {/* Branding section */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              color: 'white',
              fontSize: '1rem',
            }}>
              R
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.2rem', fontFamily: 'var(--font-secondary)' }}>
              RentEase
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>
            Affordable monthly furniture and appliance rentals for smart living. Relocate and rent with peace of mind.
          </p>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            © 2026 RentEase Inc. All rights reserved.
          </span>
        </div>

        {/* Categories */}
        <div>
          <h4 style={{ fontFamily: 'var(--font-secondary)', fontSize: '1.1rem', marginBottom: '16px', fontWeight: 600 }}>Categories</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <li><Link to="/catalog?category=Furniture" style={{ transition: 'color var(--transition-fast)' }} onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>Furniture Rentals</Link></li>
            <li><Link to="/catalog?category=Appliances" style={{ transition: 'color var(--transition-fast)' }} onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>Appliance Rentals</Link></li>
            <li><Link to="/catalog" style={{ transition: 'color var(--transition-fast)' }} onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>All Rental Products</Link></li>
          </ul>
        </div>

        {/* Service Cities */}
        <div>
          <h4 style={{ fontFamily: 'var(--font-secondary)', fontSize: '1.1rem', marginBottom: '16px', fontWeight: 600 }}>Service Cities</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <li>Bangalore</li>
            <li>Mumbai</li>
            <li>Delhi NCR</li>
            <li>Pune</li>
            <li>Chennai</li>
          </ul>
        </div>

        {/* Legal & Help */}
        <div>
          <h4 style={{ fontFamily: 'var(--font-secondary)', fontSize: '1.1rem', marginBottom: '16px', fontWeight: 600 }}>Support</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <li><Link to="/portal" style={{ transition: 'color var(--transition-fast)' }} onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>Raise Maintenance Ticket</Link></li>
            <li><a href="#" style={{ transition: 'color var(--transition-fast)' }} onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>Terms of Service</a></li>
            <li><a href="#" style={{ transition: 'color var(--transition-fast)' }} onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>Privacy Policy</a></li>
            <li><a href="#" style={{ transition: 'color var(--transition-fast)' }} onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>FAQs & Relocation Guide</a></li>
          </ul>
        </div>
      </div>

      <div className="container" style={{
        borderTop: '1px solid var(--border-color)',
        paddingTop: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Built with 💜 for students and professionals. Powered by MERN stack.
        </div>
        <div className="flex-gap">
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Follow us:</span>
          {/* Social icons */}
          <span style={{ cursor: 'pointer', fontSize: '1.1rem' }}>🌐</span>
          <span style={{ cursor: 'pointer', fontSize: '1.1rem' }}>🐦</span>
          <span style={{ cursor: 'pointer', fontSize: '1.1rem' }}>📸</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
