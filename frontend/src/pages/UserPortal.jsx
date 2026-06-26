import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserPortal = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // Portal states
  const [orders, setOrders] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingTickets, setLoadingTickets] = useState(true);

  // New ticket state
  const [selectedOrderItem, setSelectedOrderItem] = useState(''); // Selected orderItem ID
  const [issueType, setIssueType] = useState('Repair & Maintenance');
  const [description, setDescription] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState('');
  const [ticketError, setTicketError] = useState('');
  const [submittingTicket, setSubmittingTicket] = useState(false);

  // Active view tab: 'rentals' or 'tickets'
  const [activeTab, setActiveTab] = useState('rentals');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/orders/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setOrders(data.data);
        }
      } catch (err) {
        console.error('Error fetching user orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    };

    const fetchTickets = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/maintenance/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setTickets(data.data);
        }
      } catch (err) {
        console.error('Error fetching user tickets:', err);
      } finally {
        setLoadingTickets(false);
      }
    };

    fetchOrders();
    fetchTickets();
  }, [token, navigate]);

  const handleRaiseTicket = async (e) => {
    e.preventDefault();
    setTicketError('');
    setTicketSuccess('');

    if (!selectedOrderItem) {
      setTicketError('Please select a product from your active rentals.');
      return;
    }

    setSubmittingTicket(true);

    try {
      // Find order item details from state
      const [orderId, productId] = selectedOrderItem.split('|');

      const response = await fetch(`${API_BASE_URL}/api/maintenance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId,
          productId,
          issueType,
          description,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setTicketSuccess('Service ticket raised successfully! Our support agent will assign a technician.');
        setDescription('');
        setSelectedOrderItem('');
        
        // Refresh ticket list
        const res = await fetch(`${API_BASE_URL}/api/maintenance/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const refreshedData = await res.json();
        if (refreshedData.success) {
          setTickets(refreshedData.data);
        }
      } else {
        setTicketError(data.message || 'Failed to submit maintenance request.');
      }
    } catch (err) {
      setTicketError('Connection failed. Please check backend status.');
    } finally {
      setSubmittingTicket(false);
    }
  };

  // Helper to extract active products for ticketing dropdown
  const getActiveProducts = () => {
    const list = [];
    orders.forEach((order) => {
      // Allow raising tickets for Active or Pending Delivery rentals
      if (['Active', 'Pending Delivery'].includes(order.status)) {
        order.items.forEach((item) => {
          if (item.product) {
            list.push({
              id: `${order._id}|${item.product._id}`,
              name: `${item.product.name} (Order: ${order._id.substring(18)})`,
            });
          }
        });
      }
    });
    return list;
  };

  const activeProducts = getActiveProducts();

  return (
    <div className="container" style={{ padding: '30px 24px', minHeight: '80vh' }}>
      
      {/* 1. Portal Header */}
      <div className="glass flex-between" style={{
        padding: '30px 40px',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div>
          <span className="badge badge-success" style={{ marginBottom: '8px' }}>Active Account</span>
          <h1 style={{ fontFamily: 'var(--font-secondary)', fontSize: '2rem', fontWeight: 800 }}>
            Hello, {user?.name}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Manage your furniture rentals, schedule relocation support, or report damages.
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Registered Email</span>
          <span style={{ display: 'block', fontWeight: 600 }}>{user?.email}</span>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '12px',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '16px',
        marginBottom: '32px',
      }}>
        <button
          onClick={() => setActiveTab('rentals')}
          className={`btn ${activeTab === 'rentals' ? 'btn-primary' : 'btn-outline'}`}
        >
          🛋️ My Active Rentals
        </button>
        <button
          onClick={() => setActiveTab('tickets')}
          className={`btn ${activeTab === 'tickets' ? 'btn-primary' : 'btn-outline'}`}
        >
          🛠️ Service & Support Tickets
        </button>
      </div>

      {/* 3. Tab Contents */}
      {activeTab === 'rentals' ? (
        // Rentals Tab
        <div>
          {loadingOrders ? (
            <div className="shimmer-box" style={{ height: '180px', width: '100%' }}> </div>
          ) : orders.length === 0 ? (
            <div className="glass flex-center" style={{ padding: '60px', flexDirection: 'column', textAlign: 'center', gap: '16px' }}>
              <span style={{ fontSize: '3rem' }}>🛋️</span>
              <h3>No Active Rentals</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>
                You have not placed any rental orders yet. Let's make your home cozy today!
              </p>
              <button onClick={() => navigate('/catalog')} className="btn btn-primary">
                Browse Rental Catalog
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {orders.map((order) => (
                <div 
                  key={order._id} 
                  className="glass" 
                  style={{
                    padding: '28px',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  {/* Order header summary */}
                  <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ORDER ID</span>
                      <span style={{ display: 'block', fontWeight: 700, fontSize: '0.95rem' }}>{order._id}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>DELIVERY SCHEDULE</span>
                      <span style={{ display: 'block', fontWeight: 600 }}>
                        {new Date(order.deliveryDate).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', textAlign: 'right' }}>MONTHLY RENT</span>
                      <span style={{ fontWeight: 800, color: 'var(--color-secondary)' }}>₹{order.totalMonthlyRent}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', textAlign: 'right' }}>STATUS</span>
                      <span className={`badge ${
                        order.status === 'Active' 
                          ? 'badge-success' 
                          : order.status === 'Pending Delivery' 
                            ? 'badge-warning' 
                            : 'badge-danger'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Order items lists */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                        {item.product && (
                          <div style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: '#1e293b' }}>
                            <img src={item.product.images[0]} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        )}
                        <div style={{ flexGrow: 1 }}>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                            {item.product ? item.product.name : 'Unknown Product'}
                          </h4>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            Tenure: {item.tenure} Months • Qty: {item.quantity}
                          </span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Deposit</span>
                          <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600 }}>₹{item.securityDeposit * item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Raise quick ticket link */}
                  {['Active', 'Pending Delivery'].includes(order.status) && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                      <button
                        onClick={() => {
                          setActiveTab('tickets');
                          // Pre-select first item
                          if (order.items.length > 0 && order.items[0].product) {
                            setSelectedOrderItem(`${order._id}|${order.items[0].product._id}`);
                          }
                        }}
                        className="btn btn-outline btn-sm"
                      >
                        🔧 Report Issue / Setup Support
                      </button>
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        // Support Tickets Tab
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
          
          {/* Left Column: Raise Ticket Form */}
          <div style={{ flex: '1 1 360px' }}>
            <form onSubmit={handleRaiseTicket} className="glass" style={{
              padding: '30px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}> Raise Support Ticket</h3>
              
              {ticketSuccess && (
                <div className="badge badge-success" style={{ padding: '10px', textTransform: 'none', textAlign: 'center', width: '100%' }}>
                  {ticketSuccess}
                </div>
              )}
              {ticketError && (
                <div className="badge badge-danger" style={{ padding: '10px', textTransform: 'none', textAlign: 'center', width: '100%' }}>
                  {ticketError}
                </div>
              )}

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Select Active Product</label>
                <select
                  className="form-control"
                  value={selectedOrderItem}
                  onChange={(e) => setSelectedOrderItem(e.target.value)}
                  required
                >
                  <option value="">-- Choose Product --</option>
                  {activeProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Issue Category</label>
                <select
                  className="form-control"
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                >
                  <option value="Repair & Maintenance">Repair & Maintenance (Functionality/Clean)</option>
                  <option value="Damage Claim">Damage Claim / Servicing</option>
                  <option value="Relocation Support">Relocation Support (Transport)</option>
                  <option value="Return Request">Return Request (Pickup)</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Details / Notes</label>
                <textarea
                  className="form-control"
                  placeholder="Describe your issue or relocation dates..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%' }}
                disabled={submittingTicket || activeProducts.length === 0}
              >
                {submittingTicket ? 'Submitting...' : 'Submit Support Request'}
              </button>
            </form>
          </div>

          {/* Right Column: Ticket Lists */}
          <div style={{ flex: '2 1 500px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Ticket History</h3>
            
            {loadingTickets ? (
              <div className="shimmer-box" style={{ height: '100px', width: '100%' }}> </div>
            ) : tickets.length === 0 ? (
              <div className="glass flex-center" style={{ padding: '40px', flexDirection: 'column', gap: '10px' }}>
                <span>🛡️</span>
                <h4>No tickets raised</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  If you experience any issues, raise a ticket here for free assistance.
                </p>
              </div>
            ) : (
              tickets.map((t) => (
                <div 
                  key={t._id}
                  className="glass"
                  style={{
                    padding: '20px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <div className="flex-between">
                    <span className="badge badge-info">{t.issueType}</span>
                    <span className={`badge ${
                      t.status === 'Resolved' 
                        ? 'badge-success' 
                        : t.status === 'In Progress' 
                          ? 'badge-warning' 
                          : 'badge-danger'
                    }`}>
                      {t.status}
                    </span>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>
                      Product: {t.product ? t.product.name : 'Unknown Product'}
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      "{t.description}"
                    </p>
                  </div>

                  {t.scheduledDate && (
                    <div style={{
                      marginTop: '8px',
                      background: 'rgba(99,102,241,0.06)',
                      borderLeft: '4px solid var(--color-primary)',
                      padding: '8px 16px',
                      fontSize: '0.85rem',
                      borderRadius: 'var(--radius-sm)',
                    }}>
                      🛠️ <b>Technician Scheduled:</b> {new Date(t.scheduledDate).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </div>
                  )}

                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Ticket Raised: {new Date(t.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>

        </div>
      )}

    </div>
  );
};

export default UserPortal;
