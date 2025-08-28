import React from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';

const AdminDashboard = () => {
    const currentUser = getCurrentUser();

    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <p className="text-lg text-gray-700 mb-8">
                Welcome, <span className="font-semibold">{currentUser ? currentUser.name : 'Admin'}</span>! This is the central hub for managing your e-commerce site.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Manage Products Card */}
                <Link to="/admin/products" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h3 className="text-xl font-semibold text-indigo-600">Manage Products</h3>
                    <p className="mt-2 text-gray-600">Add, edit, and remove products from your store.</p>
                </Link>

                {/* View Orders Card */}
                <Link to="/admin/orders" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h3 className="text-xl font-semibold text-indigo-600">View Orders</h3>
                    <p className="mt-2 text-gray-600">Review and manage customer orders.</p>
                </Link>

                {/* Manage Users Card */}
                <Link to="/admin/users" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h3 className="text-xl font-semibold text-indigo-600">Manage Users</h3>
                    <p className="mt-2 text-gray-600">View, add, edit, and remove users.</p>
                </Link>
            </div>
        </>
    );
};

export default AdminDashboard;
