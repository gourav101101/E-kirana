import React, { useEffect, useState } from 'react';
import orderService from '../services/orderService';

const AdminOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderService.getAllOrders();
        setOrders(response.data);
      } catch (err) {
        setError('Failed to fetch orders.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="admin-orders">
      <h2>Admin Order List</h2>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer Name</th>
            <th>Order Date</th>
            <th>Total Amount</th>
            <th>Products</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.user?.name || order.customerName || 'N/A'}</td>
              <td>{new Date(order.orderDate).toLocaleString()}</td>
              <td>₹{order.totalPrice}</td>
              <td>{order.orderItems && order.orderItems.map(item => item.product.name).join(', ')}</td>
              <td><a href={`/order-confirmation/${order.id}`}>View Details</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrderPage;
