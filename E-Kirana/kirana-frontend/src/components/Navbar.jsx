import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { logout, getCurrentUser } from '../services/authService';
import { useCart } from '../context/CartContext';

const Navbar = ({ searchQuery = '', onSearch = () => {} }) => {
    const navigate = useNavigate();
    const currentUser = getCurrentUser();
    const { itemCount } = useCart();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-2xl font-bold text-indigo-600">E-Kirana</Link>
                    </div>
                    
                    <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end">
                        {/* Controlled search bar hooked to props */}
                        <div className="max-w-lg w-full lg:max-w-xs">
                            <input
                                value={searchQuery}
                                onChange={(e) => onSearch(e.target.value)}
                                type="search"
                                className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Search for products..."
                            />
                        </div>
                    </div>

                    <div className="flex items-center ml-4">
                        <Link to="/my-orders" className="text-gray-600 hover:text-gray-800 font-medium">
                            My Orders
                        </Link>

                        <Link to="/cart" className="relative ml-4 p-2 text-gray-600 hover:text-gray-800">
                            <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                            {itemCount > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                                    {itemCount}
                                </span>
                            )}
                        </Link>

                        <span className="text-gray-800 ml-4">
                            Welcome, <span className="font-semibold">{currentUser ? currentUser.name : 'Guest'}</span>
                        </span>
                        <button
                            onClick={handleLogout}
                            className="ml-4 px-4 py-2 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
