import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminPortal = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if not admin
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    if (user && user.role !== 'admin') {
      navigate('/portal');
    }
  }, [token, user, navigate]);

  // Tab control: 'stats', 'products', 'orders', 'tickets', 'cities'
  const [activeTab, setActiveTab] = useState('stats');

  // Core data states
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  // New product form state
  const [prodName, setProdName] = useState('');
  const [prodCat, setProdCat] = useState('Furniture');
  const [prodSub, setProdSub] = useState('Bed');
  const [prodDesc, setProdDesc] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodBaseRent, setProdBaseRent] = useState('');
  const [prodDeposit, setProdDeposit] = useState('');
  const [prodInventory, setProdInventory] = useState('5');
  const [prodCities, setProdCities] = useState('Bangalore, Mumbai, Delhi, Pune, Chennai');
  const [prodSuccess, setProdSuccess] = useState('');
  const [prodError, setProdError] = useState('');

  // Service ticket scheduling state
  const [schedulingTicketId, setSchedulingTicketId] = useState('');
  const [scheduleDateStr, setScheduleDateStr] = useState('');
  const [scheduleStatus, setScheduleStatus] = useState('In Progress');

  // New City form state
  const [newCityName, setNewCityName] = useState('');
  const [citySuccess, setCitySuccess] = useState('');
  const [cityError, setCityError] = useState('');

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      // Products
      const prodRes = await fetch('http://localhost:5000/api/products');
      const prodData = await prodRes.json();
      if (prodData.success) setProducts(prodData.data);

      // Orders
      const orderRes = await fetch('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const orderData = await orderRes.json();
      if (orderData.success) setOrders(orderData.data);

      // Tickets
      const ticketRes = await fetch('http://localhost:5000/api/maintenance', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const ticketData = await ticketRes.json();
      if (ticketData.success) setTickets(ticketData.data);

      // Cities
      const cityRes = await fetch('http://localhost:5000/api/cities');
      const cityData = await cityRes.json();
      if (cityData.success) setCities(cityData.data);

    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // Handle order status update
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (data.success) {
        alert('Order status updated successfully.');
        fetchData(); // Refresh list
      }
    } catch (err) {
      alert('Failed to update order status.');
    }
  };

  // Handle scheduling technician visit
  const handleScheduleTicket = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/maintenance/${schedulingTicketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status: scheduleStatus,
          scheduledDate: scheduleDateStr ? new Date(scheduleDateStr) : undefined
        })
      });
      const data = await response.json();
      if (data.success) {
        alert('Ticket schedule successfully updated!');
        setSchedulingTicketId('');
        setScheduleDateStr('');
        fetchData();
      }
    } catch (err) {
      alert('Failed to update support ticket.');
    }
  };

  // Handle adding a new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setProdError('');
    setProdSuccess('');

    if (!prodName || !prodDesc || !prodImage || !prodBaseRent || !prodDeposit) {
      setProdError('Please fill in all required fields');
      return;
    }

    try {
      const cityList = prodCities.split(',').map(c => c.trim());
      
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: prodName,
          category: prodCat,
          subcategory: prodSub,
          description: prodDesc,
          images: [prodImage],
          baseRent: Number(prodBaseRent),
          deposit: Number(prodDeposit),
          inventory: Number(prodInventory),
          citiesAvailable: cityList,
        })
      });

      const data = await response.json();
      if (data.success) {
        setProdSuccess('Product created successfully!');
        setProdName('');
        setProdDesc('');
        setProdImage('');
        setProdBaseRent('');
        setProdDeposit('');
        fetchData();
      } else {
        setProdError(data.message || 'Failed to create product.');
      }
    } catch (err) {
      setProdError('Connection failed.');
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async (prodId) => {
    if (!window.confirm('Are you sure you want to remove this product from inventory?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/products/${prodId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        alert('Product deleted.');
        fetchData();
      }
    } catch (err) {
      alert('Failed to delete product.');
    }
  };

  // Handle adding service city
  const handleAddCity = async (e) => {
    e.preventDefault();
    setCityError('');
    setCitySuccess('');

    if (!newCityName) return;

    try {
      const response = await fetch('http://localhost:5000/api/cities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: newCityName })
      });
      const data = await response.json();

      if (data.success) {
        setCitySuccess('Service city added successfully!');
        setNewCityName('');
        fetchData();
      } else {
        setCityError(data.message || 'Failed to add city.');
      }
    } catch (err) {
      setCityError('Connection failed.');
    }
  };

  // Computations for Analytics Panel
  const calculateStats = () => {
    const activeOrders = orders.filter(o => o.status === 'Active');
    const mrr = activeOrders.reduce((acc, o) => acc + o.totalMonthlyRent, 0);
    const activeRentalsCount = activeOrders.length;
    
    // Utilization
    let totalStock = 0;
    let activeLeases = 0;
    products.forEach(p => {
      totalStock += p.inventory + (p.rentedCount || 0);
      activeLeases += p.rentedCount || 0;
    });
    const utilization = totalStock > 0 ? ((activeLeases / totalStock) * 100).toFixed(1) : '0';

    // Tickets
    const pendingTickets = tickets.filter(t => t.status === 'Pending').length;
    const progressTickets = tickets.filter(t => t.status === 'In Progress').length;
    const resolvedTickets = tickets.filter(t => t.status === 'Resolved').length;

    return { mrr, activeRentalsCount, utilization, pendingTickets, progressTickets, resolvedTickets };
  };

  const stats = calculateStats();

  return (
    <div className="container" style={{ padding: '30px 24px', minHeight: '85vh' }}>
      
      {/* Portal Title Banner */}
      <div className="glass flex-between" style={{
        padding: '30px 40px',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '32px',
        border: '1px solid var(--border-glow)',
      }}>
        <div>
          <span className="badge badge-danger" style={{ marginBottom: '8px' }}>Platform Admin</span>
          <h1 style={{ fontFamily: 'var(--font-secondary)', fontSize: '2rem', fontWeight: 800 }}>
            Platform Administrative Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Set product pricing, coordinate delivery schedules, process maintenance, and view business analytics.
          </p>
        </div>
      </div>

      {/* Tabs list */}
      <div style={{
        display: 'flex',
        gap: '12px',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '16px',
        marginBottom: '32px',
        overflowX: 'auto',
      }}>
        <button onClick={() => setActiveTab('stats')} className={`btn ${activeTab === 'stats' ? 'btn-primary' : 'btn-outline'}`}>📈 Analytics</button>
        <button onClick={() => setActiveTab('products')} className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-outline'}`}>🛋️ Inventory</button>
        <button onClick={() => setActiveTab('orders')} className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-outline'}`}>🚚 Leases / Orders</button>
        <button onClick={() => setActiveTab('tickets')} className={`btn ${activeTab === 'tickets' ? 'btn-primary' : 'btn-outline'}`}>🛠️ Tickets ({stats.pendingTickets})</button>
        <button onClick={() => setActiveTab('cities')} className={`btn ${activeTab === 'cities' ? 'btn-primary' : 'btn-outline'}`}>📍 Cities</button>
      </div>

      {loading ? (
        <div className="shimmer-box" style={{ height: '300px', width: '100%' }}> </div>
      ) : (
        <>
          
          {/* Tab 1: Stats */}
          {activeTab === 'stats' && (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              {/* Widgets Row */}
              <div className="grid-4">
                <div className="glass" style={{ padding: '24px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>MONTHLY RECURRING REVENUE</span>
                  <h2 style={{ fontSize: '2.2rem', color: 'var(--color-secondary)', fontWeight: 800 }}>₹{stats.mrr}</h2>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>from all active rental contracts</span>
                </div>
                <div className="glass" style={{ padding: '24px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ACTIVE LEASES</span>
                  <h2 style={{ fontSize: '2.2rem', color: 'var(--color-primary)', fontWeight: 800 }}>{stats.activeRentalsCount}</h2>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>deliveries completed & active</span>
                </div>
                <div className="glass" style={{ padding: '24px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>STOCK UTILIZATION RATE</span>
                  <h2 style={{ fontSize: '2.2rem', color: 'var(--color-success)', fontWeight: 800 }}>{stats.utilization}%</h2>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>percentage of inventory rented</span>
                </div>
                <div className="glass" style={{ padding: '24px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>PENDING ISSUES</span>
                  <h2 style={{ fontSize: '2.2rem', color: 'var(--color-danger)', fontWeight: 800 }}>{stats.pendingTickets}</h2>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>awaiting technician assignments</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Inventory / Products */}
          {activeTab === 'products' && (
            <div className="fade-in" style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
              {/* Left Column: Form */}
              <div style={{ flex: '1 1 360px' }}>
                <form onSubmit={handleAddProduct} className="glass" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Add New Product</h3>
                  
                  {prodSuccess && <div className="badge badge-success" style={{ padding: '10px', textTransform: 'none', textAlign: 'center' }}>{prodSuccess}</div>}
                  {prodError && <div className="badge badge-danger" style={{ padding: '10px', textTransform: 'none', textAlign: 'center' }}>{prodError}</div>}

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Product Name</label>
                    <input type="text" className="form-control" placeholder="e.g. Queen Memory Foam Mattress" value={prodName} onChange={(e) => setProdName(e.target.value)} required />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Category</label>
                    <select className="form-control" value={prodCat} onChange={(e) => { setProdCat(e.target.value); setProdSub(e.target.value === 'Furniture' ? 'Bed' : 'Fridge'); }}>
                      <option value="Furniture">Furniture</option>
                      <option value="Appliances">Appliances</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Subcategory</label>
                    <select className="form-control" value={prodSub} onChange={(e) => setProdSub(e.target.value)}>
                      {prodCat === 'Furniture' ? (
                        <>
                          <option value="Bed">Bed</option><option value="Sofa">Sofa</option><option value="Table">Table</option><option value="Chair">Chair</option>
                        </>
                      ) : (
                        <>
                          <option value="Fridge">Fridge</option><option value="Washing Machine">Washing Machine</option><option value="TV">TV</option><option value="Microwave">Microwave</option><option value="Air Conditioner">Air Conditioner</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Description</label>
                    <textarea className="form-control" placeholder="Brief technical and design spec..." value={prodDesc} onChange={(e) => setProdDesc(e.target.value)} rows={3} required />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Image URL</label>
                    <input type="url" className="form-control" placeholder="https://unsplash.com/..." value={prodImage} onChange={(e) => setProdImage(e.target.value)} required />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Base Monthly Rent (₹)</label>
                    <input type="number" className="form-control" placeholder="800" value={prodBaseRent} onChange={(e) => setProdBaseRent(e.target.value)} required />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Refundable Deposit (₹)</label>
                    <input type="number" className="form-control" placeholder="1600" value={prodDeposit} onChange={(e) => setProdDeposit(e.target.value)} required />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Inventory Count</label>
                    <input type="number" className="form-control" value={prodInventory} onChange={(e) => setProdInventory(e.target.value)} required />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Available Cities (comma separated)</label>
                    <input type="text" className="form-control" placeholder="Bangalore, Mumbai, Chennai" value={prodCities} onChange={(e) => setProdCities(e.target.value)} required />
                  </div>

                  <button type="submit" className="btn btn-primary">Create Inventory Listing</button>
                </form>
              </div>

              {/* Right Column: Listing */}
              <div style={{ flex: '2 1 500px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Active Inventory</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '700px', overflowY: 'auto' }}>
                  {products.map(prod => (
                    <div key={prod._id} className="glass flex-between" style={{ padding: '16px 20px', borderRadius: 'var(--radius-md)', flexWrap: 'wrap', gap: '16px' }}>
                      <div className="flex-gap">
                        <img src={prod.images[0]} alt={prod.name} style={{ width: '48px', height: '48px', borderRadius: '4px', objectFit: 'cover' }} />
                        <div>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{prod.category} ({prod.subcategory})</span>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{prod.name}</h4>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Stock: {prod.inventory} | Rented: {prod.rentedCount || 0}</span>
                        </div>
                      </div>
                      <div className="flex-gap">
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ display: 'block', fontWeight: 700, color: 'var(--color-secondary)' }}>₹{prod.baseRent}/mo</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Deposit: ₹{prod.deposit}</span>
                        </div>
                        <button onClick={() => handleDeleteProduct(prod._id)} className="btn btn-danger btn-sm" style={{ padding: '6px' }}>🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Leases / Orders */}
          {activeTab === 'orders' && (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>All Leases & Contracts</h3>
              {orders.length === 0 ? (
                <div className="glass flex-center" style={{ padding: '40px' }}><p>No orders placed yet.</p></div>
              ) : (
                orders.map(order => (
                  <div key={order._id} className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-md)' }}>
                    <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ORDER ID & CUSTOMER</span>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{order._id} ({order.user?.name || 'Guest'})</h4>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>DELIVERY CITY & ADDRESS</span>
                        <span style={{ display: 'block', fontSize: '0.9rem' }}>{order.deliveryCity} - {order.deliveryAddress}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>STATUS</span>
                        <select 
                          value={order.status} 
                          onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                          className="form-control"
                          style={{ padding: '6px 12px', fontSize: '0.85rem', width: '160px', marginTop: '4px' }}
                        >
                          <option value="Pending Delivery">Pending Delivery</option>
                          <option value="Active">Active</option>
                          <option value="Returned">Returned</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    {/* Order products */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex-between" style={{ fontSize: '0.9rem' }}>
                          <span>{item.product ? item.product.name : 'Unknown Product'} (Qty: {item.quantity} • Tenure: {item.tenure} mo)</span>
                          <span style={{ fontWeight: 600 }}>Rent: ₹{item.monthlyRent * item.quantity}/mo</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 4: Tickets */}
          {activeTab === 'tickets' && (
            <div className="fade-in" style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
              
              {/* Left Column: Tickets list */}
              <div style={{ flex: '2 1 500px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Maintenance & Return Requests</h3>
                
                {tickets.length === 0 ? (
                  <div className="glass flex-center" style={{ padding: '40px' }}><p>No tickets raised yet.</p></div>
                ) : (
                  tickets.map(ticket => (
                    <div key={ticket._id} className="glass" style={{ padding: '20px', borderRadius: 'var(--radius-md)' }}>
                      <div className="flex-between">
                        <span className="badge badge-info">{ticket.issueType}</span>
                        <span className={`badge ${
                          ticket.status === 'Resolved' ? 'badge-success' : ticket.status === 'In Progress' ? 'badge-warning' : 'badge-danger'
                        }`}>{ticket.status}</span>
                      </div>
                      
                      <div style={{ margin: '12px 0' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Customer: {ticket.user?.name} ({ticket.user?.email})</span>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, marginTop: '4px' }}>Product: {ticket.product?.name}</h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>"{ticket.description}"</p>
                      </div>

                      {ticket.scheduledDate && (
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 12px', fontSize: '0.8rem', borderRadius: '4px', marginBottom: '10px' }}>
                          📅 Scheduled visit: {new Date(ticket.scheduledDate).toLocaleString()}
                        </div>
                      )}

                      <button 
                        onClick={() => { setSchedulingTicketId(ticket._id); setScheduleStatus(ticket.status); }} 
                        className="btn btn-outline btn-sm"
                      >
                        ⚙️ Update / Schedule Technician
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Right Column: Schedule Panel */}
              {schedulingTicketId && (
                <div style={{ flex: '1 1 300px' }}>
                  <form onSubmit={handleScheduleTicket} className="glass" style={{ padding: '24px', position: 'sticky', top: '110px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Schedule Technician Visit</h3>
                    
                    <div className="form-group">
                      <label className="form-label">Technician Status</label>
                      <select className="form-control" value={scheduleStatus} onChange={(e) => setScheduleStatus(e.target.value)}>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Visit Date & Time</label>
                      <input type="datetime-local" className="form-control" value={scheduleDateStr} onChange={(e) => setScheduleDateStr(e.target.value)} required />
                    </div>

                    <div className="flex-gap" style={{ marginTop: '10px' }}>
                      <button type="submit" className="btn btn-primary btn-sm" style={{ flex: 1 }}>Save Schedule</button>
                      <button type="button" onClick={() => setSchedulingTicketId('')} className="btn btn-outline btn-sm" style={{ flex: 1 }}>Cancel</button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          )}

          {/* Tab 5: Cities */}
          {activeTab === 'cities' && (
            <div className="fade-in" style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
              {/* Form */}
              <div style={{ flex: '1 1 300px' }}>
                <form onSubmit={handleAddCity} className="glass" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Add Service Area</h3>
                  
                  {citySuccess && <div className="badge badge-success" style={{ padding: '8px', textTransform: 'none', textAlign: 'center', width: '100%', marginBottom: '12px' }}>{citySuccess}</div>}
                  {cityError && <div className="badge badge-danger" style={{ padding: '8px', textTransform: 'none', textAlign: 'center', width: '100%', marginBottom: '12px' }}>{cityError}</div>}

                  <div className="form-group">
                    <label className="form-label">City Name</label>
                    <input type="text" className="form-control" placeholder="e.g. Hyderabad" value={newCityName} onChange={(e) => setNewCityName(e.target.value)} required />
                  </div>
                  
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Add Active City</button>
                </form>
              </div>

              {/* List */}
              <div style={{ flex: '2 1 400px' }}>
                <div className="glass" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Active Service Cities</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {cities.map(c => (
                      <span key={c._id} className="badge badge-info" style={{ padding: '10px 16px', fontSize: '0.9rem', borderRadius: 'var(--radius-md)' }}>
                        📍 {c.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </>
      )}

    </div>
  );
};

export default AdminPortal;
