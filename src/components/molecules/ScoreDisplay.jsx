import React from 'react'
import { motion } from 'framer-motion'
import Text from '@/components/atoms/Text'
import ApperIcon from '@/components/ApperIcon'

const ScoreDisplay = ({ score, combo, accuracy, className = '' }) => {
  return (
    <div className={`flex items-center gap-6 ${className}`}>
      {/* Score */}
      <motion.div 
        className="flex items-center gap-2"
        animate={combo > 0 ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <ApperIcon name="Target" className="w-6 h-6 text-accent" />
        <div>
          <Text variant="caption" color="muted" className="uppercase tracking-wide">
            Score
          </Text>
          <Text variant="display" size="2xl" color="accent">
            {score.toLocaleString()}
          </Text>
        </div>
      </motion.div>

      {/* Combo */}
      {combo > 1 && (
        <motion.div 
          className="flex items-center gap-2"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="animate-combo-bounce"
        >
          <ApperIcon name="Zap" className="w-6 h-6 text-warning" />
          <div>
            <Text variant="caption" color="muted" className="uppercase tracking-wide">
              Combo
            </Text>
            <Text variant="display" size="xl" color="warning">
              x{combo}
            </Text>
          </div>
        </motion.div>
      )}

      {/* Accuracy */}
      <div className="flex items-center gap-2">
        <ApperIcon name="Crosshair" className="w-6 h-6 text-success" />
        <div>
          <Text variant="caption" color="muted" className="uppercase tracking-wide">
            Accuracy
          </Text>
          <Text variant="display" size="xl" color="success">
            {accuracy}%
          </Text>
        </div>
      </div>
    </div>
  )
}

export default ScoreDisplay