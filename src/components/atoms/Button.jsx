import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  icon,
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = "font-display font-bold rounded border-2 transition-all duration-200 wood-texture relative overflow-hidden"
  
  const variants = {
    primary: "bg-primary border-secondary text-white shadow-lg hover:shadow-xl hover:bg-secondary",
    secondary: "bg-surface-600 border-surface-400 text-secondary hover:bg-surface-500",
    accent: "bg-accent border-yellow-600 text-surface-900 hover:bg-yellow-400",
    danger: "bg-error border-red-600 text-white hover:bg-red-600"
  }
  
  const sizes = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-6 py-3 text-base",
    large: "px-8 py-4 text-lg"
  }

  const filterProps = (props) => {
    const { variant, size, icon, ...filteredProps } = props
    return filteredProps
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses} 
        ${variants[variant]} 
        ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-crosshair'}
        ${className}
      `}
      {...filterProps(props)}
    >
      {/* Gold glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative flex items-center justify-center gap-2">
        {icon && <ApperIcon name={icon} className="w-5 h-5" />}
        {children}
      </div>
    </motion.button>
  )
}

export default Button