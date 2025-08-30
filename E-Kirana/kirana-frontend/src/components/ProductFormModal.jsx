import React, { useState, useEffect } from 'react';

const ProductFormModal = ({ isOpen, onClose, onSave, product }) => {
    const empty = {
        name: '', category: '', price: '', oldPrice: '', stock: '', description: '', imageUrl: '', images: '',
        featured: false, bestseller: false, isNew: false, rating: '', reviewsCount: ''
    };
    const [formData, setFormData] = useState(empty);
    const [errors, setErrors] = useState({});

    // When the modal opens, if a product is passed, populate the form for editing.
    useEffect(() => {
        if (product) {
            const {
                name = '', category = '', price = '', oldPrice = '', stock = '', description = '', imageUrl = '',
                images = [], featured = false, bestseller = false, isNew = false, rating = 0, reviewsCount = 0
            } = product;
            setFormData({
                name, category, price: price ?? '', oldPrice: oldPrice ?? '', stock: stock ?? '', description: description ?? '', imageUrl: imageUrl ?? '',
                images: Array.isArray(images) ? images.join(',') : (images || ''),
                featured: !!featured, bestseller: !!bestseller, isNew: !!isNew, rating: rating ?? '', reviewsCount: reviewsCount ?? ''
            });
        } else {
            setFormData(empty);
        }
        setErrors({});
    }, [product, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Name is required.';
        if (!formData.category) newErrors.category = 'Category is required.';
        if (formData.price === '' || Number(formData.price) <= 0) newErrors.price = 'Price must be positive.';
        if (formData.oldPrice !== '' && Number(formData.oldPrice) < 0) newErrors.oldPrice = 'Old price cannot be negative.';
        if (formData.stock === '' || Number(formData.stock) < 0) newErrors.stock = 'Stock cannot be negative.';
        if (!formData.description) newErrors.description = 'Description is required.';
        if (!formData.imageUrl && !formData.images) newErrors.imageUrl = 'At least one image URL is required.';
        if (formData.rating !== '' && (Number(formData.rating) < 0 || Number(formData.rating) > 5)) newErrors.rating = 'Rating must be between 0 and 5.';
        if (formData.reviewsCount !== '' && Number(formData.reviewsCount) < 0) newErrors.reviewsCount = 'Reviews count cannot be negative.';
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        // Convert numeric fields and arrays
        const payload = {
            ...product,
            name: formData.name,
            category: formData.category,
            price: Number(formData.price),
            oldPrice: formData.oldPrice === '' ? null : Number(formData.oldPrice),
            stock: Number(formData.stock),
            description: formData.description,
            imageUrl: formData.imageUrl || (formData.images ? formData.images.split(',')[0].trim() : ''),
            images: formData.images ? formData.images.split(',').map(s => s.trim()).filter(Boolean) : [],
            featured: !!formData.featured,
            bestseller: !!formData.bestseller,
            isNew: !!formData.isNew,
            rating: formData.rating === '' ? null : Number(formData.rating),
            reviewsCount: formData.reviewsCount === '' ? 0 : Number(formData.reviewsCount)
        };
        onSave(payload);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">{product ? 'Edit Product' : 'Add New Product'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border rounded-md px-2 py-1" />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <input name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full border rounded-md px-2 py-1" />
                            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Price</label>
                            <input name="price" value={formData.price} onChange={handleChange} type="number" step="0.01" className="mt-1 block w-full border rounded-md px-2 py-1" />
                            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Old Price (optional)</label>
                            <input name="oldPrice" value={formData.oldPrice} onChange={handleChange} type="number" step="0.01" className="mt-1 block w-full border rounded-md px-2 py-1" />
                            {errors.oldPrice && <p className="text-red-500 text-xs mt-1">{errors.oldPrice}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Stock</label>
                            <input name="stock" value={formData.stock} onChange={handleChange} type="number" className="mt-1 block w-full border rounded-md px-2 py-1" />
                            {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Rating (0-5)</label>
                            <input name="rating" value={formData.rating} onChange={handleChange} type="number" step="0.1" min="0" max="5" className="mt-1 block w-full border rounded-md px-2 py-1" />
                            {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Reviews Count</label>
                            <input name="reviewsCount" value={formData.reviewsCount} onChange={handleChange} type="number" className="mt-1 block w-full border rounded-md px-2 py-1" />
                            {errors.reviewsCount && <p className="text-red-500 text-xs mt-1">{errors.reviewsCount}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Image URL (primary)</label>
                        <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} type="url" placeholder="https://..." className="mt-1 block w-full border rounded-md px-2 py-1" />
                        {errors.imageUrl && <p className="text-red-500 text-xs mt-1">{errors.imageUrl}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Additional images (comma separated URLs)</label>
                        <input name="images" value={formData.images} onChange={handleChange} placeholder="https://..., https://..." className="mt-1 block w-full border rounded-md px-2 py-1" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="mt-1 block w-full border rounded-md px-2 py-1" />
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                    </div>

                    <div className="flex items-center gap-4">
                        <label className="inline-flex items-center">
                            <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="mr-2" />
                            <span className="text-sm">Featured</span>
                        </label>

                        <label className="inline-flex items-center">
                            <input type="checkbox" name="bestseller" checked={formData.bestseller} onChange={handleChange} className="mr-2" />
                            <span className="text-sm">Bestseller</span>
                        </label>

                        <label className="inline-flex items-center">
                            <input type="checkbox" name="isNew" checked={formData.isNew} onChange={handleChange} className="mr-2" />
                            <span className="text-sm">New</span>
                        </label>
                    </div>

                    {/* sticky footer inside modal so actions remain visible on small/overflowing content */}
                    <div className="pt-6">
                        <div className="sticky bottom-0 bg-white/90 backdrop-blur-sm py-3 -mx-6 px-6 flex justify-end space-x-4">
                            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductFormModal;
