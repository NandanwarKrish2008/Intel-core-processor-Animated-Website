'use client';

import React, { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Mail, Lock, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

function LoginContent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login: setAuthUser } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const isLogoutSuccess = searchParams.get('logout') === 'success';
    const isRegisteredSuccess = searchParams.get('registered') === 'true';
    const isResetSuccess = searchParams.get('reset') === 'success';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const endpoint = '/api/auth/login';

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setAuthUser(data.user);
                router.push('/');
            } else {
                setError(data.error || 'Something went wrong');
            }
        } catch (_err) {
            setError('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md z-10">
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full font-black text-black italic text-2xl mb-6">i</div>
                <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
                    WELCOME <span className="text-primary">BACK</span>
                </h1>
                <p className="text-white/40 mt-2 font-medium tracking-tight">
                    Sign in to access the Intel Core Ultra experience
                </p>
            </div>

            <motion.div
                layout
                className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[32px] p-8 md:p-10 shadow-2xl relative overflow-hidden"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors"
                                required
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors"
                                required
                            />
                        </div>
                        <div className="flex justify-end px-2">
                            <Link
                                href="/forgot-password"
                                className="text-xs font-bold text-white/20 hover:text-primary transition-colors uppercase tracking-widest"
                            >
                                Forgot Password?
                            </Link>
                        </div>
                    </div>

                    {isLogoutSuccess && !error && (
                        <motion.p
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center text-sm font-bold text-primary bg-primary/10 py-3 rounded-xl border border-primary/20 mb-4"
                        >
                            You have been logged out. Please log in again.
                        </motion.p>
                    )}

                    {isRegisteredSuccess && !error && (
                        <motion.p
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center text-sm font-bold text-primary bg-primary/10 py-3 rounded-xl border border-primary/20 mb-4"
                        >
                            Account created! Please sign in with your credentials.
                        </motion.p>
                    )}

                    {isResetSuccess && !error && (
                        <motion.p
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center text-sm font-bold text-primary bg-primary/10 py-3 rounded-xl border border-primary/20 mb-4"
                        >
                            Password reset successfully! Please sign in.
                        </motion.p>
                    )}

                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn("text-center text-sm font-bold", error.includes('created') ? "text-primary" : "text-red-400")}
                        >
                            {error}
                        </motion.p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                    >
                        {loading ? 'AUTHENTICATING...' : 'SIGN IN'}
                        {!loading && <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-white/5 text-center">
                    <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-4">New here?</p>
                    <button
                        onClick={() => router.push('/register')}
                        className="text-white hover:text-primary font-black transition-colors uppercase tracking-widest text-sm"
                    >
                        Create an Intel ID
                    </button>
                </div>
            </motion.div>

            <div className="mt-8 flex justify-center">
                <button
                    onClick={() => router.push('/')}
                    className="flex items-center gap-2 text-white/20 hover:text-white/60 transition-colors text-xs font-bold uppercase tracking-widest"
                >
                    <ArrowLeft size={14} /> Back to preview
                </button>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <main className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Aesthetic */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]" />

            <Suspense fallback={<div className="text-white">Loading...</div>}>
                <LoginContent />
            </Suspense>
        </main>
    );
}
