'use client';

import React, { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ChevronRight, Mail, Lock, ArrowLeft } from 'lucide-react';

function RegisterContent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                router.push('/login?registered=true');
            } else {
                setError(data.error || 'Registration failed');
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
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full font-black text-black italic text-2xl mb-6 shadow-[0_0_30px_rgba(255,255,255,0.2)]">i</div>
                <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
                    Join the <span className="text-primary">Evolution</span>
                </h1>
                <p className="text-white/40 mt-2 font-medium tracking-tight">
                    Create your Intel ID to access exclusive features and technologies.
                </p>
            </div>

            <motion.div
                layout
                className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[40px] p-8 md:p-10 shadow-2xl relative overflow-hidden"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors"
                                required
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                            <input
                                type="password"
                                placeholder="Create Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.p
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center text-sm font-bold text-red-400 bg-red-400/10 py-3 rounded-xl border border-red-400/20"
                        >
                            {error}
                        </motion.p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                    >
                        {loading ? 'CREATING ACCOUNT...' : 'CREATE INTEL ID'}
                        {!loading && <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-white/5 text-center">
                    <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-4">Already have an account?</p>
                    <button
                        onClick={() => router.push('/login')}
                        className="text-white hover:text-primary font-black transition-colors uppercase tracking-widest text-sm"
                    >
                        Sign In Instead
                    </button>
                </div>
            </motion.div>

            <div className="mt-8 flex justify-center">
                <button
                    onClick={() => router.push('/')}
                    className="flex items-center gap-2 text-white/20 hover:text-white/60 transition-colors text-xs font-bold uppercase tracking-widest"
                >
                    <ArrowLeft size={14} /> Back to Intel Core
                </button>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <main className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px]" />

            <Suspense fallback={<div className="text-white font-bold animate-pulse">Initializing...</div>}>
                <RegisterContent />
            </Suspense>
        </main>
    );
}
