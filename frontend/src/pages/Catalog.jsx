import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCity } from '../context/CityContext';
import ProductCard from '../components/ProductCard';

const Catalog = () => {
  const { selectedCity } = useCity();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [maxRent, setMaxRent] = useState(2000); // Max rental slider limit

  // Extract initial parameters from URL query string
  const categoryParam = searchParams.get('category') || '';
  const subcategoryParam = searchParams.get('subcategory') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `http://localhost:5000/api/products?city=${selectedCity}`;
        if (categoryParam) url += `&category=${categoryParam}`;
        if (subcategoryParam) url += `&subcategory=${subcategoryParam}`;
        if (searchQuery) url += `&q=${searchQuery}`;

        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
          setProducts(data.data);
        }
      } catch (error) {
        console.error('Error fetching catalog products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCity, categoryParam, subcategoryParam, searchQuery]);

  const handleCategoryChange = (cat) => {
    const params = {};
    if (cat) params.category = cat;
    setSearchParams(params);
  };

  const handleSubcategoryChange = (sub) => {
    const params = {};
    if (categoryParam) params.category = categoryParam;
    if (sub) params.subcategory = sub;
    setSearchParams(params);
  };

  // Define subcategories statically for styling
  const subcategoriesMap = {
    Furniture: ['Bed', 'Sofa', 'Table', 'Chair'],
    Appliances: ['Fridge', 'Washing Machine', 'TV', 'Microwave', 'Air Conditioner'],
  };

  // Client-side price range filtering
  const filteredProducts = products.filter(prod => {
    // Find starting rent for filtering
    const rates = prod.tenureRates || {};
    let minMultiplier = 1.0;
    Object.values(rates).forEach(val => {
      if (val < minMultiplier) minMultiplier = val;
    });
    const startingRent = prod.baseRent * minMultiplier;
    return startingRent <= maxRent;
  });

  return (
    <div className="container" style={{ padding: '30px 24px', minHeight: '80vh' }}>
      
      {/* 1. Header Banner */}
      <div className="glass" style={{
        padding: '30px 40px',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '32px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(6, 182, 212, 0.03) 100%)',
        border: '1px solid var(--border-glow)',
      }}>
        <h1 style={{ fontFamily: 'var(--font-secondary)', fontSize: '2rem', fontWeight: 800 }}>
          Renting in <span style={{ color: 'var(--color-primary)' }}>{selectedCity}</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Explore all rental items available in your location. Swap cities in the top selector to see other stocks.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        
        {/* 2. Sidebar Filters */}
        <aside className="glass" style={{
          flex: '1 1 260px',
          maxWidth: '300px',
          padding: '24px',
          borderRadius: 'var(--radius-lg)',
          alignSelf: 'flex-start',
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ⚙️ Filters
          </h3>

          {/* Search bar */}
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label">Search Keywords</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. bed, TV, sofa"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '10px 14px' }}
            />
          </div>

          {/* Category Filter */}
          <div style={{ marginBottom: '24px' }}>
            <span className="form-label">Primary Category</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
              <button
                className={`btn btn-sm ${!categoryParam ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => handleCategoryChange('')}
                style={{ justifyContent: 'flex-start' }}
              >
                All Categories
              </button>
              <button
                className={`btn btn-sm ${categoryParam === 'Furniture' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => handleCategoryChange('Furniture')}
                style={{ justifyContent: 'flex-start' }}
              >
                🛋️ Furniture
              </button>
              <button
                className={`btn btn-sm ${categoryParam === 'Appliances' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => handleCategoryChange('Appliances')}
                style={{ justifyContent: 'flex-start' }}
              >
                📺 Appliances
              </button>
            </div>
          </div>

          {/* Subcategory Filter */}
          {categoryParam && (
            <div style={{ marginBottom: '24px' }}>
              <span className="form-label">Subcategory</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                <button
                  className={`btn btn-sm ${!subcategoryParam ? 'btn-secondary' : 'btn-outline'}`}
                  onClick={() => handleSubcategoryChange('')}
                  style={{ justifyContent: 'flex-start' }}
                >
                  All {categoryParam}
                </button>
                {subcategoriesMap[categoryParam].map((sub) => (
                  <button
                    key={sub}
                    className={`btn btn-sm ${subcategoryParam === sub ? 'btn-secondary' : 'btn-outline'}`}
                    onClick={() => handleSubcategoryChange(sub)}
                    style={{ justifyContent: 'flex-start' }}
                  >
                    • {sub}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price Range Filter */}
          <div>
            <div className="flex-between">
              <span className="form-label">Max Rent</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-secondary)' }}>
                ₹{maxRent}/mo
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="2500"
              step="50"
              value={maxRent}
              onChange={(e) => setMaxRent(Number(e.target.value))}
              style={{
                width: '100%',
                margin: '12px 0 6px 0',
                accentColor: 'var(--color-secondary)',
                cursor: 'pointer',
              }}
            />
            <div className="flex-between" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>₹100</span>
              <span>₹2500+</span>
            </div>
          </div>
        </aside>

        {/* 3. Products Grid */}
        <main style={{ flex: '3 1 600px' }}>
          {loading ? (
            // Shimmer Placeholders Grid
            <div className="grid-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card" style={{ height: '380px', padding: 0 }}>
                  <div className="shimmer-box" style={{ height: '200px', borderRadius: '0' }} />
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div className="shimmer-box" style={{ height: '14px', width: '40%' }} />
                    <div className="shimmer-box" style={{ height: '20px', width: '80%' }} />
                    <div className="shimmer-box" style={{ height: '14px', width: '90%' }} />
                    <div className="shimmer-box" style={{ height: '35px', marginTop: 'auto' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="glass flex-center" style={{
              flexDirection: 'column',
              padding: '60px',
              textAlign: 'center',
              borderRadius: 'var(--radius-lg)',
              gap: '16px',
            }}>
              <span style={{ fontSize: '3rem' }}>🔍</span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>No Products Found</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>
                We couldn't find any products in <b>{selectedCity}</b> matching your selected filters. Try broadening your criteria.
              </p>
              <button 
                onClick={() => {
                  setSearchParams({});
                  setSearchQuery('');
                  setMaxRent(2000);
                }} 
                className="btn btn-outline"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            // Actual Products Grid
            <div className="grid-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>
        
      </div>
    </div>
  );
};

export default Catalog;
