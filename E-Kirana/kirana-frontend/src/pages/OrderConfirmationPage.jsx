import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getOrderById } from '../services/orderService';

const OrderConfirmationPage = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) {
                setError('No order ID provided.');
                setLoading(false);
                return;
            }
            try {
                const orderData = await getOrderById(orderId);
                setOrder(orderData);
            } catch (err) {
                setError('Could not load your order details. Please contact support.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    if (loading) {
        return <div className="text-center py-20">Loading your confirmation...</div>;
    }

    if (error) {
        return <div className="text-center py-20 text-red-600">{error}</div>;
    }

    if (!order) {
        return <div className="text-center py-20">No order details found.</div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white p-8 shadow-md rounded-lg text-center">
                    <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h1 className="mt-4 text-3xl font-bold text-gray-900">Thank you for your order!</h1>
                    <p className="mt-2 text-gray-600">Your order has been placed successfully. Your order number is <span className="font-semibold">#{order.id}</span>.</p>
                    
                    <div className="mt-8 text-left border-t pt-6">
                        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
                        {/* CORRECTED: Use order.orderItems and item.price */}
                        {order.orderItems && order.orderItems.length > 0 ? (
                            <ul className="divide-y divide-gray-200">
                                {order.orderItems.map(item => (
                                    <li key={item.id} className="py-4 flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">{item.product?.name || 'Product not available'}</p>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-medium">
                                            {item.price != null ? `₹${(item.price * item.quantity).toFixed(2)}` : 'Price not available'}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-10 px-4">
                                <p className="text-gray-700 font-semibold">No items found for this order.</p>
                            </div>
                        )}
                        <div className="mt-6 pt-6 border-t border-gray-200 text-right">
                            <p className="text-lg font-semibold">Total: ₹{order.totalPrice.toFixed(2)}</p>
                        </div>
                    </div>

                    <Link to="/my-orders" className="mt-8 inline-block w-full px-6 py-3 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                        Back to My Orders
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;
