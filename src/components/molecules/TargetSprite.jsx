import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const TargetSprite = ({ 
  target, 
  onHit, 
  style = {},
  className = '' 
}) => {
  const getTargetIcon = (type) => {
    const icons = {
      outlaw: 'User',
      bottle: 'Wine',
      poster: 'FileText',
      bandit: 'UserX',
      sheriff: 'Shield'
    }
    return icons[type] || 'Target'
  }

  const getTargetColor = (type) => {
    const colors = {
      outlaw: 'text-error',
      bottle: 'text-secondary',
      poster: 'text-accent',
      bandit: 'text-error',
      sheriff: 'text-success'
    }
    return colors[type] || 'text-white'
  }

  const handleClick = (e) => {
    e.stopPropagation()
    if (!target.isHit && onHit) {
      onHit(target.Id)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: target.isHit ? 0 : 1,
        scale: target.isHit ? 1.2 : 1,
        rotate: target.isHit ? 45 : 0
      }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.2 }}
      className={`
        absolute cursor-crosshair z-20
        ${target.isHit ? 'pointer-events-none' : ''}
        ${className}
      `}
      style={{
        left: target.x,
        top: target.y,
        ...style
      }}
      onClick={handleClick}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`
          w-12 h-12 
          rounded-full 
          border-2 border-surface-400
          bg-surface-800/90
          flex items-center justify-center
          shadow-lg
          backdrop-blur-sm
          ${target.isHit ? 'animate-screen-shake' : ''}
        `}
      >
        <ApperIcon 
          name={getTargetIcon(target.type)} 
          className={`w-6 h-6 ${getTargetColor(target.type)}`} 
        />
      </motion.div>

      {/* Hit effect */}
      {target.isHit && (
        <motion.div
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 3, opacity: 0 }}
          className="absolute inset-0 rounded-full bg-accent/30 animate-muzzle-flash"
        />
      )}

      {/* Points indicator */}
      {target.isHit && (
        <motion.div
          initial={{ y: 0, opacity: 1 }}
          animate={{ y: -50, opacity: 0 }}
          className="absolute -top-8 left-1/2 transform -translate-x-1/2"
        >
          <span className={`
            font-display text-lg font-bold
            ${target.points > 0 ? 'text-success' : 'text-error'}
            drop-shadow-lg
          `}>
            {target.points > 0 ? '+' : ''}{target.points}
          </span>
        </motion.div>
      )}
    </motion.div>
  )
}

export default TargetSprite