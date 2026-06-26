import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCity } from '../context/CityContext';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, totalMonthlyRent, totalSecurityDeposit } = useCart();
  const { selectedCity } = useCity();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="container flex-center fade-in" style={{ minHeight: '65vh', flexDirection: 'column', gap: '16px' }}>
        <span style={{ fontSize: '4rem' }}>🛒</span>
        <h2 style={{ fontFamily: 'var(--font-secondary)', fontSize: '1.6rem', fontWeight: 700 }}>
          Your Cart is Empty
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', textAlign: 'center' }}>
          relocate seamlessly. Browse our premium selection of beds, sofas, refrigerators, and TVs.
        </p>
        <button 
          onClick={() => navigate('/catalog')} 
          className="btn btn-primary"
          style={{ marginTop: '8px' }}
        >
          Browse Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '30px 24px', minHeight: '80vh' }}>
      <h1 className="section-title">Your Rental Cart</h1>
      <p className="section-subtitle">Review items and configurations for delivery in <b>{selectedCity}</b></p>

      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        
        {/* Left Side: Items List */}
        <div style={{ flex: '3 1 600px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {cartItems.map((item, idx) => (
            <div 
              key={`${item.product._id}-${item.tenure}`}
              className="glass fade-in"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '24px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                gap: '24px',
                flexWrap: 'wrap',
              }}
            >
              {/* Product Thumbnail */}
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                background: '#1e293b',
                flexShrink: 0,
              }}>
                <img 
                  src={item.product.images[0]} 
                  alt={item.product.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Title & Tenure */}
              <div style={{ flexGrow: 1, minWidth: '200px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                  {item.product.name}
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                  Category: {item.product.category} ({item.product.subcategory})
                </span>
                <span className="badge badge-info" style={{ marginTop: '8px', display: 'inline-block' }}>
                  ⏱️ {item.tenure} Months Tenure
                </span>
              </div>

              {/* Quantity Selector */}
              <div className="flex-center" style={{ gap: '12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '6px 12px' }}>
                <button
                  onClick={() => updateQuantity(item.product._id, item.tenure, item.quantity - 1)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 700, fontSize: '1.1rem' }}
                >
                  -
                </button>
                <span style={{ fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.product._id, item.tenure, item.quantity + 1)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 700, fontSize: '1.1rem' }}
                >
                  +
                </button>
              </div>

              {/* Pricing breakdown */}
              <div style={{ textAlign: 'right', minWidth: '120px' }}>
                <div style={{ marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Monthly Rent</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-secondary)' }}>
                    ₹{item.monthlyRent * item.quantity}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    (₹{item.monthlyRent} each)
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Security Deposit</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                    ₹{item.securityDeposit * item.quantity}
                  </span>
                </div>
              </div>

              {/* Delete Icon */}
              <button
                onClick={() => removeFromCart(item.product._id, item.tenure)}
                className="btn btn-outline"
                style={{
                  padding: '8px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--color-danger)',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                }}
                title="Remove Item"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        {/* Right Side: Summary Sidebar */}
        <div style={{ flex: '1 1 300px' }}>
          <div className="glass" style={{
            padding: '28px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-glow)',
            boxShadow: 'var(--shadow-md)',
            position: 'sticky',
            top: '110px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-secondary)' }}>
              Summary Order
            </h3>

            {/* Calculations Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <div className="flex-between" style={{ fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Monthly Rental Total</span>
                <span style={{ fontWeight: 600, color: 'var(--color-secondary)' }}>₹{totalMonthlyRent} /mo</span>
              </div>
              <div className="flex-between" style={{ fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Security Deposit (Refundable)</span>
                <span style={{ fontWeight: 600 }}>₹{totalSecurityDeposit}</span>
              </div>
              <div className="flex-between" style={{ fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Delivery & Setup</span>
                <span className="badge badge-success">FREE</span>
              </div>
            </div>

            {/* Payable Amount details */}
            <div className="flex-between" style={{ padding: '8px 0' }}>
              <div>
                <span style={{ fontWeight: 700, display: 'block', fontSize: '1rem' }}>Payable Now</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>(Refundable Deposit)</span>
              </div>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                ₹{totalSecurityDeposit}
              </span>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              💡 <b>Note:</b> You only pay the security deposit now. The monthly rental of <b>₹{totalMonthlyRent}</b> will start upon delivery of items.
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-primary"
              style={{ width: '100%', height: '48px', fontSize: '1.05rem' }}
            >
              Proceed to Delivery 🚚
            </button>
            
            <Link to="/catalog" style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'underline' }}>
              Continue Browsing
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;
