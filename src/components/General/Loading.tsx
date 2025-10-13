"use client"

import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion"
import { useEffect, useMemo, useState } from "react"
import type React from "react"

const goldenRatio = 1.618033988749895

const fibonacciSpiral = (centerX: number, centerY: number, size: number, rotation: number) => {
  let path = `M${centerX},${centerY} `
  let currentSize = size
  let currentAngle = rotation

  for (let i = 0; i < 8; i++) {
    const endX = centerX + Math.cos(currentAngle) * currentSize
    const endY = centerY + Math.sin(currentAngle) * currentSize
    path += `A${currentSize},${currentSize} 0 0 1 ${endX},${endY} `
    currentSize /= goldenRatio
    currentAngle += Math.PI / 2
  }

  return path
}

export default function Loading() {
  const centerX = 150
  const centerY = 150
  const initialPath = useMemo(() => fibonacciSpiral(centerX, centerY, 120, 0), [])

  const spiralControls = useAnimation()
  const particleControls = useAnimation()
  const [isHovered, setIsHovered] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useTransform(mouseY, [0, 300], [5, -5])
  const rotateY = useTransform(mouseX, [0, 300], [-5, 5])

  useEffect(() => {
    const animateSpiral = async () => {
      while (true) {
        await spiralControls.start({
          pathLength: [0, 1],
          transition: { duration: 4, ease: "easeInOut" },
        })
        await spiralControls.start({
          pathLength: 1,
          transition: { duration: 2 },
        })
      }
    }

    const animateRotation = async () => {
      await spiralControls.start({
        rotate: 360,
        transition: { duration: 20, ease: "linear", repeat: Number.POSITIVE_INFINITY },
      })
    }

    const animateParticles = async () => {
      await particleControls.start({
        opacity: [0, 1],
        transition: { duration: 1, staggerChildren: 0.1 },
      })
      particleControls.start({
        opacity: [1, 0.7, 1],
        transition: { duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" },
      })
    }

    animateSpiral()
    animateRotation()
    animateParticles()
  }, [spiralControls, particleControls])

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    mouseX.set(event.clientX - rect.left)
    mouseY.set(event.clientY - rect.top)
  }

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-black overflow-hidden p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900 via-black to-black opacity-50"></div>

      {/* Responsive background dots */}
      {[...Array(40)].map((_, index) => (
        <motion.div
          key={`dot-${index}`}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: Math.random() * 2 + 1,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
          whileHover={{
            opacity: 0.8,
            scale: 1.5,
            transition: { duration: 0.3 },
          }}
        />
      ))}

      <motion.div
        className="relative w-[300px] h-[300px] cursor-pointer"
        style={{ perspective: 1000 }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{ rotateX, rotateY }}
        transition={{ type: "spring", stiffness: 100, damping: 30 }}
      >
        <svg width="300" height="300" viewBox="0 0 300 300" className="relative z-10">
          <defs>
            <linearGradient id="spiralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4F46E5">
                <animate
                  attributeName="stop-color"
                  values="#4F46E5; #7C3AED; #C026D3; #4F46E5"
                  dur="10s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="50%" stopColor="#7C3AED">
                <animate
                  attributeName="stop-color"
                  values="#7C3AED; #C026D3; #4F46E5; #7C3AED"
                  dur="10s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="#C026D3">
                <animate
                  attributeName="stop-color"
                  values="#C026D3; #4F46E5; #7C3AED; #C026D3"
                  dur="10s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Fibonacci spiral */}
          <motion.path
            d={initialPath}
            stroke="url(#spiralGradient)"
            strokeWidth="4"
            fill="none"
            filter="url(#glow)"
            initial={{ pathLength: 0, rotate: 0 }}
            animate={spiralControls}
            style={{ originX: "150px", originY: "150px" }}
          />

          {/* Particles */}
          {[...Array(12)].map((_, index) => {
            const angle = (index / 12) * Math.PI * 2
            const radius = 100 + (index % 3) * 20
            return (
              <motion.circle
                key={index}
                cx={centerX + Math.cos(angle) * radius}
                cy={centerY + Math.sin(angle) * radius}
                r="4"
                fill="#F9FAFB"
                initial={{ opacity: 0 }}
                animate={particleControls}
              />
            )
          })}

          {/* Central pulsating dot */}
          <motion.circle
            cx={centerX}
            cy={centerY}
            r="8"
            fill="#F9FAFB"
            animate={{
              opacity: [1, 0.7, 1],
              scale: isHovered ? [1, 1.1, 1] : 1,
            }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut" }}
          />

          {/* Orbiting particle */}
          <motion.circle
            cx={centerX}
            cy={centerY - 120}
            r="4"
            fill="#F9FAFB"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            style={{
              originX: "150px",
              originY: "150px",
            }}
          />
        </svg>
      </motion.div>

      {/* Animated text */}
      <motion.div
        className="mt-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 text-4xl font-extrabold relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <span className="inline-block">
          {[..."AI Loading"].map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 + index * 0.1, duration: 0.5 }}
              className="inline-block hover:text-purple-300 transition-colors duration-300"
            >
              {char}
            </motion.span>
          ))}
        </span>
        <motion.span
          className="inline-block ml-2 text-purple-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ delay: 3, duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
        >
          ●
        </motion.span>
      </motion.div>

      {/* Progress bar */}
      <motion.div
        className="mt-8 w-64 h-2 bg-gray-700 rounded-full overflow-hidden"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 8, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }}
        />
      </motion.div>
    </div>
  )
}
