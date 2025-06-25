import React from 'react'
import { motion } from 'framer-motion'
import Text from '@/components/atoms/Text'
import ApperIcon from '@/components/ApperIcon'

const Timer = ({ timeRemaining, className = '' }) => {
  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60
  const isUrgent = timeRemaining <= 10

  return (
    <motion.div 
      className={`flex items-center gap-2 ${className}`}
      animate={isUrgent ? { scale: [1, 1.1, 1] } : {}}
      transition={{ duration: 0.5, repeat: isUrgent ? Infinity : 0 }}
    >
      <ApperIcon 
        name="Clock" 
        className={`w-6 h-6 ${isUrgent ? 'text-error' : 'text-accent'}`} 
      />
      <div>
        <Text variant="caption" color="muted" className="uppercase tracking-wide">
          Time
        </Text>
        <Text 
          variant="display" 
          size="xl" 
          color={isUrgent ? 'error' : 'accent'}
        >
          {minutes}:{seconds.toString().padStart(2, '0')}
        </Text>
      </div>
    </motion.div>
  )
}

export default Timer