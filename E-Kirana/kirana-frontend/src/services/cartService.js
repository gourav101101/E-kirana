import apiClient from './api';

/**
 * Fetches the user's current cart from the backend.
 * The user is identified by the JWT token.
 * @returns {Promise<object>} A promise that resolves to the user's cart object.
 */
export const getCart = async () => {
    const response = await apiClient.get('/cart');
    return response.data;
};

/**
 * Adds a product to the user's cart.
 * @param {number} productId - The ID of the product to add.
 * @param {number} quantity - The quantity of the product to add.
 * @returns {Promise<object>} A promise that resolves to the updated cart object.
 */
export const addToCart = async (productId, quantity) => {
    const response = await apiClient.post('/cart/add', { productId, quantity });
    return response.data;
};

/**
 * Updates the quantity of an item already in the cart.
 * @param {number} productId - The ID of the product to update.
 * @param {number} quantity - The new quantity for the product.
 * @returns {Promise<object>} A promise that resolves to the updated cart object.
 */
export const updateCartItem = async (productId, quantity) => {
    const response = await apiClient.put('/cart/update', { productId, quantity });
    return response.data;
};

/**
 * Removes a product from the user's cart.
 * @param {number} productId - The ID of the product to remove.
 * @returns {Promise<object>} A promise that resolves to the updated cart object.
 */
export const removeFromCart = async (productId) => {
    const response = await apiClient.delete('/cart/remove', { data: { productId } });
    return response.data;
};

/**
 * Clears all items from the user's cart on the backend.
 * @returns {Promise<string>} A promise that resolves to a success message.
 */
export const clearCartBackend = async () => {
    const response = await apiClient.delete('/cart/clear');
    return response.data;
};
