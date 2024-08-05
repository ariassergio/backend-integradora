import React from 'react';
import { useHistory } from 'react-router-dom';

const Checkout = () => {
  const history = useHistory();
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const getTotal = () => cart.reduce((sum, product) => sum + product.price, 0);

  const handleCheckout = () => {
    fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart, total: getTotal() })
    })
      .then(res => res.json())
      .then(() => {
        localStorage.removeItem('cart');
        history.push('/confirmation');
      })
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h1>Checkout</h1>
      <ul>
        {cart.map((product, index) => (
          <li key={index}>{product.name} - ${product.price}</li>
        ))}
      </ul>
      <h2>Total: ${getTotal()}</h2>
      <button onClick={handleCheckout}>Finalizar Compra</button>
    </div>
  );
};

export default Checkout;
