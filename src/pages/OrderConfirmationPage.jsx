import React from 'react';
import { useParams } from 'react-router-dom';

const OrderConfirmationPage = () => {
  const { id } = useParams();

  // You can fetch order details using the id if needed
  // For now, just display a simple confirmation
  if (!id) {
    return <div>Order ID not found.</div>;
  }

  return (
    <div>
      <h2>Order Confirmation</h2>
      <p>Your order (ID: {id}) has been placed successfully!</p>
      {/* Add more details if needed */}
    </div>
  );
};

export default OrderConfirmationPage;
