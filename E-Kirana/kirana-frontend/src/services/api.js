import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

// This interceptor runs before every request.
apiClient.interceptors.request.use(
    (config) => {
        // Get the token from local storage on every request
        const token = localStorage.getItem('token');
        
        // If the token exists, add it to the Authorization header
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        } else {
            // Optional: handle requests that are supposed to be authenticated but have no token
            // For example, you could delete the header to ensure no invalid token is sent
            delete config.headers['Authorization'];
        }
        
        return config;
    },
    (error) => {
        // Handle request errors
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

export default apiClient;
