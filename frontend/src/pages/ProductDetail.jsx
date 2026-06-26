import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCity } from '../context/CityContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { selectedCity } = useCity();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [selectedTenure, setSelectedTenure] = useState(3);
  const [addedAlert, setAddedAlert] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await response.json();
        
        if (data.success) {
          setProduct(data.data);
          setActiveImage(data.data.images[0]);
        } else {
          navigate('/catalog');
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
        navigate('/catalog');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="container flex-center" style={{ minHeight: '60vh', flexDirection: 'column', gap: '16px' }}>
        <div className="shimmer-box" style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
        <h3 className="shimmer-box" style={{ width: '200px', height: '24px' }}> </h3>
      </div>
    );
  }

  if (!product) return null;

  // Tenure options and multipliers
  // Usually product.tenureRates has keys '3', '6', '12', '24'
  const rates = product.tenureRates || {};
  const tenureOptions = [3, 6, 12, 24];

  const getRentForTenure = (t) => {
    const multiplier = rates[String(t)] !== undefined ? rates[String(t)] : 1.0;
    return Math.round(product.baseRent * multiplier);
  };

  const getDiscountPercent = (t) => {
    const multiplier = rates[String(t)] !== undefined ? rates[String(t)] : 1.0;
    return Math.round((1 - multiplier) * 100);
  };

  const currentRent = getRentForTenure(selectedTenure);
  const currentSavings = getDiscountPercent(selectedTenure);
  
  const isCityAvailable = product.citiesAvailable.includes(selectedCity);
  const isOutOfStock = product.inventory <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock || !isCityAvailable) return;
    
    addToCart(product, selectedTenure, 1);
    setAddedAlert(true);
    setTimeout(() => setAddedAlert(false), 3000);
  };

  return (
    <div className="container" style={{ padding: '30px 24px', minHeight: '80vh' }}>
      
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="btn btn-outline btn-sm"
        style={{ marginBottom: '24px' }}
      >
        ← Back to Catalog
      </button>

      {/* Main product card details */}
      <div className="glass fade-in" style={{
        padding: '40px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '40px',
      }}>
        
        {/* Left Column: Images */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Main Large Image */}
          <div style={{
            width: '100%',
            height: '380px',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            border: '1px solid var(--border-color)',
            background: '#1e293b',
          }}>
            <img 
              src={activeImage} 
              alt={product.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Thumbnail list */}
          {product.images.length > 1 && (
            <div className="flex-gap" style={{ overflowX: 'auto', paddingBottom: '8px' }}>
              {product.images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: activeImage === img ? '3px solid var(--color-primary)' : '1px solid var(--border-color)',
                    transition: 'all var(--transition-fast)',
                    flexShrink: 0,
                  }}
                >
                  <img src={img} alt={`Thumb ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Pricing & Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <div className="flex-between">
              <span className="badge badge-info">{product.category}</span>
              {isOutOfStock ? (
                <span className="badge badge-danger">Out of Stock</span>
              ) : (
                <span className="badge badge-success">In Stock ({product.inventory} left)</span>
              )}
            </div>
            <h1 style={{
              fontFamily: 'var(--font-secondary)',
              fontSize: '2.2rem',
              fontWeight: 800,
              marginTop: '10px',
              lineHeight: '1.2',
            }}>
              {product.name}
            </h1>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginTop: '6px' }}>
              Subcategory: {product.subcategory}
            </span>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
            {product.description}
          </p>

          {/* City restriction block */}
          {!isCityAvailable && (
            <div className="badge badge-warning" style={{
              display: 'block',
              padding: '12px',
              textTransform: 'none',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              textAlign: 'center',
            }}>
              ⚠️ Unstocked in <b>{selectedCity}</b>. Available cities: {product.citiesAvailable.join(', ')}
            </div>
          )}

          {/* Pricing Box & Interactive Tenure Slider */}
          <div className="glass" style={{
            padding: '24px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-glow)',
            boxShadow: 'var(--shadow-sm)',
            background: 'rgba(99, 102, 241, 0.03)',
          }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              SELECT RENTAL DURATIONS (TENURE)
            </span>

            {/* Interactive Tenure Slider */}
            <div className="tenure-slider-container">
              <div className="tenure-track">
                <div className="tenure-dots">
                  {tenureOptions.map((t) => (
                    <div 
                      key={t}
                      className={`tenure-dot ${selectedTenure === t ? 'active' : ''}`}
                      onClick={() => setSelectedTenure(t)}
                    >
                      <span className="tenure-dot-label">{t} Months</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Price display with savings percentage */}
            <div className="flex-between" style={{ marginTop: '36px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Monthly Rental Rent</span>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-secondary)' }}>
                  ₹{currentRent} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)' }}>/mo</span>
                </span>
              </div>
              
              {currentSavings > 0 && (
                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-success" style={{ padding: '6px 12px', borderRadius: 'var(--radius-md)', fontWeight: 700 }}>
                    🔥 Save {currentSavings}% /mo
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                    vs. short term plans
                  </span>
                </div>
              )}
            </div>

            {/* Security deposit display */}
            <div className="flex-between" style={{ marginTop: '16px', background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                🛡️ Refundable Security Deposit
              </span>
              <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                ₹{product.deposit}
              </span>
            </div>
          </div>

          {/* Add to Cart Controls */}
          <div style={{ marginTop: '10px', position: 'relative' }}>
            {addedAlert && (
              <div className="badge badge-success fade-in" style={{
                position: 'absolute',
                bottom: '120%',
                left: 0,
                width: '100%',
                padding: '12px',
                textAlign: 'center',
                textTransform: 'none',
                borderRadius: 'var(--radius-sm)',
                boxShadow: 'var(--shadow-md)',
              }}>
                🛒 Added successfully to cart!
              </div>
            )}
            
            <button
              onClick={handleAddToCart}
              className={`btn btn-primary`}
              style={{
                width: '100%',
                height: '52px',
                fontSize: '1.1rem',
              }}
              disabled={isOutOfStock || !isCityAvailable}
            >
              {isOutOfStock 
                ? 'Out of Stock' 
                : !isCityAvailable 
                  ? `Unavailable in ${selectedCity}` 
                  : `Add to Cart • ₹${currentRent}/mo`
              }
            </button>
          </div>

          {/* Guarantees */}
          <div className="flex-between" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '12px' }}>
            <span>🔒 Secure checkout</span>
            <span>🔁 Easy Returns</span>
            <span>⚡ 48-Hour Delivery</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
