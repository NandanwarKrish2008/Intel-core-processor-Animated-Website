'use client';

import React from 'react';
import { Globe, Github, Twitter, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-black border-t border-white/5 pt-20 pb-12 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-black text-white italic text-lg shadow-[0_0_20px_rgba(0,113,197,0.3)]">i</div>
                            <span className="text-xl font-black tracking-tighter uppercase italic">Intel Core</span>
                        </div>
                        <p className="text-white/40 text-sm font-medium leading-relaxed max-w-xs">
                            Architecting the future of human potential through silicon excellence and AI innovation. Join the revolution.
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Github, Linkedin, Mail].map((Icon, idx) => (
                                <a key={idx} href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary transition-colors group">
                                    <Icon size={18} className="text-white/40 group-hover:text-white transition-colors" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-8">Navigation</h4>
                        <ul className="space-y-4">
                            {[
                                { name: 'Home', href: '/' },
                                { name: 'Products', href: '/products' },
                                { name: 'About', href: '/about' },
                                { name: 'Contact', href: '/contact' }
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm font-bold text-white/60 hover:text-primary transition-colors">{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-8">Resources</h4>
                        <ul className="space-y-4">
                            {[
                                { name: 'Support', href: '/support' },
                                { name: 'Features', href: '/features' },
                                { name: 'Developers', href: '#' },
                                { name: 'Drivers', href: '#' }
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm font-bold text-white/60 hover:text-primary transition-colors">{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-8">Legal</h4>
                        <ul className="space-y-4">
                            {[
                                { name: 'Privacy Policy', href: '/legal#privacy' },
                                { name: 'Terms of Use', href: '/legal#terms' },
                                { name: 'Trademarks', href: '#' },
                                { name: 'Security', href: '#' }
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm font-bold text-white/60 hover:text-primary transition-colors">{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">
                    <div className="flex items-center gap-4">
                        <Globe size={14} />
                        <span>GLOBAL - ENGLISH</span>
                    </div>
                    <p>&copy; 2026 Intel Corporation. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
}
