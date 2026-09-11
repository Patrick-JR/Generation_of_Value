import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Calendar, ShoppingBag, Settings, LogOut,
  Plus, Trash2, Edit, X, Search,
  TrendingUp, DollarSign, UserPlus, Bell, Mail, Phone,
  Image, Key, ShoppingCart, Clock, Activity, MapPin
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import './Admin.css';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [token] = useState(sessionStorage.getItem('gov_admin_token'));
  const [dashboardData, setDashboardData] = useState(null);
  
  // Data states
  const [memberships, setMemberships] = useState([]);
  const [events, setEvents] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [settings, setSettings] = useState({});
  const [carouselSlides, setCarouselSlides] = useState([]);

  // Fetch data based on active tab
  const fetchData = useCallback(async () => {
    if (!token) return;
    
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      
      switch (activeTab) {
        case 'dashboard':
          const statsRes = await fetch(`${API_URL}/dashboard/stats`, { headers });
          const statsData = await statsRes.json();
          setDashboardData(statsData);
          break;
        case 'memberships':
          const memRes = await fetch(`${API_URL}/memberships`, { headers });
          const memData = await memRes.json();
          setMemberships(Array.isArray(memData) ? memData : (memData.memberships || []));
          break;
        case 'events':
          const evRes = await fetch(`${API_URL}/events`, { headers });
          const evData = await evRes.json();
          setEvents(Array.isArray(evData) ? evData : (evData.events || []));
          break;
        case 'shop':
          const prodRes = await fetch(`${API_URL}/products`, { headers });
          const prodData = await prodRes.json();
          setProducts(Array.isArray(prodData) ? prodData : (prodData.products || []));
          const ordRes = await fetch(`${API_URL}/orders`, { headers });
          const ordData = await ordRes.json();
          setOrders(Array.isArray(ordData) ? ordData : (ordData.orders || []));
          break;
        case 'settings':
          const setRes = await fetch(`${API_URL}/settings`, { headers });
          const setData = await setRes.json();
          setSettings(setData.settings || setData || {});
          const carRes = await fetch(`${API_URL}/carousel`, { headers });
          const carData = await carRes.json();
          setCarouselSlides(Array.isArray(carData) ? carData : (carData.slides || []));
          break;
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = () => {
    sessionStorage.removeItem('gov_admin_token');
    navigate('/');
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'memberships', label: 'Memberships', icon: Users },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'shop', label: 'Shop', icon: ShoppingBag },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="admin-logo">
            <span className="logo-icon">G</span>
            <div className="logo-text">
              <span className="logo-main">GOV</span>
              <span className="logo-sub">Admin Panel</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={20} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {activeTab === 'dashboard' && <DashboardTab data={dashboardData} />}
        {activeTab === 'memberships' && <MembershipsTab memberships={memberships} token={token} refresh={fetchData} />}
        {activeTab === 'events' && <EventsTab events={events} token={token} refresh={fetchData} />}
        {activeTab === 'shop' && <ShopTab products={products} orders={orders} token={token} refresh={fetchData} />}
        {activeTab === 'settings' && <SettingsTab settings={settings} slides={carouselSlides} token={token} refresh={fetchData} />}
      </main>
    </div>
  );
};

// Dashboard Tab Component
const DashboardTab = ({ data }) => {
  if (!data) return <div>Loading...</div>;

  const membershipChartData = data.membershipByMonth.map(m => ({
    month: m.month.split('-')[1],
    count: m.count
  }));

  const revenueChartData = data.ordersByMonth.map(m => ({
    month: m.month.split('-')[1],
    revenue: m.revenue || 0
  }));

  return (
    <motion.div
      className="dashboard-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="dashboard-header">
        <div>
          <h1>Dashboard Overview</h1>
          <p>Welcome back! Here's what's happening with GOV.</p>
        </div>
        <div className="header-date">
          <Clock size={16} />
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8860B)' }}>
            <Users size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{data.stats?.memberships || 0}</span>
            <span className="stat-label">Total Members</span>
            <span className="stat-change positive">+12 this week</span>
          </div>
        </motion.div>

        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            <DollarSign size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">K{data.stats?.totalRevenue?.toLocaleString() || 0}</span>
            <span className="stat-label">Total Revenue</span>
            <span className="stat-change positive">+5 orders</span>
          </div>
        </motion.div>

        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
            <ShoppingBag size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{data.stats?.products || 0}</span>
            <span className="stat-label">Products</span>
            <span className="stat-change">In shop</span>
          </div>
        </motion.div>

        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}>
            <Calendar size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{data.stats?.events || 0}</span>
            <span className="stat-label">Active Events</span>
            <span className="stat-change">3 upcoming</span>
          </div>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        <motion.div
          className="chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="chart-header">
            <h3><TrendingUp size={20} /> Membership Growth</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={membershipChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#D4AF37" strokeWidth={3} dot={{ fill: '#D4AF37' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          className="chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="chart-header">
            <h3><DollarSign size={20} /> Revenue Trend</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="revenue" fill="#D4AF37" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="bottom-row">
        <motion.div
          className="recent-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="card-header">
            <h3><UserPlus size={20} /> Recent Memberships</h3>
            <span className="badge">{data.recentMemberships?.length || 0} new</span>
          </div>
          <div className="recent-list">
            {data.recentMemberships?.slice(0, 5).map((m, i) => (
              <div key={i} className="recent-item">
                <div className="recent-avatar">
                  {(m.full_name || m.name || 'M').charAt(0)}
                </div>
                <div className="recent-info">
                  <span className="recent-name">{m.full_name || m.name}</span>
                  <span className="recent-meta">{m.email} • {m.location || 'Lusaka'}</span>
                </div>
                <span className={`status-badge ${m.status}`}>{m.status}</span>
              </div>
            ))}
            {(!data.recentMemberships || data.recentMemberships.length === 0) && (
              <p className="no-data">No recent memberships</p>
            )}
          </div>
        </motion.div>

        <motion.div
          className="popular-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <div className="card-header">
            <h3><TrendingUp size={20} /> Popular Products</h3>
          </div>
          <div className="popular-list">
            {data.popularProducts?.map((p, i) => (
              <div key={i} className="popular-item">
                <span className="rank">#{i + 1}</span>
                <span className="popular-name">{p.name}</span>
                <span className="popular-sales">{p.order_count || 0} orders</span>
              </div>
            ))}
            {(!data.popularProducts || data.popularProducts.length === 0) && (
              <p className="no-data">No order data yet</p>
            )}
          </div>
        </motion.div>

        <motion.div
          className="quick-actions-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="card-header">
            <h3><Activity size={20} /> Quick Actions</h3>
          </div>
          <div className="quick-actions">
            <button className="quick-action"><Plus size={18} /> Add Event</button>
            <button className="quick-action"><Plus size={18} /> Add Product</button>
            <button className="quick-action"><Mail size={18} /> Send Newsletter</button>
            <button className="quick-action"><Bell size={18} /> Push Notification</button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Memberships Tab Component
const MembershipsTab = ({ memberships, token, refresh }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredMemberships = memberships.filter(m => {
    const matchesSearch = m.full_name.toLowerCase().includes(search.toLowerCase()) ||
                          m.email?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || m.status === filter;
    return matchesSearch && matchesFilter;
  });

  const updateStatus = async (id, status) => {
    try {
      await fetch(`${API_URL}/memberships/${id}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      refresh();
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  const deleteMembership = async (id) => {
    if (window.confirm('Delete this membership?')) {
      try {
        await fetch(`${API_URL}/memberships/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        refresh();
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  return (
    <motion.div
      className="tab-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="tab-header">
        <div>
          <h1>Membership Management</h1>
          <p>View and manage membership applications</p>
        </div>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="contacted">Contacted</option>
        </select>
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Age</th>
              <th>Location</th>
              <th>Ministry</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMemberships.map((m) => (
              <tr key={m.id}>
                <td className="name-cell">{m.full_name}</td>
                <td>{m.email}</td>
                <td>{m.phone}</td>
                <td>{m.age_range}</td>
                <td>{m.location}</td>
                <td>{m.ministry_interest || '-'}</td>
                <td>
                  <span className={`status-badge ${m.status}`}>{m.status}</span>
                </td>
                <td>{new Date(m.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <select
                      value={m.status}
                      onChange={(e) => updateStatus(m.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="contacted">Contacted</option>
                    </select>
                    <button className="icon-btn danger" onClick={() => deleteMembership(m.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredMemberships.length === 0 && (
          <div className="empty-state">
            <Users size={48} />
            <h3>No memberships found</h3>
            <p>Membership submissions will appear here</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Events Tab Component
const EventsTab = ({ events, token, refresh }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '', date: '', time: '', location: '', description: '', category: 'Special', highlight: false
  });

  const openModal = (event = null) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title,
        date: event.date,
        time: event.time,
        location: event.location,
        description: event.description,
        category: event.category,
        highlight: !!event.highlight
      });
    } else {
      setEditingEvent(null);
      setFormData({ title: '', date: '', time: '', location: '', description: '', category: 'Special', highlight: false });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingEvent
        ? `${API_URL}/events/${editingEvent.id}`
        : `${API_URL}/events`;
      const method = editingEvent ? 'PUT' : 'POST';
      
      await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setShowModal(false);
      refresh();
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const deleteEvent = async (id) => {
    if (window.confirm('Delete this event?')) {
      try {
        await fetch(`${API_URL}/events/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        refresh();
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  return (
    <motion.div
      className="tab-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="tab-header">
        <div>
          <h1>Events Management</h1>
          <p>Create and manage church events</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <Plus size={18} /> Add Event
        </button>
      </div>

      <div className="cards-grid">
        {events.map((event) => (
          <div key={event.id} className={`event-card ${event.highlight ? 'highlight' : ''}`}>
            {event.highlight && <div className="highlight-badge">Featured</div>}
            <div className="event-content">
              <h3>{event.title}</h3>
              <p className="event-date"><Calendar size={14} /> {event.date}</p>
              <p className="event-time"><Clock size={14} /> {event.time}</p>
              <p className="event-location"><MapPin size={14} /> {event.location}</p>
              <p className="event-desc">{event.description}</p>
              <span className="category-badge">{event.category}</span>
            </div>
            <div className="event-actions">
              <button className="icon-btn" onClick={() => openModal(event)}><Edit size={16} /></button>
              <button className="icon-btn danger" onClick={() => deleteEvent(event.id)}><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>{editingEvent ? 'Edit Event' : 'Add New Event'}</h2>
                <button className="close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Event Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Special">Special</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Annual">Annual</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Date *</label>
                    <input
                      type="text"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      placeholder="e.g., September 6, 2026"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Time *</label>
                    <input
                      type="text"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      placeholder="e.g., 08:00 to 13:00"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Event location"
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="form-group checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.highlight}
                      onChange={(e) => setFormData({ ...formData, highlight: e.target.checked })}
                    />
                    Highlight as featured event
                  </label>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingEvent ? 'Update Event' : 'Create Event'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Shop Tab Component
const ShopTab = ({ products, orders, token, refresh }) => {
  const [activeSection, setActiveSection] = useState('products');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', colors: '', sizes: '', image: 'tshirt'
  });

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        colors: product.colors,
        sizes: product.sizes,
        image: product.image
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: '', colors: '', sizes: '', image: 'tshirt' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingProduct
        ? `${API_URL}/products/${editingProduct.id}`
        : `${API_URL}/products`;
      const method = editingProduct ? 'PUT' : 'POST';
      
      await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setShowModal(false);
      refresh();
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Delete this product?')) {
      try {
        await fetch(`${API_URL}/products/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        refresh();
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  return (
    <motion.div
      className="tab-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="tab-header">
        <div>
          <h1>Shop Management</h1>
          <p>Manage products and orders</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="section-tabs">
        <button
          className={`section-tab ${activeSection === 'products' ? 'active' : ''}`}
          onClick={() => setActiveSection('products')}
        >
          <ShoppingBag size={18} /> Products ({products.length})
        </button>
        <button
          className={`section-tab ${activeSection === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveSection('orders')}
        >
          <ShoppingCart size={18} /> Orders ({orders.length})
        </button>
      </div>

      {activeSection === 'products' && (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className={`product-placeholder ${product.image}`}>
                <ShoppingBag size={32} />
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="price">K{product.price}</p>
                <p className="desc">{product.description}</p>
              </div>
              <div className="product-actions">
                <button className="icon-btn" onClick={() => openModal(product)}><Edit size={16} /></button>
                <button className="icon-btn danger" onClick={() => deleteProduct(product.id)}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSection === 'orders' && (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.customer_name}</td>
                  <td>{order.customer_phone}</td>
                  <td className="items-cell">
                    {JSON.parse(order.items || '[]').map((item, i) => (
                      <span key={i} className="item-tag">{item.name} x{item.quantity}</span>
                    ))}
                  </td>
                  <td>K{order.total_amount}</td>
                  <td><span className={`status-badge ${order.status}`}>{order.status}</span></td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="empty-state">
              <ShoppingCart size={48} />
              <h3>No orders yet</h3>
              <p>Orders will appear here when customers make purchases</p>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <button className="close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Price (K) *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Image Type</label>
                    <select value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })}>
                      <option value="tshirt">T-Shirt</option>
                      <option value="hoodie">Hoodie</option>
                      <option value="pouch">Phone Pouch</option>
                      <option value="skin">Laptop Skin</option>
                      <option value="cap">Cap</option>
                      <option value="wristband">Wristband</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Colors (comma separated)</label>
                    <input
                      type="text"
                      value={formData.colors}
                      onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                      placeholder="Black,White,Gold"
                    />
                  </div>
                  <div className="form-group">
                    <label>Sizes (comma separated)</label>
                    <input
                      type="text"
                      value={formData.sizes}
                      onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                      placeholder="S,M,L,XL"
                    />
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Settings Tab Component
const SettingsTab = ({ settings, slides, token }) => {
  const [formData, setFormData] = useState({
    word_of_year: settings?.word_of_year || '',
    mission: settings?.mission || '',
    church_name: settings?.church_name || '',
    email: settings?.email || '',
    phone: settings?.phone || '',
    address: settings?.address || '',
    service_time: settings?.service_time || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/settings`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  return (
    <motion.div
      className="tab-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="tab-header">
        <div>
          <h1>Settings</h1>
          <p>Manage website content and configurations</p>
        </div>
      </div>

      <div className="settings-grid">
        <div className="settings-card">
          <h3><Key size={20} /> Content Settings</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Word of the Year</label>
              <input
                type="text"
                value={formData.word_of_year}
                onChange={(e) => setFormData({ ...formData, word_of_year: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Mission Statement</label>
              <input
                type="text"
                value={formData.mission}
                onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Church Name</label>
              <input
                type="text"
                value={formData.church_name}
                onChange={(e) => setFormData({ ...formData, church_name: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Save Settings
            </button>
          </form>
        </div>

        <div className="settings-card">
          <h3><Phone size={20} /> Contact Information</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Service Time</label>
              <input
                type="text"
                value={formData.service_time}
                onChange={(e) => setFormData({ ...formData, service_time: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Update Contact
            </button>
          </form>
        </div>

        <div className="settings-card">
          <h3><Image size={20} /> Carousel Slides</h3>
          <div className="slides-list">
            {slides.map((slide) => (
              <div key={slide.id} className="slide-item">
                <div className="slide-info">
                  <span className="slide-title">{slide.title}</span>
                  <span className="slide-order">Order: {slide.order_num}</span>
                </div>
                <div className="slide-status">
                  <span className={`status-dot ${slide.active ? 'active' : ''}`}></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Admin;
