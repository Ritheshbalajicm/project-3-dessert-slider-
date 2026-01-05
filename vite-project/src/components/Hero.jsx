import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'
import Magnetic from './Magnetic'
import Particles from './Particles'
import './Hero.css'

const images = [
  {
    src: '/images/image2.png',
    title: 'Pink Donut Dream',
    desc: 'Soft golden dough / strawberry magic',
    accent: 'rgba(255, 100, 150, 0.25)',
    ingredients: ['Madagascar Vanilla', 'Fresh Strawberries', 'Organic Cane Sugar', 'Artisan Flour'],
    fact: 'Hand-glazed every morning for the ultimate fresh bloom.'
  },
  {
    src: '/images/image1.png',
    title: 'Midnight Cocoa Mousse',
    desc: 'Silken chocolate / cloud-light finish',
    accent: 'rgba(100, 50, 255, 0.2)',
    ingredients: ['70% Dark Cocoa', 'High-Mountain Cream', 'Sea Salt Carmel', 'Espresso Extract'],
    fact: 'Whisky-infused cocoa beans give it that distinctive depth.'
  },
  {
    src: '/images/image3.png',
    title: 'Morning Honey Stack',
    desc: 'Fluffy pancakes / golden honey kiss',
    accent: 'rgba(255, 200, 50, 0.2)',
    ingredients: ['Wildflower Honey', 'Churned Butter', 'Buttermilk', 'Organic Blueberries'],
    fact: 'Our honey is sourced from local ethical apiaries.'
  },
  {
    src: '/images/image5.png',
    title: 'Molten Vanilla Brownie',
    desc: 'Deep cocoa richness / vanilla sweetness',
    accent: 'rgba(200, 100, 50, 0.2)',
    ingredients: ['Vanilla Bean Paste', 'Belgian Chocolate', 'Roasted Walnuts', 'Grass-fed Butter'],
    fact: 'Baked at exactly 175°C for that perfect molten core.'
  },
  {
    src: '/images/image4.png',
    title: 'Golden Orchard Pie',
    desc: 'Spiced apples / golden flaky crown',
    accent: 'rgba(150, 255, 100, 0.15)',
    ingredients: ['Honeycrisp Apples', 'Ceylon Cinnamon', 'Shortcrust Pastry', 'Brown Butter'],
    fact: 'Family recipe passed down through three generations.'
  },
]

const GAP = 550

const Hero = () => {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // 3D Tilt Logic
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const mouseXSpring = useSpring(mouseX, { stiffness: 100, damping: 30 })
  const mouseYSpring = useSpring(mouseY, { stiffness: 100, damping: 30 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [15, -15])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-15, 15])

  const handleMouseMove = (e) => {
    if (!e.currentTarget) return
    const rect = e.currentTarget.getBoundingClientRect()
    const xPct = (e.clientX - rect.left) / rect.width - 0.5
    const yPct = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(xPct)
    mouseY.set(yPct)
  }

  const handleMouseLeaveBound = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  const unlockAnimation = useCallback(() => {
    setIsAnimating(false)
  }, [])

  const next = useCallback(() => {
    if (isAnimating || !images.length) return
    setIsAnimating(true)
    setDirection(1)
    setIndex((prev) => (prev + 1) % images.length)
    setShowDetails(false)
    setTimeout(unlockAnimation, 800)
  }, [isAnimating, unlockAnimation])

  const prev = useCallback(() => {
    if (isAnimating || !images.length) return
    setIsAnimating(true)
    setDirection(-1)
    setIndex((prev) => (prev - 1 + images.length) % images.length)
    setShowDetails(false)
    setTimeout(unlockAnimation, 800)
  }, [isAnimating, unlockAnimation])

  // Auto-play logic
  useEffect(() => {
    if (!isAutoPlaying || isAnimating || showDetails) return
    const interval = setInterval(next, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, isAnimating, next, showDetails])

  // Wheel interaction handler
  useEffect(() => {
    let lastWheelTime = 0
    const handleWheel = (e) => {
      if (showDetails) return
      const now = Date.now()
      if (now - lastWheelTime < 1000) return
      if (Math.abs(e.deltaY) < 10) return

      if (e.deltaY > 0) next()
      else prev()
      lastWheelTime = now
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [next, prev, showDetails])

  const centerItem = images[index] || images[0] || {}
  const titleWords = (centerItem.title || "").split(' ')

  const getVisibleItems = () => {
    if (!images.length) return []
    const count = images.length
    const prevIdx = (index - 1 + count) % count
    const nextIdx = (index + 1) % count

    return [
      { ...images[prevIdx], pos: -1 },
      { ...images[index], pos: 0 },
      { ...images[nextIdx], pos: 1 },
    ]
  }

  const visibleItems = getVisibleItems()

  return (
    <div
      className="hero"
      style={{ '--accent-color': centerItem.accent || 'white' }}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => {
        setIsAutoPlaying(true)
        handleMouseLeaveBound()
      }}
      onMouseMove={handleMouseMove}
    >
      <Particles />

      <motion.div
        className={`hero-bg ${isAnimating ? 'chromatic-aberration' : ''}`}
        key={`bg-${index}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        style={{
          background: `radial-gradient(circle at calc(50% + ${mouseX.get() * 30}px) calc(50% + ${mouseY.get() * 30}px), ${centerItem.accent || 'white'} 0%, rgba(5, 5, 5, 1) 100%)`,
          pointerEvents: 'none'
        }}
      />

      <motion.div
        className="hero-bg-image"
        key={`bg-img-${index}`}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        style={{
          backgroundImage: centerItem.src ? `url(${centerItem.src})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(100px) saturate(200%)',
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          zIndex: 0, pointerEvents: 'none'
        }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={centerItem.title || index}
          className="hero-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{ visibility: showDetails ? 'hidden' : 'visible' }}
        >
          <div className="title-container">
            {titleWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ y: 20, opacity: 0, filter: 'blur(10px)' }}
                animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.1,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="title-word"
              >
                {word}
              </motion.span>
            ))}
          </div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {centerItem.desc}
          </motion.p>

          <Magnetic>
            <motion.button
              className="details-btn"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDetails(true)}
            >
              View Details
            </motion.button>
          </Magnetic>
        </motion.div>
      </AnimatePresence>

      <div className="carousel" style={{ pointerEvents: showDetails ? 'none' : 'auto' }}>
        <AnimatePresence initial={false} onExitComplete={unlockAnimation}>
          {visibleItems.map((item) => (
            <motion.div
              key={item.src}
              className={`card ${item.pos === 0 ? 'active' : ''}`}
              onClick={item.pos === 1 ? next : item.pos === -1 ? prev : undefined}
              initial={{
                x: direction > 0 ? (item.pos + 1) * GAP : (item.pos - 1) * GAP,
                opacity: 0, scale: 0.4, rotateY: item.pos * 45, z: -500
              }}
              animate={{
                x: item.pos * GAP,
                opacity: item.pos === 0 ? 1 : 0.4,
                scale: item.pos === 0 ? 1.25 : 0.65,
                rotateY: item.pos === 0 ? 0 : item.pos * 25,
                z: item.pos === 0 ? 0 : -200,
                filter: item.pos === 0 ? 'grayscale(0%) blur(0px)' : 'grayscale(50%) blur(2px)'
              }}
              exit={{
                x: direction > 0 ? (item.pos - 1) * GAP : (item.pos + 1) * GAP,
                opacity: 0, scale: 0.4, rotateY: item.pos * -45,
                transition: { duration: 0.5 }
              }}
              transition={{ type: "spring", stiffness: 120, damping: 20, mass: 1 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.div
                className="card-inner"
                style={{
                  width: '100%', height: '100%', transformStyle: "preserve-3d",
                  rotateX: item.pos === 0 ? rotateX : 0,
                  rotateY: item.pos === 0 ? rotateY : 0
                }}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  style={{ pointerEvents: 'none', width: '100%', height: '100%', objectFit: 'contain' }}
                />

                {item.pos === 0 && (
                  <div className="progress-bar">
                    <motion.div
                      className="progress-fill"
                      initial={{ width: "0%" }}
                      animate={{ width: isAutoPlaying ? "100%" : "0%" }}
                      transition={{ duration: isAutoPlaying ? 5 : 0.5, ease: "linear" }}
                      key={index + isAutoPlaying}
                    />
                  </div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            className="details-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="details-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Ingredients
              </motion.h2>
              <div className="ingredients-grid">
                {(centerItem.ingredients || []).map((ing, i) => (
                  <Magnetic key={i} strength={0.15}>
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                    >
                      {ing}
                    </motion.span>
                  </Magnetic>
                ))}
              </div>
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                {centerItem.fact || "Exquisite taste in every bite."}
              </motion.p>
              <button
                className="details-btn"
                onClick={() => setShowDetails(false)}
                style={{ marginTop: '30px', background: 'white', color: 'black', border: 'none' }}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Hero
