import React from 'react';
import { Link } from 'react-router-dom';

const Cart = () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  const getTotal = () => {
    return cart.reduce((sum, product) => sum + product.price, 0);
  };

  return (
    <div>
      <h1>Carrito de Compras</h1>
      <ul>
        {cart.map((product, index) => (
          <li key={index}>{product.name} - ${product.price}</li>
        ))}
      </ul>
      <h2>Total: ${getTotal()}</h2>
      <Link to="/checkout"><button>Proceder al Pago</button></Link>
    </div>
  );
};

export default Cart;
