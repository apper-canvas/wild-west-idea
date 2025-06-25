import React from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Text from '@/components/atoms/Text'

const DifficultySelector = ({ selectedDifficulty, onSelect, className = '' }) => {
  const difficulties = [
    { 
      id: 'easy', 
      label: 'Easy', 
      description: 'Slow targets, more time',
      time: '90s',
      icon: 'Smile'
    },
    { 
      id: 'medium', 
      label: 'Medium', 
      description: 'Balanced challenge',
      time: '60s',
      icon: 'Target'
    },
    { 
      id: 'hard', 
      label: 'Hard', 
      description: 'Fast targets, less time',
      time: '45s',
      icon: 'Zap'
    }
  ]

  return (
    <div className={`space-y-4 ${className}`}>
      <Text variant="heading" size="lg" color="secondary" className="text-center">
        Choose Your Challenge
      </Text>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {difficulties.map((difficulty, index) => (
          <motion.div
            key={difficulty.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              variant={selectedDifficulty === difficulty.id ? 'accent' : 'secondary'}
              size="large"
              onClick={() => onSelect(difficulty.id)}
              icon={difficulty.icon}
              className="w-full p-6 text-left"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Text variant="heading" size="lg">
                    {difficulty.label}
                  </Text>
                  <Text variant="caption" color="accent">
                    {difficulty.time}
                  </Text>
                </div>
                <Text variant="caption" color="muted">
                  {difficulty.description}
                </Text>
              </div>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default DifficultySelector