import React, { useMemo, useEffect, useRef } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import './Particles.css';

const ParticleItem = ({ p, mouseX, mouseY }) => {
    const xVal = useMotionValue(p.x);
    const yVal = useMotionValue(p.y);

    useEffect(() => {
        let raft;
        const updateRepulsion = () => {
            const dx = (mouseX.current / window.innerWidth * 100) - p.x;
            const dy = (mouseY.current / window.innerHeight * 100) - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const force = Math.max(0, 20 - dist) / 20;

            if (dist < 20) {
                xVal.set(p.x - (dx / dist) * force * 10);
                yVal.set(p.y - (dy / dist) * force * 10);
            } else {
                xVal.set(p.x);
                yVal.set(p.y);
            }
            raft = requestAnimationFrame(updateRepulsion);
        };
        raft = requestAnimationFrame(updateRepulsion);
        return () => cancelAnimationFrame(raft);
    }, [p.x, p.y, xVal, yVal, mouseX, mouseY]);

    return (
        <motion.div
            className="particle"
            style={{
                left: xVal.get() + '%',
                top: yVal.get() + '%',
                width: p.size,
                height: p.size,
                background: 'var(--accent-color, white)',
                filter: `blur(${p.size / 2}px)`,
                opacity: 0.2,
                position: 'absolute',
            }}
            animate={{
                opacity: [0.1, 0.4, 0.1],
                scale: [1, 1.2, 1],
            }}
            transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: "easeInOut",
            }}
        />
    );
};

const Particles = () => {
    const count = 30;
    const mouseX = useRef(0);
    const mouseY = useRef(0);

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.current = e.clientX;
            mouseY.current = e.clientY;
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const particles = useMemo(() => {
        return Array.from({ length: count }).map((_, i) => ({
            id: i,
            size: Math.random() * 4 + 1,
            x: Math.random() * 100,
            y: Math.random() * 100,
            duration: Math.random() * 20 + 10,
            delay: Math.random() * -20,
        }));
    }, []);

    return (
        <div className="particles-container">
            <div className="vignette-overlay" />
            <div className="grain-overlay" />
            {particles.map((p) => (
                <ParticleItem
                    key={p.id}
                    p={p}
                    mouseX={mouseX}
                    mouseY={mouseY}
                />
            ))}
        </div>
    );
};

export default Particles;
