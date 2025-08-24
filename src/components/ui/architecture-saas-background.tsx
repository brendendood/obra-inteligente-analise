"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Sun, Moon, Building2, Layers3, Box } from 'lucide-react'

interface ArchitectureSaaSBackgroundProps {
  children?: React.ReactNode
  className?: string
}

const FloatingElements: React.FC = () => {
  const elements = [
    { icon: Building2, delay: 0, x: 20, y: 80 },
    { icon: Layers3, delay: 2, x: 80, y: 20 },
    { icon: Box, delay: 4, x: 60, y: 60 },
    { icon: Building2, delay: 6, x: 90, y: 90 },
    { icon: Layers3, delay: 8, x: 10, y: 40 },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {elements.map((Element, i) => (
        <motion.div
          key={i}
          className="absolute opacity-[0.03] dark:opacity-[0.08]"
          style={{
            left: `${Element.x}%`,
            top: `${Element.y}%`,
          }}
          animate={{
            y: [-10, 10, -10],
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: Element.delay,
            ease: "easeInOut",
          }}
        >
          <Element.icon className="w-16 h-16 text-foreground" />
        </motion.div>
      ))}
    </div>
  )
}

const AnimatedGrid: React.FC = () => {
  return (
    <motion.div 
      className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
      style={{
        backgroundImage: `
          linear-gradient(currentColor 1px, transparent 1px),
          linear-gradient(90deg, currentColor 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }}
      animate={{
        backgroundPosition: ['0px 0px', '60px 60px'],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  )
}

export const ArchitectureSaaSBackground: React.FC<ArchitectureSaaSBackgroundProps> = ({ 
  children, 
  className = "" 
}) => {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    
    checkTheme()
    
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    
    return () => observer.disconnect()
  }, [])

  return (
    <div className={`relative min-h-screen bg-background dark:bg-black overflow-hidden ${className}`}>
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-slate-50/20 dark:from-blue-950/20 dark:via-transparent dark:to-slate-950/30" />
      
      {/* Animated grid */}
      <AnimatedGrid />
      
      {/* Floating architectural elements */}
      <FloatingElements />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}