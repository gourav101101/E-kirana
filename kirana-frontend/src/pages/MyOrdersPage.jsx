import React, { useEffect, useState, useContext } from 'react';
import orderService from '../services/orderService';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const MyOrdersPage = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderService.getOrdersByUserId(user.id);
        setOrders(response.data);
      } catch (err) {
        setError('Could not fetch orders.');
      } finally {
        setLoading(false);
      }
    };
    if (user && user.id) fetchOrders();
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!orders.length) return <div>No orders found.</div>;

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      {orders.map(order => (
        <div key={order.id} className="order-card">
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
          <p><strong>Total:</strong> ₹{order.totalPrice}</p>
          <p><strong>Payment:</strong> {order.paymentMethod}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <h4>Items:</h4>
          <ul>
            {order.orderItems.map(item => (
              <li key={item.id}>
                {item.product.name} (x{item.quantity}) - ₹{item.price}
              </li>
            ))}
          </ul>
          <Link to={`/order-confirmation/${order.id}`}>View Details</Link>
        </div>
      ))}
    </div>
  );
};

export default MyOrdersPage;

