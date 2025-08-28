import React from 'react';

const OrderDetailModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Order Details</h2>
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>X</button>
        <p><strong>Order ID:</strong> {order.id}</p>
        <p><strong>Customer Name:</strong> {order.customerName || 'N/A'}</p>
        <p><strong>Order Date:</strong> {order.orderDate ? new Date(order.orderDate).toLocaleString() : 'N/A'}</p>
        <p><strong>Total Amount:</strong> ₹{order.totalPrice || order.totalAmount || 'N/A'}</p>
        <p><strong>Payment Method:</strong> {order.paymentMethod || 'N/A'}</p>
        <p><strong>Status:</strong> {order.status || 'N/A'}</p>
        <h3 className="mt-4 font-semibold">Order Items:</h3>
        <ul className="list-disc ml-6">
          {order.orderItems && order.orderItems.length > 0 ? (
            order.orderItems.map(item => (
              <li key={item.id}>
                <strong>{item.product?.name || 'N/A'}</strong> (x{item.quantity}) - ₹{item.price}
              </li>
            ))
          ) : (
            <li>No items found.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default OrderDetailModal;

