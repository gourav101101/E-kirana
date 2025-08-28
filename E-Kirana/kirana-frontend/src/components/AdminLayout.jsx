import React from 'react';
import AdminSidebar from './AdminSidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => (
    <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <main className="flex-1 ml-64 p-8">
            <Outlet />
        </main>
    </div>
);

export default AdminLayout;

