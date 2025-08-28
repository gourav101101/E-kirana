import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import orderService from '../services/orderService';

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await orderService.getOrderById(id);
        setOrder(response.data);
      } catch (err) {
        setError('Order not found or an error occurred.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!order) return <div>No order data available.</div>;

  return (
    <div className="order-confirmation">
      <h2>Order Confirmation</h2>
      <p><strong>Order ID:</strong> {order.id}</p>
      <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
      <p><strong>Total Amount:</strong> ₹{order.totalPrice}</p>
      <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
      <p><strong>Status:</strong> {order.status}</p>
      <h3>Order Items:</h3>
      <ul>
        {order.orderItems && order.orderItems.map(item => (
          <li key={item.id}>
            <strong>{item.product.name}</strong> (x{item.quantity}) - ₹{item.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderConfirmationPage;
