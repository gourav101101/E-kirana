import apiClient from './api';

// --- ADMIN-FACING METHODS ---

/**
 * Fetches a list of all users from the backend.
 * This is an admin-only operation.
 * @returns {Promise<Array>} A promise that resolves to an array of user objects.
 */
export const getAllUsers = async () => {
    const response = await apiClient.get('/admin/users');
    return response.data;
};

export const createUser = async (userData) => {
    const response = await apiClient.post('/admin/users', userData);
    return response.data;
};

export const updateUser = async (userId, userData) => {
    const response = await apiClient.put(`/admin/users/${userId}`, userData);
    return response.data;
};

export const deleteUser = async (userId) => {
    const response = await apiClient.delete(`/admin/users/${userId}`);
    return response.data;
};
