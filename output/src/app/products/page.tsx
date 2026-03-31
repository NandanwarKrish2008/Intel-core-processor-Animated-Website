'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu, Layers, Activity, Zap } from 'lucide-react';
import Header from '@/components/Header';
import { Product } from '@/lib/db';

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products');
                const data = await res.json();
                setProducts(data);
            } catch (_e) {
                console.error('Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const getIcon = (idx: number) => {
        const icons = [
            <Cpu key="cpu" size={24} />,
            <Zap key="zap" size={24} />,
            <Layers key="layers" size={24} />,
            <Activity key="activity" size={24} />
        ];
        return icons[idx % icons.length];
    };

    return (
        <main className="min-h-screen bg-black text-white">
            <Header />

            <section className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-16">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-8xl font-black italic tracking-tighter mb-4"
                        >
                            THE <span className="text-primary">ULTRA</span> LINEUP
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-white/50 max-w-2xl font-medium"
                        >
                            Discover the perfect balance of AI acceleration, high-performance graphics, and power efficiency.
                        </motion.p>
                    </header>

                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {products.map((product, idx) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group relative overflow-hidden bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[40px] p-8 hover:border-primary/50 transition-all"
                                >
                                    <div className="absolute top-0 right-0 p-8 text-primary group-hover:scale-110 transition-transform">
                                        {getIcon(idx)}
                                    </div>

                                    <div className="mb-12">
                                        <h3 className="text-3xl font-black mb-2 tracking-tight line-clamp-2">{product.name}</h3>
                                        <p className="text-white/40 font-bold uppercase tracking-widest text-xs mb-4">Intel Core Ultra Series</p>
                                        <p className="text-white/60 font-medium leading-relaxed">{product.description}</p>
                                    </div>

                                    <div className="space-y-4 mb-10">
                                        {product.specs.slice(0, 3).map((spec, sIdx) => (
                                            <div key={sIdx} className="flex justify-between items-center py-3 border-b border-white/5">
                                                <span className="text-xs font-bold text-white/30 uppercase tracking-widest">{spec.label}</span>
                                                <span className="text-sm font-bold text-white/80">{spec.value}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="text-3xl font-black italic">${product.price}</span>
                                        <button className="flex items-center gap-2 px-6 py-3 bg-white text-black font-black rounded-2xl hover:bg-primary hover:text-white transition-all text-sm group/btn">
                                            BUY NOW
                                            <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

        </main>
    );
}
