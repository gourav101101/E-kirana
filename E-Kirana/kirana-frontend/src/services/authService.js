import apiClient from './api';

export const login = async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        // Store only the safe user object for consistent access across the app
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    // Return the user object directly so callers can reliably read role/name
    return response.data.user;
};

export const register = (userData) => {
    return apiClient.post('/auth/register', userData);
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Reload the page to ensure all application state, including the API client, is reset.
    window.location.reload();
};

/**
 * A safer way to get the current user.
 * It checks if a user exists in localStorage and parses it.
 * If not, it returns null, preventing crashes.
 */
export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    try {
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error("Could not parse user data from localStorage", error);
        return null;
    }
};
