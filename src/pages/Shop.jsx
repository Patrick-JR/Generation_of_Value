import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Eye, Search, X, Phone, Send, Check, Plus, Minus, User, MessageSquare, CheckCircle } from 'lucide-react';
import { shopProducts, churchInfo } from '../data/content';
import { submitOrder } from '../services/api';
import './Shop.css';
import heroImg from '../images/GOV_Shirt.jpg';
import golfTshirt from '../images/GOV_Shirt.jpg';
import servingGodHoodie from '../images/Serving_God_hoodie.jpg';

// New products images
import hoodieServing from '../Products/hoodie-serving.png';
import shirtServing from '../Products/Shirt-Serving.png';
import shirtRooted from '../Products/rooted-T-shirt.png';
import notebookServing from '../Products/Notebook-serving.png';
import pouchServing from '../Products/Phone-pouch-serving.png';
import pouchRooted from '../Products/Phone-Pouch-rooted.png';
import bottleServing from '../Products/Serving-Drink-Bottle.png';
import toteServing from '../Products/Tote-bag-Serving.png';
import toteServingBlack from '../Products/Tote-bug-serving-black.png';
import toteRooted from '../Products/Tote-bug-Rooted.png';
import bagServing from '../Products/School-bug-serving.png';
import bagRooted from '../Products/Rooted-school-bug.png';

// Map product image keys to real imported images
const productImages = {
  golf_tshirt: golfTshirt,
  serving_god_hoodie: servingGodHoodie,
  hoodie_serving: hoodieServing,
  shirt_serving: shirtServing,
  shirt_rooted: shirtRooted,
  notebook_serving: notebookServing,
  pouch_serving: pouchServing,
  pouch_rooted: pouchRooted,
  bottle_serving: bottleServing,
  tote_serving: toteServing,
  tote_serving_black: toteServingBlack,
  tote_rooted: toteRooted,
  bag_serving: bagServing,
  bag_rooted: bagRooted,
  skin: servingGodHoodie, // placeholder
  cap: golfTshirt, // placeholder
  wristband: servingGodHoodie, // placeholder
};

const Shop = () => {
  // Product browsing state
  const [showQuickView, setShowQuickView] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');

  // Order flow state
  const [orderProduct, setOrderProduct] = useState(null); // which product is being ordered
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [orderForm, setOrderForm] = useState({ name: '', phone: '', message: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  // Open order form for a product
  const handleBuyNow = (product) => {
    setOrderProduct(product);
    setSelectedSize(product.sizes[0]);
    setSelectedColor(product.colors[0]);
    setQuantity(1);
    setOrderForm({ name: '', phone: '', message: '' });
    setErrors({});
    setIsSubmitted(false);
  };

  const closeOrderForm = () => {
    setOrderProduct(null);
    setIsSubmitted(false);
  };

  // Wishlist helpers
  const toggleWishlist = (product) => {
    const inList = wishlist.find(w => w.id === product.id);
    setWishlist(inList ? wishlist.filter(w => w.id !== product.id) : [...wishlist, product]);
  };
  const isInWishlist = (id) => wishlist.some(w => w.id === id);

  // Form validation & submit
  const validate = () => {
    const e = {};
    if (!orderForm.name.trim()) e.name = 'Your name is required';
    if (!orderForm.phone.trim()) e.phone = 'Phone number is required';
    else if (!/^[\d\s+\-()]{7,}$/.test(orderForm.phone)) e.phone = 'Enter a valid phone number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setApiError('');

    try {
      // 1. Send to Backend
      await submitOrder({
        product: { id: orderProduct.id, name: orderProduct.name, price: orderProduct.price },
        color: selectedColor,
        size: selectedSize,
        quantity,
        customer: { name: orderForm.name, phone: orderForm.phone, message: orderForm.message }
      });

      // 2. Build WhatsApp message (fallback/human touch)
      const msg =
        `Hello GOV Shop! 👋\n\n` +
        `🛍️ *Order Request*\n` +
        `----------------------------\n` +
        `*Product:* ${orderProduct.name}\n` +
        `*Color:* ${selectedColor}\n` +
        `*Size:* ${selectedSize}\n` +
        `*Qty:* ${quantity}\n` +
        `*Total:* K${orderProduct.price * quantity}\n` +
        `----------------------------\n` +
        `*Name:* ${orderForm.name}\n` +
        `*Phone:* ${orderForm.phone}\n` +
        (orderForm.message ? `*Note:* ${orderForm.message}\n` : '');

      window.open(`https://wa.me/260573351036?text=${encodeURIComponent(msg)}`, '_blank');
      setIsSubmitted(true);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter & sort
  const filteredProducts = shopProducts
    .filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="shop-page">

      {/* ── Hero ── */}
      <section className="shop-hero">
        <div className="hero-bg">
          <div className="hero-overlay"></div>
          <img src={heroImg} alt="GOV Shop" />
        </div>
        <div className="container">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="page-badge">Merchandise</span>
            <h1>GOV Shop</h1>
            <p>Represent the Generation of Value with pride</p>
          </motion.div>
        </div>
      </section>

      {/* ── Products ── */}
      <section className="section products-section">
        <div className="container">

          {/* Toolbar */}
          <div className="shop-toolbar">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filter-sort">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="default">Sort: Default</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          <div className="products-grid">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                className="product-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <div className="product-image">
                  <img
                    src={productImages[product.image]}
                    alt={product.name}
                    className="product-img"
                  />
                  {product.badge && (
                    <span className="product-badge">{product.badge}</span>
                  )}
                  <div className="product-overlay">
                    <button className="overlay-btn" onClick={() => setShowQuickView(product)}>
                      <Eye size={18} />
                      Quick View
                    </button>
                  </div>
                  <button
                    className={`wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                    onClick={() => toggleWishlist(product)}
                    aria-label="Add to wishlist"
                  >
                    <Heart size={18} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>

                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-desc">{product.description}</p>
                  <div className="product-color-dots">
                    {product.colors.map((color, i) => (
                      <span key={i} className={`color-dot color-dot-${color.toLowerCase()}`} title={color} />
                    ))}
                  </div>
                  <div className="product-footer">
                    <span className="product-price">K{product.price}</span>
                    <button className="action-btn primary" onClick={() => handleBuyNow(product)}>
                      <ShoppingBag size={14} />
                      Buy Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How to Order info strip ── */}
      <section className="section order-info-section">
        <div className="container">
          <motion.div
            className="order-info-card"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2>How to Order</h2>
            <p className="order-subtitle">Simple steps to get your GOV merch</p>
            <div className="order-steps">
              {[
                { n: 1, title: 'Pick Your Item', desc: 'Browse and click "Buy Now" on what you love.' },
                { n: 2, title: 'Fill Your Details', desc: 'Enter your name, phone, colour & size.' },
                { n: 3, title: 'Send via WhatsApp', desc: 'Your order goes straight to our team.' },
                { n: 4, title: 'Pay & Collect', desc: `Send payment to Mobile Money: ${churchInfo.phone}` },
              ].map(s => (
                <div key={s.n} className="order-step">
                  <div className="step-number">{s.n}</div>
                  <div className="step-content">
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Quick View Modal ── */}
      <AnimatePresence>
        {showQuickView && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowQuickView(null)}
          >
            <motion.div
              className="quickview-modal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close-x" onClick={() => setShowQuickView(null)}>
                <X size={20} />
              </button>
              <div className="quickview-content">
                <div className="quickview-image-wrap">
                  <img
                    src={productImages[showQuickView.image]}
                    alt={showQuickView.name}
                    className="quickview-img"
                  />
                  {showQuickView.badge && (
                    <span className="product-badge">{showQuickView.badge}</span>
                  )}
                </div>
                <div className="quickview-info">
                  <h3>{showQuickView.name}</h3>
                  <p className="price">K{showQuickView.price}</p>
                  <p className="desc">{showQuickView.description}</p>
                  <div className="quickview-colors">
                    {showQuickView.colors.map((c, i) => (
                      <span key={i} className={`color-dot color-dot-${c.toLowerCase()}`} title={c} />
                    ))}
                  </div>
                  <div className="quickview-sizes">
                    {showQuickView.sizes.map((s, i) => (
                      <span key={i} className="size-chip">{s}</span>
                    ))}
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => { handleBuyNow(showQuickView); setShowQuickView(null); }}
                  >
                    <ShoppingBag size={18} />
                    Buy Now
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Order Form Modal ── */}
      <AnimatePresence>
        {orderProduct && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOrderForm}
          >
            <motion.div
              className="order-modal"
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button className="modal-close-x" onClick={closeOrderForm}>
                <X size={20} />
              </button>

              {isSubmitted ? (
                /* ── Success State ── */
                <motion.div
                  className="order-success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <div className="success-icon">
                    <CheckCircle size={56} />
                  </div>
                  <h2>Order Sent! 🎉</h2>
                  <p>Your order for <strong>{orderProduct.name}</strong> has been sent to our team via WhatsApp. We'll confirm your order and payment details shortly.</p>
                  <div className="success-summary">
                    <div className="summary-row"><span>Item</span><span>{orderProduct.name}</span></div>
                    <div className="summary-row"><span>Colour</span><span>{selectedColor}</span></div>
                    <div className="summary-row"><span>Size</span><span>{selectedSize}</span></div>
                    <div className="summary-row"><span>Qty</span><span>{quantity}</span></div>
                    <div className="summary-row total"><span>Total</span><span>K{orderProduct.price * quantity}</span></div>
                  </div>
                  <button className="btn btn-primary" onClick={closeOrderForm}>
                    Continue Shopping
                  </button>
                </motion.div>
              ) : (
                /* ── Form State ── */
                <>
                  {/* Product preview strip */}
                  <div className="order-product-strip">
                    <img
                      src={productImages[orderProduct.image]}
                      alt={orderProduct.name}
                      className="order-product-thumb"
                    />
                    <div className="order-product-meta">
                      <h3>{orderProduct.name}</h3>
                      <p className="order-product-price">K{orderProduct.price * quantity}</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="order-form" noValidate>
                    <div className="form-section-label">Select Options</div>

                    {/* Color */}
                    <div className="form-group">
                      <label>Colour</label>
                      <div className="option-pills">
                        {orderProduct.colors.map(c => (
                          <button
                            key={c}
                            type="button"
                            className={`option-pill ${selectedColor === c ? 'selected' : ''}`}
                            onClick={() => setSelectedColor(c)}
                          >
                            <span className={`color-dot-sm color-dot-${c.toLowerCase()}`} />
                            {c}
                            {selectedColor === c && <Check size={13} />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Size */}
                    <div className="form-group">
                      <label>Size</label>
                      <div className="option-pills">
                        {orderProduct.sizes.map(s => (
                          <button
                            key={s}
                            type="button"
                            className={`option-pill ${selectedSize === s ? 'selected' : ''}`}
                            onClick={() => setSelectedSize(s)}
                          >
                            {s}
                            {selectedSize === s && <Check size={13} />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="form-group">
                      <label>Quantity</label>
                      <div className="qty-control">
                        <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                          <Minus size={16} />
                        </button>
                        <span>{quantity}</span>
                        <button type="button" onClick={() => setQuantity(quantity + 1)}>
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="form-divider" />
                    <div className="form-section-label">Your Details</div>

                    {/* Name */}
                    <div className="form-group">
                      <label htmlFor="order-name">
                        <User size={14} /> Full Name *
                      </label>
                      <input
                        id="order-name"
                        type="text"
                        placeholder="e.g. Chanda Mulenga"
                        value={orderForm.name}
                        onChange={(e) => { setOrderForm({ ...orderForm, name: e.target.value }); setErrors({ ...errors, name: '' }); }}
                        className={errors.name ? 'input-error' : ''}
                      />
                      {errors.name && <span className="field-error">{errors.name}</span>}
                    </div>

                    {/* Phone */}
                    <div className="form-group">
                      <label htmlFor="order-phone">
                        <Phone size={14} /> Phone Number *
                      </label>
                      <input
                        id="order-phone"
                        type="tel"
                        placeholder="+260 97X XXX XXX"
                        value={orderForm.phone}
                        onChange={(e) => { setOrderForm({ ...orderForm, phone: e.target.value }); setErrors({ ...errors, phone: '' }); }}
                        className={errors.phone ? 'input-error' : ''}
                      />
                      {errors.phone && <span className="field-error">{errors.phone}</span>}
                    </div>

                    {/* Note */}
                    <div className="form-group">
                      <label htmlFor="order-msg">
                        <MessageSquare size={14} /> Note <span className="optional">(optional)</span>
                      </label>
                      <textarea
                        id="order-msg"
                        placeholder="Any special requests or delivery notes..."
                        value={orderForm.message}
                        onChange={(e) => setOrderForm({ ...orderForm, message: e.target.value })}
                        rows={2}
                      />
                    </div>

                    {/* Total */}
                    <div className="order-total-bar">
                      <span>Total</span>
                      <span className="total-amount">K{orderProduct.price * quantity}</span>
                    </div>

                    {apiError && (
                      <div className="field-error" style={{ textAlign: 'center', margin: '0.5rem 0' }}>
                        {apiError}
                      </div>
                    )}

                    <button type="submit" className="btn btn-primary btn-full submit-order-btn" disabled={isSubmitting}>
                      <Send size={18} />
                      {isSubmitting ? 'Processing...' : 'Send Order via WhatsApp'}
                    </button>

                    <p className="order-note">
                      This will open WhatsApp with your order details pre-filled. Our team will confirm payment instructions.
                    </p>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Shop;
