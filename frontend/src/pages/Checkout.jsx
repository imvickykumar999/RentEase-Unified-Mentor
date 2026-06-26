import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useCity } from '../context/CityContext';

const Checkout = () => {
  const { user, token } = useAuth();
  const { cartItems, totalMonthlyRent, totalSecurityDeposit, clearCart } = useCart();
  const { selectedCity } = useCity();
  const navigate = useNavigate();

  // Checkout states
  const [address, setAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [error, setError] = useState('');

  // Redirect if cart is empty (unless showing success page)
  useEffect(() => {
    if (cartItems.length === 0 && !orderSuccess) {
      navigate('/cart');
    }
  }, [cartItems, orderSuccess, navigate]);

  // Set default delivery date to 2 days from now
  useEffect(() => {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    const dateString = date.toISOString().split('T')[0];
    setDeliveryDate(dateString);
  }, []);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('You must be signed in to place an order.');
      return;
    }

    if (!address) {
      setError('Please provide a delivery address.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Map cartItems to items schema expected by backend
      const items = cartItems.map((item) => ({
        product: item.product._id,
        tenure: item.tenure,
        quantity: item.quantity,
      }));

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items,
          deliveryAddress: address,
          deliveryCity: selectedCity,
          deliveryDate: new Date(deliveryDate),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOrderSuccess(data.data);
        clearCart();
      } else {
        setError(data.message || 'Failed to place order.');
      }
    } catch (err) {
      setError('Connection to backend failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If not logged in, prompt to log in first
  if (!user) {
    return (
      <div className="container flex-center fade-in" style={{ minHeight: '65vh', flexDirection: 'column', gap: '16px' }}>
        <span style={{ fontSize: '4.5rem' }}>🔒</span>
        <h2 style={{ fontFamily: 'var(--font-secondary)', fontSize: '1.6rem', fontWeight: 700 }}>
          Authentication Required
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', textAlign: 'center' }}>
          Please sign in or register to complete your rental order and schedule delivery.
        </p>
        <button 
          onClick={() => navigate('/login')} 
          className="btn btn-primary"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  // Success view
  if (orderSuccess) {
    return (
      <div className="container flex-center fade-in" style={{ minHeight: '70vh', padding: '40px 0' }}>
        <div className="glass" style={{
          maxWidth: '550px',
          width: '100%',
          padding: '40px',
          borderRadius: 'var(--radius-xl)',
          textAlign: 'center',
          border: '1px solid var(--color-success)',
          boxShadow: '0 0 30px rgba(16,185,129,0.15)',
        }}>
          <span style={{ fontSize: '4.5rem', display: 'block', marginBottom: '16px' }}>🎉</span>
          <h2 style={{ fontFamily: 'var(--font-secondary)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-success)', marginBottom: '8px' }}>
            Order Placed Successfully!
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px' }}>
            Your rental order has been recorded. The technician will deliver and install your items on the scheduled date.
          </p>

          {/* Details list */}
          <div className="glass" style={{
            padding: '20px',
            borderRadius: 'var(--radius-md)',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginBottom: '32px',
            background: 'rgba(255,255,255,0.02)',
          }}>
            <div className="flex-between">
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Order ID:</span>
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{orderSuccess._id}</span>
            </div>
            <div className="flex-between">
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Scheduled Delivery:</span>
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                {new Date(orderSuccess.deliveryDate).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </span>
            </div>
            <div className="flex-between">
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Delivery City:</span>
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{orderSuccess.deliveryCity}</span>
            </div>
            <div className="flex-between" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Payed Deposit (Refundable):</span>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-secondary)' }}>
                ₹{orderSuccess.totalSecurityDeposit}
              </span>
            </div>
            <div className="flex-between">
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Monthly Rent:</span>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-primary)' }}>
                ₹{orderSuccess.totalMonthlyRent} /mo
              </span>
            </div>
          </div>

          <div className="flex-center" style={{ gap: '16px' }}>
            <button 
              onClick={() => navigate('/portal')} 
              className="btn btn-primary"
            >
              View Active Rentals
            </button>
            <button 
              onClick={() => navigate('/catalog')} 
              className="btn btn-outline"
            >
              Back to Catalog
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '30px 24px', minHeight: '80vh' }}>
      <h1 className="section-title">Schedule & Delivery</h1>
      <p className="section-subtitle">Provide your address and complete the mock payment process</p>

      {error && (
        <div className="badge badge-danger" style={{
          display: 'block',
          padding: '12px',
          marginBottom: '24px',
          textTransform: 'none',
          fontWeight: 600,
          textAlign: 'center',
        }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        
        {/* Left Side: Address form */}
        <div style={{ flex: '3 1 500px' }}>
          <form onSubmit={handlePlaceOrder} className="glass" style={{
            padding: '32px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-secondary)' }}>
              🚚 Shipping & Setup Address
            </h3>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Delivery City (scoped by selector)</label>
              <input
                type="text"
                className="form-control"
                value={selectedCity}
                disabled
                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', fontWeight: 600 }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Complete Delivery Address</label>
              <textarea
                className="form-control"
                placeholder="House No, Floor, Building Name, Street details"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Preferred Delivery Date (min. 48hr window)</label>
              <input
                type="date"
                className="form-control"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ height: '48px', marginTop: '10px', fontSize: '1.05rem' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing Payment...' : `Simulate Payment & Place Order • ₹${totalSecurityDeposit}`}
            </button>
          </form>
        </div>

        {/* Right Side: Order summary review */}
        <div style={{ flex: '1 1 320px' }}>
          <div className="glass" style={{
            padding: '24px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}>
            <h4 style={{ fontWeight: 700, fontSize: '1.1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              Order Review ({cartItems.length} items)
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '250px', overflowY: 'auto' }}>
              {cartItems.map((item) => (
                <div key={`${item.product._id}-${item.tenure}`} className="flex-between" style={{ fontSize: '0.85rem' }}>
                  <div>
                    <span style={{ fontWeight: 600, display: 'block' }}>{item.product.name}</span>
                    <span style={{ color: 'var(--text-muted)' }}>Qty: {item.quantity} • {item.tenure} mo</span>
                  </div>
                  <span style={{ fontWeight: 600 }}>₹{item.monthlyRent * item.quantity}/mo</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="flex-between" style={{ fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Security Deposit Payable:</span>
                <span style={{ fontWeight: 600 }}>₹{totalSecurityDeposit}</span>
              </div>
              <div className="flex-between" style={{ fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Monthly Rental Cost:</span>
                <span style={{ fontWeight: 600 }}>₹{totalMonthlyRent}/mo</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
