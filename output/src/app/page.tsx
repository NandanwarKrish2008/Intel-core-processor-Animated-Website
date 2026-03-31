'use client';

import React, { useEffect, useRef } from 'react';
import HeroScene from '@/components/HeroScene';
import Header from '@/components/Header';
import ProductSpecs from '@/components/ProductSpecs';
import { gsap } from '@/lib/gsap';

export default function Home() {
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    sectionsRef.current.forEach((section) => {
      if (!section) return;

      gsap.fromTo(
        section.querySelectorAll('.reveal'),
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            end: 'top 40%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });
  }, []);

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  return (
    <main className="bg-black text-white relative min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative z-0">
        <HeroScene />
      </section>


      {/* Unveiling Section */}
      <section
        ref={addToRefs}
        className="min-h-screen py-32 px-6 md:px-24 flex flex-col justify-center items-center bg-black relative overflow-hidden"
      >
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-5xl w-full">
          <h2 className="reveal text-5xl md:text-8xl font-black mb-12 text-gradient leading-tight tracking-tighter">
            INTELLIGENCE <br /> EVOLVED.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <p className="reveal text-xl md:text-2xl text-white/50 leading-relaxed font-medium">
              Introducing the first processor built for the AI era. Intel® Core™ Ultra empowers you to create, collaborate, and perform like never before with on-device AI acceleration.
            </p>
            <div className="reveal space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
                <p className="text-white/80 font-bold">Integrated NPU for 20+ hours of battery life during AI workloads.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2" />
                <p className="text-white/80 font-bold">Advanced Hybrid Architecture with LP E-cores.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-1.5 h-1.5 bg-white rounded-full mt-2" />
                <p className="text-white/80 font-bold">Intel® Arc™ Graphics built-in for stunning visuals.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Specs Section */}
      <section
        ref={addToRefs}
        className="min-h-screen py-32 flex flex-col justify-center items-center bg-zinc-950 relative"
      >
        <div className="max-w-4xl w-full text-center mb-24 px-6">
          <h2 className="reveal text-4xl md:text-7xl font-bold mb-6 tracking-tighter">TECHNICAL SPECS</h2>
          <p className="reveal text-lg md:text-xl text-white/40 uppercase tracking-[0.2em] font-bold">Real-time performance metrics</p>
        </div>

        <ProductSpecs />

        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent pointer-events-none" />
      </section>

      {/* Large Stat/CTA Section */}
      <section
        ref={addToRefs}
        className="min-h-screen py-32 px-6 md:px-24 flex flex-col justify-center items-center bg-black"
      >
        <div className="w-full text-center">
          <h2 className="reveal text-[max(5vw,48px)] font-black mb-16 leading-[0.9] tracking-tighter">
            EXPERIENCE THE <br /> <span className="text-primary italic">UNSTOPPABLE.</span>
          </h2>
          <div className="reveal flex flex-wrap justify-center gap-6 mt-12">
            <button className="px-12 py-5 bg-white text-black font-bold text-lg rounded-2xl hover:bg-primary hover:text-white transition-all transform hover:scale-105 active:scale-95">
              Build Your AI PC
            </button>
            <button className="px-12 py-5 border border-white/20 text-white font-bold text-lg rounded-2xl hover:bg-white/5 transition-all">
              Technical Documentation
            </button>
          </div>
        </div>
      </section>

    </main>
  );
}
