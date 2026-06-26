import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { CityProvider } from './context/CityContext';
import { CartProvider } from './context/CartContext';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import UserPortal from './pages/UserPortal';
import AdminPortal from './pages/AdminPortal';
import Login from './pages/Login';

// Import CSS
import './App.css';

function App() {
  return (
    <AuthProvider>
      <CityProvider>
        <CartProvider>
          <Router>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              {/* Header section */}
              <Navbar />

              {/* Main content body */}
              <main style={{ flexGrow: 1 }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/portal" element={<UserPortal />} />
                  <Route path="/admin" element={<AdminPortal />} />
                  <Route path="/login" element={<Login />} />
                </Routes>
              </main>

              {/* Footer section */}
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </CityProvider>
    </AuthProvider>
  );
}

export default App;
