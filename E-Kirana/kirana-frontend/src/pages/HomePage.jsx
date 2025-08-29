import React, { useState } from 'react';
import ProductList from '../components/ProductList';
import CategorySidebar from '../components/CategorySidebar';
import Navbar from '../components/Navbar';
import CategoriesBar from '../components/CategoriesBar';
import FeaturedCarousel from '../components/FeaturedCarousel';

const HomePage = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const scrollToProducts = (e) => {
        e.preventDefault();
        const el = document.getElementById('products');
        if (!el) return;
        // find nav height if sticky
        const nav = document.querySelector('nav');
        const navHeight = nav ? nav.getBoundingClientRect().height : 0;
        const top = el.getBoundingClientRect().top + window.pageYOffset - navHeight - 12; // small offset
        window.scrollTo({ top, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/*<Navbar searchQuery={searchQuery} onSearch={setSearchQuery} />*/}

            {/* Hero */}
            <header className="bg-gradient-to-r from-indigo-600 to-indigo-400 text-white">
                <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-8">
                    <div className="lg:w-1/2">
                        <h1 className="text-4xl font-extrabold mb-4">Fresh groceries delivered to your door</h1>
                        <p className="text-lg opacity-90 mb-6">Quality produce, daily essentials and household needs — all in one place. Fast delivery and fair prices.</p>
                        <div className="flex gap-3">
                            <button onClick={scrollToProducts} className="inline-block px-6 py-3 bg-white text-indigo-600 font-semibold rounded shadow hover:bg-gray-100">Shop Now</button>
                            <a href="/cart" className="inline-block px-6 py-3 border border-white text-white rounded hover:bg-white/10">View Cart</a>
                        </div>
                    </div>
                    <div className="lg:w-1/2 w-full" >
                        <FeaturedCarousel />
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8" >
                {/* Horizontal categories bar for small screens */}
                <div className="mb-6 lg:hidden" >
                    <CategoriesBar selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
                </div>

                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    {/* Sidebar on large screens */}
                    <aside className="hidden lg:block lg:col-span-3 xl:col-span-2">
                        <CategorySidebar
                            selectedCategory={selectedCategory}
                            onSelectCategory={setSelectedCategory}
                        />
                    </aside>

                    <section id="products" className="lg:col-span-9 xl:col-span-10 scroll-mt-24">
                        {/* Section header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800">Explore Products</h2>
                            <div className="text-sm text-gray-500">Showing {selectedCategory ? `${selectedCategory}` : 'all categories'}</div>
                        </div>

                        {/* Products grid */}
                        <div >
                            <ProductList
                                category={selectedCategory}
                                searchQuery={searchQuery}
                            />
                        </div>

                        {/* Promotional / Info cards */}
                        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-white rounded-lg shadow flex items-start gap-4">
                                <div className="p-3 bg-indigo-100 rounded">
                                    <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18"/></svg>
                                </div>
                                <div>
                                    <h4 className="font-semibold">Wide Selection</h4>
                                    <p className="text-sm text-gray-500">Hundreds of items across categories, updated daily.</p>
                                </div>
                            </div>

                            <div className="p-4 bg-white rounded-lg shadow flex items-start gap-4">
                                <div className="p-3 bg-green-100 rounded">
                                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                                </div>
                                <div>
                                    <h4 className="font-semibold">Quality Assured</h4>
                                    <p className="text-sm text-gray-500">Verified vendors and quality checks on fresh produce.</p>
                                </div>
                            </div>

                            <div className="p-4 bg-white rounded-lg shadow flex items-start gap-4">
                                <div className="p-3 bg-yellow-100 rounded">
                                    <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h18v4H3z"/></svg>
                                </div>
                                <div>
                                    <h4 className="font-semibold">Fast Delivery</h4>
                                    <p className="text-sm text-gray-500">Same-day delivery available in select areas.</p>
                                </div>
                            </div>
                        </div>

                    </section>
                </div>
            </main>
        </div>
    );
};

export default HomePage;
