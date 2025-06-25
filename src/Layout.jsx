import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'

const Layout = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  // Track mouse position for custom crosshair
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseEnter = () => setIsHovered(true)
    const handleMouseLeave = () => setIsHovered(false)

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseenter', handleMouseEnter)
    window.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseenter', handleMouseEnter)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <div className="h-screen w-screen overflow-hidden bg-background relative">
      {/* Custom Crosshair */}
      <div 
        className={`crosshair ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        style={{
          left: mousePosition.x - 16,
          top: mousePosition.y - 16,
          transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)'
        }}
      >
        <ApperIcon name="Crosshair" className="w-8 h-8 text-accent drop-shadow-lg" />
      </div>

      {/* Dust Particles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="dust-particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${6 + Math.random() * 4}s`
          }}
        />
      ))}

      {/* Main Content */}
      <main className="h-full w-full">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout