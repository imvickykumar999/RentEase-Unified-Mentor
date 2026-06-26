import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('rentease_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing cart data:', error);
      }
    }
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    localStorage.setItem('rentease_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, tenure, quantity = 1) => {
    setCartItems((prevItems) => {
      // Find if item already exists with the SAME product ID and SAME tenure
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product._id === product._id && item.tenure === tenure
      );

      // Get multiplier from product tenureRates (it's a Map, but in JSON it turns into a standard object)
      const rates = product.tenureRates || {};
      const multiplier = rates[String(tenure)] !== undefined ? rates[String(tenure)] : 1.0;
      const calculatedRent = Math.round(product.baseRent * multiplier);

      if (existingItemIndex > -1) {
        // Increment quantity of existing item
        const newItems = [...prevItems];
        const newQty = newItems[existingItemIndex].quantity + quantity;
        
        // Double check inventory limit
        if (newQty > product.inventory) {
          alert(`Cannot add more. Only ${product.inventory} items are in stock.`);
          return prevItems;
        }

        newItems[existingItemIndex].quantity = newQty;
        return newItems;
      } else {
        // Check if quantity exceeds inventory
        if (quantity > product.inventory) {
          alert(`Cannot add. Only ${product.inventory} items are in stock.`);
          return prevItems;
        }

        // Add new item
        return [
          ...prevItems,
          {
            product,
            tenure,
            monthlyRent: calculatedRent,
            securityDeposit: product.deposit,
            quantity,
          },
        ];
      }
    });
  };

  const removeFromCart = (productId, tenure) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => !(item.product._id === productId && item.tenure === tenure))
    );
  };

  const updateQuantity = (productId, tenure, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, tenure);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product._id === productId && item.tenure === tenure) {
          if (quantity > item.product.inventory) {
            alert(`Only ${item.product.inventory} items are in stock.`);
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Computations
  const totalMonthlyRent = cartItems.reduce((acc, item) => acc + item.monthlyRent * item.quantity, 0);
  const totalSecurityDeposit = cartItems.reduce((acc, item) => acc + item.securityDeposit * item.quantity, 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalMonthlyRent,
        totalSecurityDeposit,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
