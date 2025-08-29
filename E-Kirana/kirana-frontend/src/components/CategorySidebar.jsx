import React, { useState, useEffect } from 'react';
import { getCategories } from '../services/productService';

const iconFor = (category) => {
    const key = (category || '').toLowerCase();
    if (key.includes('vegetable') || key.includes('veggie')) return (
        <svg className="w-4 h-4 inline-block mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2v6m6 4H6m6 12v-6"/></svg>
    );
    if (key.includes('fruit')) return (
        <svg className="w-4 h-4 inline-block mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 11c0-2 2-4 4-4s4 2 4 4-2 4-4 4-4-2-4-4z"/></svg>
    );
    if (key.includes('dairy')) return (
        <svg className="w-4 h-4 inline-block mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v12m9 3a9 9 0 11-18 0"/></svg>
    );
    if (key.includes('house') || key.includes('clean')) return (
        <svg className="w-4 h-4 inline-block mr-2 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
    );
    if (key.includes('beverage') || key.includes('drink')) return (
        <svg className="w-4 h-4 inline-block mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v10m0 0l3-3m-3 3l-3-3"/></svg>
    );
    // default icon
    return (<svg className="w-4 h-4 inline-block mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>);
};

const CategorySidebar = ({ onSelectCategory, selectedCategory }) => {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoryData = await getCategories();
                setCategories(categoryData);
            } catch (err) {
                setError('Could not load categories.');
                console.error(err);
            }
        };
        fetchCategories();
    }, []);

    const getButtonClasses = (category) => {
        const baseClasses = 'w-full text-left px-4 py-2 rounded-md transition-colors duration-200';
        if (category === selectedCategory) {
            return `${baseClasses} bg-indigo-600 text-white font-semibold`;
        } else {
            return `${baseClasses} text-gray-700 hover:bg-gray-200`;
        }
    };

    if (error) {
        return <div className="p-4 text-red-600">{error}</div>;
    }

    // simple grouping: popular categories first (hardcoded examples)
    const popular = categories.filter(c => ['Fruits', 'Vegetables', 'Dairy', 'Beverages', 'Household'].includes(c));
    const others = categories.filter(c => !popular.includes(c));

    return (
        // allow the sidebar to grow naturally with the number of categories
        <div className="bg-white p-3 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Categories</h3>
            <ul className="space-y-2">
                <li>
                    <button 
                        onClick={() => onSelectCategory(null)} // Pass null to show all products
                        className={getButtonClasses(null)}
                    >
                        {iconFor('all')}All Products
                    </button>
                </li>

                {popular.length > 0 && (
                    <>
                        <li className="mt-2 text-sm text-gray-500 font-medium">Popular</li>
                        {popular.map(category => (
                            <li key={category}>
                                <button
                                    onClick={() => onSelectCategory(category)}
                                    className={getButtonClasses(category)}
                                >
                                    {iconFor(category)}{category}
                                </button>
                            </li>
                        ))}
                    </>
                )}

                {others.map(category => (
                    <li key={category}>
                        <button 
                            onClick={() => onSelectCategory(category)}
                            className={getButtonClasses(category)}
                        >
                            {iconFor(category)}{category}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategorySidebar;
