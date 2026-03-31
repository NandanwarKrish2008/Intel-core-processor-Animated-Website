'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Globe, Shield } from 'lucide-react';
import Header from '@/components/Header';

const features = [
    {
        icon: <Cpu className="text-primary" size={32} />,
        title: "Pioneering Architecture",
        description: "Reimagining the very foundation of computing with the new Intel Core Ultra processors, built for the era of AI."
    },
    {
        icon: <Zap className="text-primary" size={32} />,
        title: "Unmatched Performance",
        description: "Efficiency meets raw power. Experience a leap in productivity and creativity with our most advanced silicon yet."
    },
    {
        icon: <Globe className="text-primary" size={32} />,
        title: "Global Connectivity",
        description: "Seamlessly connecting the world through high-speed integration and next-generation wireless technologies."
    },
    {
        icon: <Shield className="text-primary" size={32} />,
        title: "Security by Design",
        description: "Hardened at the hardware level, ensuring your data and privacy are protected from the ground up."
    }
];

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-primary/30">
            <Header />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/10 blur-[120px] rounded-full opacity-50 pointer-events-none" />

                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-8xl font-black tracking-tighter mb-6 italic"
                    >
                        INTELLIGENCE <span className="text-primary">EVOLVED</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto font-medium"
                    >
                        At Intel, we&apos;re not just building processors; we&apos;re architecting the future of human potential through silicon excellence and AI innovation.
                    </motion.p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl hover:border-primary/30 transition-all group"
                        >
                            <div className="mb-6 p-4 rounded-2xl bg-white/5 w-fit group-hover:bg-primary/10 transition-colors">
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-4 tracking-tight">{feature.title}</h3>
                            <p className="text-white/50 leading-relaxed font-medium">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Vision Quote */}
            <section className="py-32 px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 opacity-30" />
                <div className="max-w-4xl mx-auto relative z-10">
                    <h2 className="text-3xl md:text-5xl font-black italic mb-8 leading-tight">
                        &quot;The best way to predict the future is to invent it.&quot;
                    </h2>
                    <div className="w-20 h-1 bg-primary mx-auto mb-8" />
                    <p className="text-white/40 uppercase tracking-[0.3em] font-bold text-sm">
                        Driving Innovation Since 1968
                    </p>
                </div>
            </section>

        </main>
    );
}
