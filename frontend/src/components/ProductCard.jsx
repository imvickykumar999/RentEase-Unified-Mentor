import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  // Find lowest rent (usually 24 months rate)
  const rates = product.tenureRates || {};
  // If it's a Map in Mongoose, it might come down as a plain object
  // Find the minimum multiplier to compute starting rent
  let minMultiplier = 1.0;
  Object.values(rates).forEach(val => {
    if (val < minMultiplier) minMultiplier = val;
  });
  
  const startingRent = Math.round(product.baseRent * minMultiplier);

  const handleCardClick = () => {
    navigate(`/products/${product._id}`);
  };

  const isOutOfStock = product.inventory <= 0;

  return (
    <div 
      className="card fade-in" 
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Product Image */}
      <div style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden', background: '#1e293b' }}>
        <img 
          src={product.images && product.images[0]} 
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform var(--transition-normal)',
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.08)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        />
        {/* Out of Stock overlay */}
        {isOutOfStock ? (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '1.1rem',
            color: 'var(--color-danger)',
          }}>
            OUT OF STOCK
          </div>
        ) : product.inventory <= 3 ? (
          <span className="badge badge-warning" style={{ position: 'absolute', top: '12px', left: '12px' }}>
            Only {product.inventory} Left!
          </span>
        ) : null}

        {/* Category badge */}
        <span 
          className="badge badge-info" 
          style={{ position: 'absolute', top: '12px', right: '12px' }}
        >
          {product.category}
        </span>
      </div>

      {/* Product Details */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '10px' }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            {product.subcategory}
          </span>
          <h3 style={{ 
            fontSize: '1.1rem', 
            fontWeight: 700, 
            marginTop: '4px',
            color: 'var(--text-primary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
          }}>
            {product.name}
          </h3>
        </div>

        <p style={{ 
          fontSize: '0.85rem', 
          color: 'var(--text-secondary)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          height: '40px',
        }}>
          {product.description}
        </p>

        {/* Pricing Summary */}
        <div style={{ 
          marginTop: 'auto', 
          borderTop: '1px solid var(--border-color)', 
          paddingTop: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Rent starts at</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-secondary)' }}>
              ₹{startingRent} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)' }}>/mo</span>
            </span>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Refundable Deposit</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>₹{product.deposit}</span>
          </div>
        </div>

        {/* Action Button */}
        <button 
          className={`btn ${isOutOfStock ? 'btn-outline' : 'btn-primary'} btn-sm`} 
          style={{ width: '100%', marginTop: '6px' }}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? 'Notify Me' : 'Rent Now'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
