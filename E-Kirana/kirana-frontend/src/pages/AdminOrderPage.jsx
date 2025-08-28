import React, { useState, useEffect, useCallback } from 'react';
import { getAllOrders, updateOrderStatus, deleteOrder } from '../services/orderService';
import OrderDetailModal from '../components/OrderDetailModal';

const AdminOrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const ordersData = await getAllOrders();
            setOrders(ordersData);

        } catch (err) {
            setError('Failed to fetch orders.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            fetchOrders(); // Refresh orders after status change
        } catch (err) {
            console.error('Failed to update order status:', err);
            setError('Failed to update status.');
        }
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleDelete = async (orderId) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            try {
                await deleteOrder(orderId);
                fetchOrders(); // Refresh orders after deletion

            } catch (err) {
                setError('Failed to delete order.');
                console.error(err);
            }
        }
    };

    if (loading) return <div className="text-center p-10">Loading orders...</div>;
    if (error) return <div className="text-center p-10 text-red-600">{error}</div>;

    return (
        <>
            <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{order.customerName || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">₹{order.totalPrice.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        className="px-2 py-1 border rounded"
                                    >
                                        <option value="PENDING">Pending</option>
                                        <option value="SHIPPED">Shipped</option>
                                        <option value="DELIVERED">Delivered</option>
                                        <option value="CANCELLED">Cancelled</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button onClick={() => handleViewDetails(order)} className="mr-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Details</button>
                                    <button onClick={() => handleDelete(order.id)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <OrderDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                order={selectedOrder}
            />
        </>
    );
};

export default AdminOrderPage;
