'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, FileText, Lock } from 'lucide-react';
import Header from '@/components/Header';

const sections = [
    {
        id: 'privacy',
        icon: <Shield className="text-primary" />,
        title: "Privacy Policy",
        content: `Your privacy is important to us. This Privacy Policy explains how Intel Corporation collects, uses, and protects your personal data when you use our website and services.
        
        We collect information that you provide directly to us, such as when you create an account, sign up for our newsletter, or contact us for support. We also collect information automatically through cookies and similar technologies to improve your experience and analyze how our services are used.
        
        Intel does not sell your personal information to third parties. We use your data to provide and improve our products, communicate with you, and ensure the security of our services.`
    },
    {
        id: 'terms',
        icon: <FileText className="text-primary" />,
        title: "Terms of Use",
        content: `By accessing or using the Intel website, you agree to be bound by these Terms of Use and all applicable laws and regulations.
        
        The content on this website, including text, graphics, logos, and software, is the property of Intel or its content suppliers and is protected by intellectual property laws. You may use the website for personal, non-commercial purposes only.
        
        You agree not to use the website for any unlawful purpose or in any way that could damage, disable, or impair the website's functionality.`
    },
    {
        id: 'cookies',
        icon: <Lock className="text-primary" />,
        title: "Cookie Policy",
        content: `We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept", you consent to our use of cookies.`
    }
];

export default function LegalPage() {
    return (
        <main className="min-h-screen bg-black text-white">
            <Header />

            <section className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-20">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-8xl font-black italic tracking-tighter mb-6"
                        >
                            LEGAL <span className="text-primary">CENTER</span>
                        </motion.h1>
                        <p className="text-white/40 font-medium">Last Updated: March 2, 2026</p>
                    </div>

                    <div className="space-y-20">
                        {sections.map((section, idx) => (
                            <motion.div
                                key={section.id}
                                id={section.id}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="scroll-mt-32"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 rounded-xl bg-primary/10">
                                        {section.icon}
                                    </div>
                                    <h2 className="text-3xl font-black italic tracking-tight uppercase">{section.title}</h2>
                                </div>
                                <div className="p-10 rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-xl">
                                    <p className="text-white/60 leading-relaxed font-medium whitespace-pre-line text-lg">
                                        {section.content}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
