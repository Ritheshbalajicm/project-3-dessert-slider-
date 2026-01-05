import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import './Cursor.css';

const Cursor = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 200 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const moveMouse = (e) => {
            mouseX.set(e.clientX - 10);
            mouseY.set(e.clientY - 10);
        };

        const handleHover = (e) => {
            if (e.target.closest('.card') || e.target.closest('.details-btn')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', moveMouse);
        window.addEventListener('mouseover', handleHover);

        return () => {
            window.removeEventListener('mousemove', moveMouse);
            window.removeEventListener('mouseover', handleHover);
        };
    }, [mouseX, mouseY]);

    return (
        <motion.div
            className={`custom-cursor ${isHovering ? 'hovering' : ''}`}
            style={{
                translateX: cursorX,
                translateY: cursorY,
            }}
        >
            <div className="cursor-dot" />
            <div className="cursor-ring" />
        </motion.div>
    );
};

export default Cursor;
