'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, MessageCircle, BookOpen, ShieldCheck } from 'lucide-react';
import Header from '@/components/Header';

const faqs = [
    {
        question: "What makes Intel Core Ultra different from previous generations?",
        answer: "Intel Core Ultra features a new brand of high-performance architecture with integrated AI acceleration (NPU), a discrete-level GPU, and a focus on power efficiency for next-gen AI PCs."
    },
    {
        question: "How do I update my drivers for optimal AI performance?",
        answer: "You can download the latest drivers through Intel® Driver & Support Assistant or by visiting our official download center. Keeping your NPU and GPU drivers updated is crucial for AI workloads."
    },
    {
        question: "What is the warranty period for new processors?",
        answer: "Most Intel boxed processors carry a three-year limited warranty. For tray processors or integrated systems, please check with your original equipment manufacturer (OEM)."
    },
    {
        question: "Are these processors compatible with my existing motherboard?",
        answer: "Intel Core Ultra processors generally require the latest generation of chipsets and motherboards. We recommend checking the motherboard's compatibility list at our support site."
    }
];

export default function SupportPage() {
    const [openIdx, setOpenIdx] = useState<number | null>(0);

    return (
        <main className="min-h-screen bg-black text-white selection:bg-primary/30">
            <Header />

            <section className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary mx-auto mb-6"
                        >
                            <HelpCircle size={32} />
                        </motion.div>
                        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter mb-4">SUPPORT CENTER</h1>
                        <p className="text-white/40 font-medium">Find answers and get help with your Intel technologies.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        {[
                            { icon: <BookOpen />, title: "Guides", desc: "Tutorials & Manuals" },
                            { icon: <MessageCircle />, title: "Community", desc: "Forums & Discussions" },
                            { icon: <ShieldCheck />, title: "Warranty", desc: "Check Coverage" }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:border-primary/30 transition-all cursor-pointer group">
                                <div className="text-primary mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                                <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                                <p className="text-white/40 text-sm font-medium">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-black italic mb-8 tracking-tight">FREQUENTLY ASKED QUESTIONS</h2>
                        {faqs.map((faq, idx) => (
                            <div
                                key={idx}
                                className="border border-white/10 rounded-3xl overflow-hidden bg-white/2 backdrop-blur-sm"
                            >
                                <button
                                    onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                                    className="w-full p-6 text-left flex justify-between items-center transition-colors hover:bg-white/5"
                                >
                                    <span className="font-bold text-lg pr-8">{faq.question}</span>
                                    <ChevronDown
                                        size={20}
                                        className={`text-primary transition-transform duration-300 ${openIdx === idx ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                <AnimatePresence>
                                    {openIdx === idx && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-6 pt-0 text-white/50 leading-relaxed font-medium">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
