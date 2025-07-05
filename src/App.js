import React, { useEffect, useState } from 'react';
import staticMenu from './menu.json';
import axios from 'axios';

function App() {
  const hole = new URLSearchParams(window.location.search).get('hole') || '1';
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    // Load static, themed menu
    setMenu(staticMenu);
  }, [hole]);

  const addToCart = item =>
    setCart(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) {
        return prev.map(i =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });

  const updateQty = (id, delta) =>
    setCart(prev =>
      prev.map(i =>
        i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i
      )
    );

  const removeFromCart = id =>
    setCart(prev => prev.filter(i => i.id !== id));

  const clearCart = () => {
    setCart([]);
    setMessage('');
  };

  const checkout = () => {
    setPlacingOrder(true);
    axios
      .post('/api/order', { hole, items: cart })
      .then(res => setMessage(`✅ Order Confirmed: #${res.data.orderId}`))
      .catch(() => setMessage('❌ Order Failed, please try again.'))
      .finally(() => setPlacingOrder(false));
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div className="container">
      <header className="header">
        <h1>⛳️ Hole {hole} Preorder</h1>
      </header>

      <section className="menu">
        <h2>🏌️‍♂️ Menu</h2>
        <ul>
          {menu.map(item => (
            <li key={item.id}>
              <span>🥪 {item.name} — ${item.price.toFixed(2)}</span>
              <button onClick={() => addToCart(item)}>Add</button>
            </li>
          ))}
        </ul>
      </section>

      <section className="cart">
        <h2>🛒 Cart {cart.length > 0 && `(${cart.length})`}</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <ul>
              {cart.map(i => (
                <li key={i.id}>
                  <span>
                    ⛳️ {i.name} × {i.qty} = ${(i.price * i.qty).toFixed(2)}
                  </span>
                  <div className="qty-buttons">
                    <button onClick={() => updateQty(i.id, 1)}>+</button>
                    <button
                      onClick={() => updateQty(i.id, -1)}
                      disabled={i.qty === 1}
                    >
                      −
                    </button>
                    <button onClick={() => removeFromCart(i.id)}>
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <p className="total">Total: ${total.toFixed(2)}</p>
            <div className="actions">
              <button onClick={clearCart}>Clear Cart</button>
              <button onClick={checkout} disabled={placingOrder}>
                {placingOrder ? 'Processing...' : 'Checkout'}
              </button>
            </div>
          </>
        )}
      </section>

      {message && <div className="message">{message}</div>}
    </div>
  );
}

export default App;
