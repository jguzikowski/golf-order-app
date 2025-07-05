import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const params = new URLSearchParams(window.location.search);
  const hole = params.get('hole') || '1';
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setLoadingMenu(true);
    axios.get(`/api/menu?hole=${hole}`)
      .then(res => setMenu(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoadingMenu(false));
  }, [hole]);

  const addToCart = (item) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) {
        return prev.map(i =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev =>
      prev.map(i =>
        i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i
      )
    );
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setMessage('');
  };

  const checkout = () => {
    setPlacingOrder(true);
    axios.post('/api/order', { hole, items: cart })
      .then(res => {
        setMessage(`✅ Order confirmed: ${res.data.orderId}`);
        clearCart();
      })
      .catch(err => {
        console.error(err);
        setMessage('❌ Failed to place order. Please try again.');
      })
      .finally(() => setPlacingOrder(false));
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div className="container">
      <h1>Preorder at Hole {hole}</h1>
      {loadingMenu ? (
        <p>Loading menu...</p>
      ) : (
        <>
          <h2>Menu</h2>
          <ul>
            {menu.map(item => (
              <li key={item.id}>
                <span>{item.name} (${item.price.toFixed(2)})</span>
                <button onClick={() => addToCart(item)}>Add</button>
              </li>
            ))}
          </ul>
        </>
      )}
      <h2>Cart {cart.length > 0 && `(${cart.length} items)`}</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cart.map(i => (
              <li key={i.id}>
                <span>{i.name} (${i.price.toFixed(2)}) × {i.qty}</span>
                <button onClick={() => updateQty(i.id, 1)}>+</button>
                <button onClick={() => updateQty(i.id, -1)} disabled={i.qty === 1}>−</button>
                <button onClick={() => removeFromCart(i.id)}>Remove</button>
              </li>
            ))}
          </ul>
          <p className="total">Total: ${total.toFixed(2)}</p>
          <div className="actions">
            <button onClick={clearCart}>Clear Cart</button>
            <button onClick={checkout} disabled={placingOrder}>
              {placingOrder ? 'Placing...' : 'Checkout'}
            </button>
          </div>
        </>
      )}
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default App;