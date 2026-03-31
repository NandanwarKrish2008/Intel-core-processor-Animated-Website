'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Cpu, Zap, Eye, Battery } from 'lucide-react';
import Header from '@/components/Header';

const features = [
    {
        icon: <Brain className="text-primary" size={40} />,
        title: "AI Boost NPU",
        description: "Engage dedicated AI acceleration for high-efficiency processing of complex workloads without draining battery life."
    },
    {
        icon: <Sparkles className="text-primary" size={40} />,
        title: "Creator Intelligence",
        description: "Intelligent background blur, noise cancellation, and automated video editing powered by hardware-level AI."
    },
    {
        icon: <Cpu className="text-primary" size={40} />,
        title: "3D Performance Hybrid",
        description: "Optimized performance and efficiency cores working in tandem for a seamless multi-tasking experience."
    },
    {
        icon: <Eye className="text-primary" size={40} />,
        title: "Arc Graphics",
        description: "Built-in high-performance graphics that rival discrete cards, enabling gaming and creative work on the go."
    },
    {
        icon: <Battery className="text-primary" size={40} />,
        title: "Low Power Island",
        description: "A secondary, ultra-efficient computing block for background tasks, extending battery life to unprecedented levels."
    },
    {
        icon: <Zap className="text-primary" size={40} />,
        title: "Thunderbolt™ 4",
        description: "Next-gen connectivity with 40Gbps bandwidth for lightning-fast data transfers and multi-monitor setups."
    }
];

export default function FeaturesPage() {
    return (
        <main className="min-h-screen bg-black text-white">
            <Header />

            <section className="pt-32 pb-20 px-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(0,113,197,0.1)_0%,transparent_50%)] pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-24">
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-6xl md:text-9xl font-black italic tracking-tighter mb-8 bg-gradient-to-b from-white to-white/20 bg-clip-text text-transparent"
                        >
                            ULTRA <span className="text-primary">TECH</span>
                        </motion.h1>
                        <p className="text-xl text-white/50 max-w-2xl mx-auto font-medium">
                            Exploring the breakthrough innovations that define the Intel Core Ultra architecture.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-10 rounded-[40px] bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all group flex flex-col items-center text-center"
                            >
                                <div className="mb-8 p-6 rounded-3xl bg-primary/10 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-black italic mb-4 tracking-tight uppercase">{feature.title}</h3>
                                <p className="text-white/40 leading-relaxed font-medium">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto rounded-[60px] bg-gradient-to-br from-primary/20 to-transparent border border-white/5 p-12 md:p-24 text-center">
                    <h2 className="text-4xl md:text-6xl font-black italic mb-8 tracking-tighter uppercase">Ready for the future?</h2>
                    <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto font-medium">Join the millions of creators and gamers who have already made the switch to Intel Core Ultra.</p>
                    <a href="/products" className="inline-flex items-center gap-4 px-12 py-6 bg-white text-black font-black rounded-3xl hover:bg-primary hover:text-white transition-all text-sm uppercase tracking-widest">
                        Explore Products
                    </a>
                </div>
            </section>
        </main>
    );
}
