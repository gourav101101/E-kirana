import { useNavigate } from 'react-router-dom';

const CustomerPlaceOrder = () => {
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    // ...existing order placement logic...
    // After successful order placement:
    navigate('/my-orders');
  };

  return (
    <div>
      {/* ...existing JSX code... */}
      <button onClick={handlePlaceOrder}>Place Order</button>
      {/* ...existing JSX code... */}
    </div>
  );
};

export default CustomerPlaceOrder;
