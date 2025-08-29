import apiClient from './api';

// --- FETCH DATA ---

export const getProducts = async (category, name) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (name) params.append('name', name);
    const response = await apiClient.get(`/products?${params.toString()}`);
    return response.data.content;
};

export const getCategories = async () => {
    const response = await apiClient.get('/products/categories');
    return response.data;
};

export const getProductById = async (id) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
};

export const getFeaturedProducts = async () => {
    const response = await apiClient.get('/products/featured');
    return response.data;
};

// --- MANAGE DATA ---

export const createProduct = async (productData) => {
    const response = await apiClient.post('/products', productData);
    return response.data;
};

export const updateProduct = async (id, productData) => {
    const response = await apiClient.put(`/products/${id}`, productData);
    return response.data;
};

export const deleteProduct = async (id) => {
    await apiClient.delete(`/products/${id}`);
};
