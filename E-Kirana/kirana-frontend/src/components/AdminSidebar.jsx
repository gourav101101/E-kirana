import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../services/authService';

const AdminSidebar = () => {
    const navigate = useNavigate();
    const currentUser = getCurrentUser();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="h-screen w-64 bg-gray-900 text-white flex flex-col fixed left-0 top-0 z-40 shadow-lg">
            <div className="flex items-center justify-center h-20 border-b border-gray-800">
                <span className="text-2xl font-bold tracking-wide">E-Kirana Admin</span>
            </div>
            <nav className="flex-1 py-6 px-4 space-y-2">
                <NavLink to="/admin/dashboard" className={({ isActive }) => `block px-4 py-2 rounded transition-colors ${isActive ? 'bg-indigo-600' : 'hover:bg-gray-800'}`}>Dashboard</NavLink>
                <NavLink to="/admin/products" className={({ isActive }) => `block px-4 py-2 rounded transition-colors ${isActive ? 'bg-indigo-600' : 'hover:bg-gray-800'}`}>Products</NavLink>
                <NavLink to="/admin/users" className={({ isActive }) => `block px-4 py-2 rounded transition-colors ${isActive ? 'bg-indigo-600' : 'hover:bg-gray-800'}`}>Users</NavLink>
                <NavLink to="/admin/orders" className={({ isActive }) => `block px-4 py-2 rounded transition-colors ${isActive ? 'bg-indigo-600' : 'hover:bg-gray-800'}`}>Orders</NavLink>
                <NavLink to="/admin/reports" className={({ isActive }) => `block px-4 py-2 rounded transition-colors ${isActive ? 'bg-indigo-600' : 'hover:bg-gray-800'}`}>Reports</NavLink>
            </nav>
            <div className="px-4 pb-6">
                <div className="mb-2 text-sm text-gray-400">Logged in as: <span className="font-semibold text-white">{currentUser?.name || 'Admin'}</span></div>
                <button onClick={handleLogout} className="w-full px-4 py-2 bg-red-600 rounded hover:bg-red-700 font-semibold">Logout</button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
