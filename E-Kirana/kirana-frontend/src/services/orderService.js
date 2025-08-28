import apiClient from './api';

// --- CUSTOMER-FACING METHODS ---

// Updated to use authenticated principal; no userId parameter needed
export const placeOrder = async (paymentMethod) => {
    const response = await apiClient.post('/orders/create', { paymentMethod });
    return response.data;
};

export const getMyOrders = async () => {
    const response = await apiClient.get('/orders/my');
    return response.data;
};

export const getOrderById = async (orderId) => {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
};

// --- ADMIN-FACING METHODS ---

export const getAllOrders = async () => {
    const response = await apiClient.get('/orders');
    return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
    const response = await apiClient.put(`/orders/${orderId}/status?status=${status}`);
    return response.data;
};

export const deleteOrder = async (orderId) => {
    const response = await apiClient.delete(`/orders/${orderId}`);
    return response.data;
};
