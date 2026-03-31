'use client';

import React, { useEffect, useState } from 'react';
import { Product, productsLog } from '@/lib/db';
import { Cpu, Zap, Activity, Brain } from 'lucide-react';

const ProductSpecs = () => {
    const [products, setProducts] = useState<Product[]>(productsLog);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/products')
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
                setLoading(false);
            })
            .catch(() => {
                // Fallback to imported data for static exports
                setProducts(productsLog);
                setLoading(false);
            });
    }, []);


    if (loading) return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 w-full max-w-7xl px-4 md:px-6 animate-pulse">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-48 border border-white/5 rounded-3xl bg-white/5" />
            ))}
        </div>
    );

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 w-full max-w-7xl px-4 md:px-6">
            {products[0]?.specs.map((spec, index) => (
                <div
                    key={index}
                    className="reveal p-6 md:p-8 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all group"
                >
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        {index === 0 && <Cpu className="text-primary" size={20} />}
                        {index === 1 && <Activity className="text-secondary" size={20} />}
                        {index === 2 && <Zap className="text-white" size={20} />}
                        {index === 3 && <Brain className="text-primary" size={20} />}
                    </div>
                    <h4 className="text-white/40 uppercase tracking-widest text-[10px] md:text-xs font-bold mb-2">
                        {spec.label}
                    </h4>
                    <p className="text-2xl md:text-3xl font-black text-white">
                        {spec.value}
                    </p>
                </div>
            ))}
        </div>
    );

};

export default ProductSpecs;
