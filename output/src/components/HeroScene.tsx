'use client';

import React, { useEffect, useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, PerspectiveCamera, Environment, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from '@/lib/gsap';

const ProcessorCore = () => {
    const meshRef = useRef<THREE.Mesh>(null);
    const coreRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (coreRef.current) {
            // Base rotation
            coreRef.current.rotation.y = t * 0.1;
            coreRef.current.rotation.x = Math.sin(t * 0.05) * 0.05;
        }
    });

    // Scroll Sync via GSAP
    useEffect(() => {
        if (!coreRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1,
            }
        });

        tl.to(coreRef.current.rotation, { y: Math.PI * 4, ease: 'none' })
            .to(coreRef.current.scale, { x: 1.5, y: 1.5, z: 1.5, ease: 'power2.inOut' }, 0)
            .to(coreRef.current.position, { z: 4, ease: 'power2.inOut' }, 0.5);

        return () => {
            tl.kill();
        };
    }, []);

    return (
        <group ref={coreRef}>
            {/* Central "Die" */}
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
                <mesh ref={meshRef}>
                    <boxGeometry args={[2, 2, 0.4]} />
                    <MeshDistortMaterial
                        color="#0068B5"
                        speed={3}
                        distort={0.45}
                        radius={1}
                        emissive="#0071C5"
                        emissiveIntensity={1.2}
                        metalness={1}
                        roughness={0}
                    />
                </mesh>
                {/* Inner Core Detail */}
                <mesh scale={[0.8, 0.8, 1.1]}>
                    <boxGeometry args={[1, 1, 0.5]} />
                    <meshStandardMaterial
                        color="#00C7FF"
                        emissive="#00C7FF"
                        emissiveIntensity={2}
                        metalness={1}
                        roughness={0}
                    />
                </mesh>
            </Float>

            {/* Orbiting Data Particles */}
            <DataRings count={100} />

            {/* Light highlights */}
            <pointLight position={[5, 10, 5]} intensity={4} color="#00C7FF" />
            <pointLight position={[-5, -10, -5]} intensity={2} color="#0068B5" />
        </group>
    );
};

const DataRings = ({ count }: { count: number }) => {
    const points = useMemo(() => {
        const p = new Float32Array(count * 3);
        const radiusBase = 3.5;
        const radiusRandom = 2.5;

        // Use a simple seeded random for purity to satisfy lint
        let seed = 12345;
        const seededRandom = () => {
            const x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        };

        for (let i = 0; i < count; i++) {
            const radius = radiusBase + (seededRandom() * radiusRandom);
            const theta = seededRandom() * Math.PI * 2;
            p[i * 3] = Math.cos(theta) * radius;
            p[i * 3 + 1] = (seededRandom() - 0.5) * 4;
            p[i * 3 + 2] = Math.sin(theta) * radius;
        }
        return p;
    }, [count]);

    const ref = useRef<THREE.Points>(null);

    useFrame(() => {
        if (ref.current) {
            ref.current.rotation.y += 0.003;
        }
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={points.length / 3}
                    array={points}
                    itemSize={3}
                    args={[points, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.06}
                color="#00C7FF"
                transparent
                opacity={0.4}
                sizeAttenuation
            />
        </points>
    );
};

const HeroScene = () => {
    return (
        <div className="relative w-full h-[150vh] bg-black overflow-hidden border-b border-white/5">
            <div className="sticky top-0 w-full h-screen">
                <Canvas shadows dpr={[1, 2]}>
                    <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={35} />
                    <color attach="background" args={['#000']} />

                    <Suspense fallback={null}>
                        <ProcessorCore />
                        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
                        <Environment preset="night" />
                    </Suspense>

                    <ambientLight intensity={0.4} />
                    <spotLight position={[10, 20, 10]} angle={0.2} penumbra={1} intensity={2} />
                </Canvas>

                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none px-6 text-center">
                    <h1 className="text-4xl sm:text-6xl md:text-9xl font-black text-white tracking-tighter mix-blend-difference">
                        INTEL CORE ULTRA
                    </h1>
                    <p className="text-sm sm:text-base md:text-2xl text-white/50 font-bold mt-4 max-w-xl mix-blend-difference uppercase tracking-widest">
                        Intelligence Evolved. Procedural Future.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HeroScene;
