'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, LogOut, ChevronRight, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Header = () => {
    const { user, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Products', href: '/products' },
        { name: 'Features', href: '/features' },
        { name: 'About', href: '/about' },
        { name: 'Support', href: '/support' },
        { name: 'Contact', href: '/contact' },
        ...(user?.role === 'admin' ? [{ name: 'Admin', href: '/admin' }] : [])
    ];

    return (
        <>
            <header
                className={cn(
                    "fixed top-0 left-0 w-full z-50 transition-all duration-300 px-6 md:px-12 h-20 md:h-24 flex items-center justify-between",
                    scrolled ? "bg-black/90 backdrop-blur-xl border-b border-white/10" : "bg-transparent"
                )}
            >
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-full flex items-center justify-center font-black text-white italic text-sm md:text-base cursor-pointer">i</div>
                    <span className="text-lg md:text-xl font-bold tracking-tighter">INTEL CORE</span>
                </div>

                <nav className="hidden lg:flex items-center gap-8">
                    {navLinks.map((item) => (
                        <Link key={item.name} href={item.href} className="text-xs font-bold text-white/50 hover:text-white transition-colors uppercase tracking-[0.2em]">
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="hidden sm:flex items-center gap-4 bg-white/5 border border-white/10 rounded-full px-5 py-2">
                            <div className="flex items-center gap-2">
                                <User size={14} className="text-primary" />
                                <span className="text-xs font-bold truncate max-w-[100px]">{user.email.split('@')[0]}</span>
                            </div>
                            <button
                                onClick={async () => {
                                    setIsLoggingOut(true);
                                    await logout();
                                    router.push('/login?logout=success');
                                }}
                                disabled={isLoggingOut}
                                className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-red-400 disabled:opacity-50"
                            >
                                <LogOut size={14} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => router.push('/login')}
                            className="group relative hidden sm:flex items-center gap-2 px-6 py-2.5 bg-white text-black font-bold rounded-full overflow-hidden hover:pr-10 transition-all text-sm"
                        >
                            <span>SIGN IN</span>
                            <ChevronRight className="absolute right-4 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" size={16} />
                        </button>
                    )}

                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 lg:hidden text-white/60 hover:text-white transition-colors"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </header>

            {/* Mobile Navigation Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        className="fixed inset-0 bg-black z-[40] flex flex-col p-12 pt-32 lg:hidden"
                    >
                        <nav className="flex flex-col gap-8">
                            {navLinks.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-3xl font-black text-white/80 hover:text-primary transition-colors tracking-tighter"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        <div className="mt-auto pt-12 border-t border-white/10">
                            {user ? (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                                            <User size={24} className="text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-white font-bold">{user.email.split('@')[0]}</p>
                                            <p className="text-white/40 text-sm">{user.role}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={async () => {
                                            setIsLoggingOut(true);
                                            await logout();
                                            setMobileMenuOpen(false);
                                            router.push('/login?logout=success');
                                        }}
                                        disabled={isLoggingOut}
                                        className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        <LogOut size={18} /> {isLoggingOut ? 'SIGNING OUT...' : 'SIGN OUT'}
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => { router.push('/login'); setMobileMenuOpen(false); }}
                                    className="w-full py-5 bg-white text-black font-black rounded-2xl text-xl"
                                >
                                    SIGN IN
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;

