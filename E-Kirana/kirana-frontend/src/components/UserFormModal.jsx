import React, { useState, useEffect } from 'react';

const UserFormModal = ({ isOpen, onClose, onSave, editingUser }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('USER');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (editingUser) {
            setName(editingUser.name || '');
            setEmail(editingUser.email || '');
            setRole(editingUser.role || 'USER');
            setPassword(''); // leave blank on edit; only set if admin wants to change
        } else {
            setName('');
            setEmail('');
            setRole('USER');
            setPassword('');
        }
        setShowPassword(false);
        setError('');
    }, [editingUser, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !email || !role) {
            setError('Name, email, and role are required.');
            return;
        }
        // Build payload; include password only if provided (avoid accidental reset on edit)
        const payload = { name, email, role };
        if (!editingUser) {
            if (!password) {
                setError('Password is required for new users.');
                return;
            }
            payload.password = password;
        } else if (password) {
            payload.password = password;
        }
        onSave(payload);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">{editingUser ? 'Edit User' : 'Add User'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        >
                            <option value="USER">Customer</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">{editingUser ? 'New Password (optional)' : 'Password'}</label>
                        <div className="flex">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border rounded-l-md"
                                placeholder={editingUser ? 'Leave blank to keep current password' : ''}
                            />
                            <button
                                type="button"
                                className="px-3 py-2 border border-l-0 rounded-r-md bg-gray-100"
                                onClick={() => setShowPassword((s) => !s)}
                                title={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        {!editingUser && <p className="text-xs text-gray-500 mt-1">Password is required for new users.</p>}
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">{editingUser ? 'Update' : 'Add'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserFormModal;

