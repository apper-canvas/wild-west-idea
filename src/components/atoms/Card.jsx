import React from 'react'
import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  className = '',
  hover = true,
  ...props 
}) => {
  const filterProps = (props) => {
    const { hover, ...filteredProps } = props
    return filteredProps
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { scale: 1.02, y: -4 } : {}}
      className={`
        bg-surface-700 
        border-2 border-surface-500
        rounded 
        shadow-lg 
        paper-texture
        relative
        overflow-hidden
        ${className}
      `}
      {...filterProps(props)}
    >
      {/* Paper texture overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface-600/50 to-surface-800/50 pointer-events-none" />
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}

export default Card