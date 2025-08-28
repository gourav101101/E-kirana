import React from 'react';

const OrderDetailModal = ({ isOpen, onClose, order }) => {
    if (!isOpen || !order) return null;

    console.log(order);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4">Order Details</h2>
                <div className="mb-4">
                    <p><span className="font-semibold">Order ID:</span> {order.id}</p>
                    <p><span className="font-semibold">User:</span> {order.customerName || 'N/A'}</p>
                    <p><span className="font-semibold">Status:</span> {order.status}</p>
                    <p><span className="font-semibold">Total:</span> ₹{order.totalPrice}</p>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Items</h3>
                    <table className="min-w-full divide-y divide-gray-200 mb-4">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {order.orderItems && order.orderItems.length > 0 ? (
                                order.orderItems.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="px-4 py-2 whitespace-nowrap">{item.productName || 'N/A'}</td>
                                        <td className="px-4 py-2 whitespace-nowrap">{item.quantity}</td>
                                        <td className="px-4 py-2 whitespace-nowrap">₹{item.price}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="px-4 py-2 text-center text-gray-500">No items found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Close</button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailModal;
