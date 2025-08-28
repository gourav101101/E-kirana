import React, { useState, useEffect } from 'react';
import { getMyOrders } from '../services/orderService';
import { Link } from 'react-router-dom';

const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const ordersData = await getMyOrders();
                ordersData.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
                setOrders(ordersData);
                console.log(ordersData);
            } catch (err) {
                setError('Failed to fetch your orders.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const toggleOrderDetails = (orderId) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    if (loading) {
        return <div className="text-center py-10">Loading your orders...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-600">{error}</div>;
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold mb-4">You have no orders yet.</h2>
                <Link to="/" className="px-6 py-3 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                        {orders.map(order => (
                            <li key={order.id} className="p-6">
                                <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleOrderDetails(order.id)}>
                                    <div>
                                        <p className="text-sm font-semibold text-indigo-600">Order #{order.id}</p>
                                        <p className="text-sm text-gray-500">Placed on: {new Date(order.orderDate).toLocaleDateString()}</p>
                                        <p className={`mt-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {order.status}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold">₹{order.totalPrice.toFixed(2)}</p>
                                        <button className="text-sm text-indigo-600 hover:underline">
                                            {expandedOrderId === order.id ? 'Hide Details' : 'View Details'}
                                        </button>
                                    </div>
                                </div>
                                {expandedOrderId === order.id && (
                                    <div className="mt-6 pt-4 border-t border-gray-200">
                                        <h4 className="text-md font-semibold mb-3">Order Items</h4>
                                        {order.orderItems && order.orderItems.length > 0 ? (
                                            <ul className="divide-y divide-gray-100">
                                                {order.orderItems.map(item => (
                                                    <li key={item.id} className="py-3 flex justify-between items-center">
                                                        <div>
                                                            <p className="font-medium text-gray-800">{item.product?.name || 'Product not available'}</p>
                                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                        </div>
                                                        <p className="font-medium text-gray-800">
                                                            {item.price != null ? `₹${(item.price * item.quantity).toFixed(2)}` : 'Price not available'}
                                                        </p>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>No items found for this order.</p>
                                        )}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default MyOrdersPage;
