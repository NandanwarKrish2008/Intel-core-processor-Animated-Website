'use client';

import React, { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronRight, Lock, CheckCircle2 } from 'lucide-react';

function ResetPasswordContent() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';
    const token = searchParams.get('token') || '';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setStatus('error');
            setMessage('Passwords do not match');
            return;
        }

        setStatus('loading');
        setMessage('');

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, token }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setMessage(data.message);
                setTimeout(() => router.push('/login?reset=success'), 3000);
            } else {
                setStatus('error');
                setMessage(data.error || 'Something went wrong');
            }
        } catch (err) {
            setStatus('error');
            setMessage('Failed to connect to server');
        }
    };

    if (status === 'success') {
        return (
            <div className="w-full max-w-md z-10 text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[40px] p-10 shadow-2xl"
                >
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center text-primary mx-auto mb-8">
                        <CheckCircle2 size={48} />
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic mb-4">SUCCESS!</h1>
                    <p className="text-white/40 font-medium leading-relaxed mb-8">
                        {message}
                    </p>
                    <p className="text-xs font-bold text-white/20 uppercase tracking-widest animate-pulse">
                        Redirecting to Login...
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md z-10">
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full font-black text-black italic text-2xl mb-6 shadow-[0_0_30px_rgba(255,255,255,0.2)]">i</div>
                <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
                    Reset <span className="text-primary">Password</span>
                </h1>
                <p className="text-white/40 mt-2 font-medium tracking-tight">
                    Resetting password for: <span className="text-white">{email}</span>
                </p>
            </div>

            <motion.div
                layout
                className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[40px] p-8 md:p-10 shadow-2xl relative overflow-hidden"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative">
                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                            <input
                                type="password"
                                placeholder="New Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors"
                                required
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors"
                                required
                            />
                        </div>
                    </div>

                    {status === 'error' && (
                        <motion.p
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center text-sm font-bold text-red-400 bg-red-400/10 py-3 rounded-xl border border-red-400/20"
                        >
                            {message}
                        </motion.p>
                    )}

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                    >
                        {status === 'loading' ? 'RESETTING...' : 'RESET PASSWORD'}
                        {status !== 'loading' && <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <main className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px]" />

            <Suspense fallback={<div className="text-white font-bold animate-pulse">Initializing...</div>}>
                <ResetPasswordContent />
            </Suspense>
        </main>
    );
}
