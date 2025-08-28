import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getCurrentUser } from './authService';

const ProtectedRoute = () => {
    const user = getCurrentUser();

    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
