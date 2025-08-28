import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getCurrentUser } from './authService';

const AdminRoute = () => {
    const user = getCurrentUser();

    // Check if user is logged in and has the ADMIN role
    const isAdmin = user && user.role === 'ADMIN';

    return isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminRoute;
