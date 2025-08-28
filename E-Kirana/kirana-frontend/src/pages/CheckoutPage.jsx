import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { placeOrder } from '../services/orderService';
import { getCurrentUser } from '../services/authService';

const CheckoutPage = () => {
    const { cart, itemCount, loading: cartLoading, clearCart } = useCart();
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const currentUser = getCurrentUser();

    if (cartLoading) {
        return <div className="text-center py-10">Loading checkout...</div>;
    }

    if (!cart || itemCount === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
                <p className="text-gray-600 mb-8">You cannot proceed to checkout with an empty cart.</p>
                <Link to="/" className="px-6 py-3 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    const handlePlaceOrder = async () => {
        setIsPlacingOrder(true);
        setError(null);
        try {
            // Updated: backend derives user from JWT; only send payment method
            const newOrder = await placeOrder('Cash on Delivery');
            // After placing the order, clear the local cart state
            clearCart();
            // Redirect to the confirmation page
            navigate(`/order-confirmation/${newOrder.id}`);
        } catch (err) {
            setError('Failed to place your order. Please try again.');
            console.error(err);
        } finally {
            setIsPlacingOrder(false);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
                    
                    <main className="lg:col-span-7">
                        <div className="bg-white p-8 shadow-md rounded-lg">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Shipping Information</h2>
                            <form className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                    <input type="email" id="email" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100" value={currentUser.email || ''} readOnly />
                                </div>
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input type="text" id="name" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100" value={currentUser.name || ''} readOnly />
                                </div>
                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                                    <input type="text" id="address" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" placeholder="123 Main St"/>
                                </div>
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                                    <input type="text" id="city" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" placeholder="Anytown"/>
                                </div>
                            </form>
                        </div>
                    </main>

                    <aside className="mt-12 lg:mt-0 lg:col-span-5">
                        <div className="bg-white p-8 shadow-md rounded-lg">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h3>
                            <ul className="divide-y divide-gray-200">
                                {cart.items.map(item => (
                                    <li key={item.product.id} className="py-4 flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">{item.product.name}</p>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-medium">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>Total</span>
                                    <span>₹{cart.totalPrice.toFixed(2)}</span>
                                </div>
                                {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
                                <button 
                                    onClick={handlePlaceOrder}
                                    className="mt-6 w-full px-6 py-3 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
                                    disabled={isPlacingOrder || cartLoading}
                                >
                                    {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
