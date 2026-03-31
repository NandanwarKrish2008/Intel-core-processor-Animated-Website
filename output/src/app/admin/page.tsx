'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Mail, Trash2, Edit2, Shield, User, X, Check, Search, AlertCircle, Clock, Plus, Upload, CheckCircle2, Package } from 'lucide-react';
import Header from '@/components/Header';
import { cn } from '@/lib/utils';

interface User {
    id: string;
    email: string;
    password?: string;
    role: string;
}

interface Message {
    id: string;
    name: string;
    email: string;
    message: string;
    status: 'unread' | 'read';
    createdAt: string;
}

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category?: string;
    stock?: number;
    image?: string;
    specs: (string | { label: string; value: string })[];
}

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<'users' | 'messages' | 'products'>('users');
    const [users, setUsers] = useState<User[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isAddingUser, setIsAddingUser] = useState(false);
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form states
    const [newUser, setNewUser] = useState({ email: '', password: '', role: 'user' });
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: 0,
        category: '',
        stock: 0,
        image: '',
        specs: []
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, messagesRes, productsRes] = await Promise.all([
                fetch('/api/admin/users', { cache: 'no-store' }),
                fetch('/api/admin/messages', { cache: 'no-store' }),
                fetch('/api/admin/products', { cache: 'no-store' })
            ]);

            if (usersRes.ok) setUsers(await usersRes.json());
            if (messagesRes.ok) setMessages(await messagesRes.json());
            if (productsRes.ok) setProducts(await productsRes.json());
        } catch (error) {
            console.error('Failed to fetch admin data:', error);
            alert('Failed to load dashboard data. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }
        try {
            const res = await fetch(`/api/admin/users/${id}`, {
                method: 'DELETE',
                cache: 'no-store'
            });

            if (res.ok) {
                // Remove from local state immediately for a responsive UI
                setUsers(prev => prev.filter(u => u.id !== id));
                // Optional: Show a subtle toast instead of alert if possible, but keeping alerts as per original design
                alert('User account deleted successfully.');
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to delete user.');
            }
        } catch (error) {
            console.error('[ADMIN] Delete user error:', error);
            alert('Delete failed due to a network error. Please try again.');
        }
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/admin/users/${editingUser?.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    role: editingUser?.role,
                    email: editingUser?.email,
                    password: editingUser?.password // Will be hashed on backend
                })
            });
            if (res.ok && editingUser) {
                setUsers(users.map(u => u.id === editingUser.id ? { ...u, role: editingUser.role, email: editingUser.email } : u));
                setEditingUser(null);
            } else if (!res.ok) {
                const data = await res.json();
                alert(data.error || 'Update failed');
            }
        } catch (error) {
            console.error('Update failed:', error);
            alert('Update failed due to an error');
        }
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });
            if (res.ok) {
                const data = await res.json();
                setUsers([...users, data.user]);
                setIsAddingUser(false);
                setNewUser({ email: '', password: '', role: 'user' });
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to add user');
            }
        } catch (error) {
            console.error('Add user failed:', error);
        }
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct)
            });
            if (res.ok) {
                const data = await res.json();
                setProducts([...products, data.product]);
                setIsAddingProduct(false);
                setNewProduct({ name: '', description: '', price: 0, category: '', stock: 0, image: '', specs: [] });
            }
        } catch (error) {
            console.error('Add product failed:', error);
        }
    };

    const handleDeleteMessage = async (id: string) => {
        if (!confirm('Are you sure you want to delete this support message? This action is permanent.')) {
            return;
        }
        try {
            const res = await fetch(`/api/admin/messages/${id}`, {
                method: 'DELETE',
                cache: 'no-store'
            });

            if (res.ok) {
                // Remove from local state immediately
                setMessages(prev => prev.filter(m => m.id !== id));
                alert('Support message deleted successfully.');
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to delete message.');
            }
        } catch (error) {
            console.error('[ADMIN] Delete message error:', error);
            alert('Delete failed due to a network error. Please try again.');
        }
    };

    const handleToggleMessageStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'unread' ? 'read' : 'unread';
        try {
            const res = await fetch(`/api/admin/messages/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
                cache: 'no-store'
            });
            if (res.ok) {
                setMessages(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m));
            } else {
                alert('Failed to update message status.');
            }
        } catch (error) {
            console.error('Toggle status failed:', error);
        }
    };

    const handleDeleteProduct = async (id: string) => {
        console.log('DEBUG: handleDeleteProduct clicked for id:', id);
        if (!confirm('Are you sure you want to delete this product?')) {
            console.log('DEBUG: Delete product cancelled');
            return;
        }
        try {
            console.log('DEBUG: Sending DELETE request to /api/admin/products/' + id);
            const res = await fetch(`/api/admin/products/${id}`, {
                method: 'DELETE',
                cache: 'no-store'
            });
            console.log('DEBUG: Product delete response status:', res.status);
            if (res.ok) {
                setProducts(prev => prev.filter(p => p.id !== id));
                alert('Product deleted successfully.');
            } else {
                const data = await res.json();
                console.error('DEBUG: Product delete failed:', data.error);
                alert(data.error || 'Delete failed.');
            }
        } catch (error) {
            console.error('DEBUG: Product delete fetch error:', error);
            alert('Delete failed due to a network error.');
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'edit' | 'new') => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                if (target === 'edit') {
                    setEditingProduct(prev => prev ? { ...prev, image: data.url } : null);
                } else if (target === 'new') {
                    setNewProduct({ ...newProduct, image: data.url });
                }
            }
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleUpdateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/admin/products/${editingProduct?.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingProduct)
            });
            if (res.ok && editingProduct) {
                setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
                setEditingProduct(null);
            }
        } catch (error) {
            console.error('Product update failed:', error);
        }
    };

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredMessages = messages.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full"
                />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#050505] text-white selection:bg-primary/30">
            <Header />

            <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-black italic tracking-tighter"
                        >
                            ADMIN <span className="text-primary">PANEL</span>
                        </motion.h1>
                        <p className="text-white/40 font-medium mt-2">Manage users, security, and support requests.</p>
                    </div>

                    <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-xl">
                        <button
                            onClick={() => setActiveTab('users')}
                            className={cn(
                                "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all text-sm",
                                activeTab === 'users' ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"
                            )}
                        >
                            <Users size={18} /> USERS
                        </button>
                        <button
                            onClick={() => setActiveTab('messages')}
                            className={cn(
                                "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all text-sm",
                                activeTab === 'messages' ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"
                            )}
                        >
                            <Mail size={18} /> MESSAGES
                            {messages.length > 0 && (
                                <span className="bg-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full ml-1">
                                    {messages.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('products')}
                            className={cn(
                                "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all text-sm",
                                activeTab === 'products' ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"
                            )}
                        >
                            <Package size={18} /> PRODUCTS
                        </button>
                    </div>

                    <div className="flex gap-4">
                        {activeTab === 'users' && (
                            <button
                                onClick={() => setIsAddingUser(true)}
                                className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
                            >
                                <Plus size={18} /> ADD USER
                            </button>
                        )}
                        {activeTab === 'products' && (
                            <button
                                onClick={() => setIsAddingProduct(true)}
                                className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
                            >
                                <Plus size={18} /> ADD PRODUCT
                            </button>
                        )}
                    </div>
                </div>

                <div className="relative mb-8 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder={
                            activeTab === 'users' ? "Search users by email or ID..." :
                                activeTab === 'messages' ? "Search messages..." :
                                    "Search products by name or ID..."
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-16 text-white focus:outline-none focus:border-primary/50 transition-all font-medium backdrop-blur-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'users' ? (
                        <motion.div
                            key="users"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {filteredUsers.map((u) => (
                                <motion.div
                                    key={u.id}
                                    layoutId={u.id}
                                    className="bg-white/2 border border-white/10 rounded-[32px] p-8 hover:border-primary/30 transition-all group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="flex items-start justify-between mb-6">
                                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                            {u.role === 'admin' ? <Shield size={28} /> : <User size={28} />}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setEditingUser(u)}
                                                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-white/40 hover:text-white"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(u.id)}
                                                className="p-3 bg-white/5 hover:bg-red-500/10 rounded-xl transition-colors text-white/40 hover:text-red-400"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Email Address</p>
                                            <p className="font-bold truncate">{u.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Encrypted Password</p>
                                            <p className="text-xs font-mono text-white/40 truncate bg-black/40 p-2 rounded-lg border border-white/5">
                                                {u.password}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest",
                                                u.role === 'admin' ? "bg-primary/20 text-primary border border-primary/20" : "bg-white/10 text-white/40 border border-white/10"
                                            )}>
                                                {u.role}
                                            </span>
                                            <span className="text-[10px] font-bold text-white/10 uppercase tracking-widest ml-auto">ID: {u.id}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : activeTab === 'messages' ? (
                        <motion.div
                            key="messages"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-4"
                        >
                            {filteredMessages.length === 0 ? (
                                <div className="text-center py-20 bg-white/2 border border-white/10 border-dashed rounded-[40px]">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-white/20 mx-auto mb-4">
                                        <AlertCircle size={32} />
                                    </div>
                                    <p className="text-white/40 font-bold">No support messages found.</p>
                                </div>
                            ) : (
                                filteredMessages.map((m) => (
                                    <div key={m.id} className={cn(
                                        "bg-white/2 border p-8 rounded-[32px] transition-all relative overflow-hidden group",
                                        m.status === 'unread' ? "border-primary/30" : "border-white/10"
                                    )}>
                                        {m.status === 'unread' && (
                                            <div className="absolute top-0 right-0 px-4 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-bl-xl">
                                                New
                                            </div>
                                        )}
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                                                    m.status === 'unread' ? "bg-primary text-white" : "bg-white/5 text-white/40"
                                                )}>
                                                    <Mail size={24} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-black text-lg leading-none mb-1">{m.name}</h3>
                                                        {m.status === 'read' && <CheckCircle2 size={16} className="text-primary" />}
                                                    </div>
                                                    <p className="text-white/40 text-sm font-medium">{m.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-2 text-white/20 bg-white/3 px-4 py-2 rounded-xl border border-white/5">
                                                    <Clock size={14} />
                                                    <span className="text-xs font-bold">{new Date(m.createdAt).toLocaleString()}</span>
                                                </div>
                                                <button
                                                    onClick={() => handleToggleMessageStatus(m.id, m.status)}
                                                    className={cn(
                                                        "p-3 rounded-xl border transition-all",
                                                        m.status === 'unread'
                                                            ? "bg-white text-black border-white hover:bg-primary hover:border-primary hover:text-white"
                                                            : "bg-white/5 border-white/10 text-white/40 hover:text-white hover:border-white/20"
                                                    )}
                                                    title={m.status === 'unread' ? "Mark as Read" : "Mark as Unread"}
                                                >
                                                    {m.status === 'unread' ? <Check size={18} /> : <Mail size={18} />}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteMessage(m.id)}
                                                    className="p-3 bg-red-500/10 border border-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
                                            <p className="text-white/70 leading-relaxed font-medium">{m.message}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="products"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {filteredProducts.map((p) => (
                                <motion.div
                                    key={p.id}
                                    layoutId={p.id}
                                    className="bg-white/2 border border-white/10 rounded-[32px] p-8 hover:border-primary/30 transition-all group relative overflow-hidden"
                                >
                                    <div className="flex items-start justify-between mb-6">
                                        {p.image ? (
                                            <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl relative">
                                                <img src={p.image} alt={p.name} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                                            </div>
                                        ) : (
                                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                                <Package size={28} />
                                            </div>
                                        )}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setEditingProduct(p)}
                                                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-white/40 hover:text-white"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProduct(p.id)}
                                                className="p-3 bg-white/5 hover:bg-red-500/10 rounded-xl transition-colors text-white/40 hover:text-red-400"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-black bg-white/5 border border-white/5 px-2 py-0.5 rounded text-white/40 uppercase tracking-widest">{p.category}</span>
                                            {p.stock !== undefined && p.stock <= 5 && (
                                                <span className="text-[10px] font-black text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 uppercase tracking-widest">Low Stock</span>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Product Name</p>
                                            <p className="font-bold truncate text-xl tracking-tight">{p.name}</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Price</p>
                                                <p className="font-black text-2xl text-primary tracking-tighter">${p.price}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Stock</p>
                                                <p className="font-black text-lg">{p.stock}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                                            <span className="text-[10px] font-bold text-white/10 uppercase tracking-widest">ID: {p.id}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Edit User Modal */}
            <AnimatePresence>
                {editingUser && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                            onClick={() => setEditingUser(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[40px] p-10 shadow-2xl"
                        >
                            <button
                                onClick={() => setEditingUser(null)}
                                className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <h2 className="text-3xl font-black italic tracking-tighter mb-8">EDIT <span className="text-primary">USER</span></h2>

                            <form onSubmit={handleUpdateUser} className="space-y-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-2">Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 font-bold focus:border-primary/50 transition-all"
                                        value={editingUser.email}
                                        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-2">New Password (Leave blank to keep current)</label>
                                    <input
                                        type="password"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 font-bold focus:border-primary/50 transition-all"
                                        value={editingUser.password || ''}
                                        onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-2">User Role</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setEditingUser({ ...editingUser, role: 'user' })}
                                            className={cn(
                                                "p-6 rounded-3xl border transition-all flex flex-col items-center gap-3",
                                                editingUser.role === 'user' ? "bg-primary/10 border-primary text-primary" : "bg-white/5 border-white/10 text-white/40 hover:border-white/20"
                                            )}
                                        >
                                            <User size={32} />
                                            <span className="font-black text-xs tracking-widest">USER</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setEditingUser({ ...editingUser, role: 'admin' })}
                                            className={cn(
                                                "p-6 rounded-3xl border transition-all flex flex-col items-center gap-3",
                                                editingUser.role === 'admin' ? "bg-primary/10 border-primary text-primary" : "bg-white/5 border-white/10 text-white/40 hover:border-white/20"
                                            )}
                                        >
                                            <Shield size={32} />
                                            <span className="font-black text-xs tracking-widest">ADMIN</span>
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-white text-black font-black py-6 rounded-[24px] hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 group"
                                >
                                    <Check size={20} /> SAVE CHANGES
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Product Modal */}
            <AnimatePresence>
                {editingProduct && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                            onClick={() => setEditingProduct(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[40px] p-10 shadow-2xl overflow-y-auto max-h-[90vh]"
                        >
                            <button
                                onClick={() => setEditingProduct(null)}
                                className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <h2 className="text-3xl font-black italic tracking-tighter mb-8">EDIT <span className="text-primary">PRODUCT</span></h2>

                            <form onSubmit={handleUpdateProduct} className="space-y-6">
                                <div className="space-y-2 text-center mb-6">
                                    <div className="relative inline-block group/upload">
                                        <div className="w-32 h-32 rounded-[32px] overflow-hidden border-2 border-white/10 bg-black flex items-center justify-center relative transition-all group-hover/upload:border-primary/50">
                                            {editingProduct.image ? (
                                                <img src={editingProduct.image} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <Package size={48} className="text-white/20" />
                                            )}
                                            {uploading && (
                                                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                                                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
                                                </div>
                                            )}
                                        </div>
                                        <label className="absolute -bottom-2 -right-2 p-3 bg-white text-black rounded-2xl cursor-pointer hover:bg-primary hover:text-white transition-all shadow-xl">
                                            <Upload size={18} />
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'edit')} />
                                        </label>
                                    </div>
                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-4">Product Thumbnail</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-2">Name</label>
                                        <input
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 font-bold focus:border-primary/50 transition-all"
                                            value={editingProduct.name}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-2">Category</label>
                                        <input
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 font-bold focus:border-primary/50 transition-all"
                                            value={editingProduct.category}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                                            placeholder="e.g. CPU, GPU"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-2">Price ($)</label>
                                        <input
                                            type="number"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 font-bold focus:border-primary/50 transition-all"
                                            value={editingProduct.price}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-2">Stock</label>
                                        <input
                                            type="number"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 font-bold focus:border-primary/50 transition-all"
                                            value={editingProduct.stock}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-2">Description</label>
                                    <textarea
                                        rows={3}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 font-bold resize-none focus:border-primary/50 transition-all"
                                        value={editingProduct.description}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-white text-black font-black py-6 rounded-[24px] hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 group"
                                >
                                    <Check size={20} /> SAVE PRODUCT
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add User Modal */}
            <AnimatePresence>
                {isAddingUser && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsAddingUser(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[40px] p-10 shadow-2xl">
                            <button onClick={() => setIsAddingUser(false)} className="absolute top-8 right-8 text-white/20 hover:text-white"><X size={24} /></button>
                            <h2 className="text-3xl font-black italic tracking-tighter mb-8 text-primary">ADD NEW USER</h2>
                            <form onSubmit={handleAddUser} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-2">Email Address</label>
                                    <input required type="email" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 font-bold" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-2">Password</label>
                                    <input required type="password" title="At least 8 characters, one number and one special character" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 font-bold" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <button type="button" onClick={() => setNewUser({ ...newUser, role: 'user' })} className={cn("p-4 rounded-2xl border transition-all font-black text-xs tracking-widest", newUser.role === 'user' ? "bg-primary/10 border-primary text-primary" : "bg-white/5 border-white/10 text-white/40")}>USER</button>
                                    <button type="button" onClick={() => setNewUser({ ...newUser, role: 'admin' })} className={cn("p-4 rounded-2xl border transition-all font-black text-xs tracking-widest", newUser.role === 'admin' ? "bg-primary/10 border-primary text-primary" : "bg-white/5 border-white/10 text-white/40")}>ADMIN</button>
                                </div>
                                <button type="submit" className="w-full bg-white text-black font-black py-6 rounded-[24px] hover:bg-primary hover:text-white transition-all">CREATE ACCOUNT</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add Product Modal */}
            <AnimatePresence>
                {isAddingProduct && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsAddingProduct(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[40px] p-10 shadow-2xl overflow-y-auto max-h-[90vh]">
                            <button onClick={() => setIsAddingProduct(false)} className="absolute top-8 right-8 text-white/20 hover:text-white"><X size={24} /></button>
                            <h2 className="text-3xl font-black italic tracking-tighter mb-8 text-primary">ADD NEW PRODUCT</h2>
                            <form onSubmit={handleAddProduct} className="space-y-6">
                                <div className="flex justify-center mb-8">
                                    <div className="relative group/upload">
                                        <div className="w-32 h-32 rounded-[32px] overflow-hidden border-2 border-dashed border-white/10 bg-black/20 flex flex-col items-center justify-center relative transition-all group-hover/upload:border-primary/50">
                                            {newProduct.image ? (
                                                <img src={newProduct.image} className="w-full h-full object-cover" />
                                            ) : (
                                                <>
                                                    <Upload size={32} className="text-white/20 mb-2" />
                                                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">UPLOAD</span>
                                                </>
                                            )}
                                        </div>
                                        <label className="absolute -bottom-2 -right-2 p-3 bg-white text-black rounded-2xl cursor-pointer hover:bg-primary hover:text-white transition-all shadow-xl">
                                            <Plus size={18} />
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'new')} />
                                        </label>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2"><label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-2">Name</label>
                                        <input required className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 font-bold" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} /></div>
                                    <div className="space-y-2"><label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-2">Category</label>
                                        <input required className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 font-bold" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} placeholder="e.g. CPU" /></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2"><label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-2">Price ($)</label>
                                        <input required type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 font-bold" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })} /></div>
                                    <div className="space-y-2"><label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-2">Stock</label>
                                        <input required type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 font-bold" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })} /></div>
                                </div>
                                <div className="space-y-2"><label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-2">Description</label>
                                    <textarea required rows={3} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 font-bold resize-none" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} /></div>
                                <button type="submit" className="w-full bg-white text-black font-black py-6 rounded-[24px] hover:bg-primary hover:text-white transition-all">PUBLISH PRODUCT</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
}
