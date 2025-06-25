import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Text from '@/components/atoms/Text'
import Card from '@/components/atoms/Card'
import DifficultySelector from '@/components/molecules/DifficultySelector'
import ApperIcon from '@/components/ApperIcon'

const MainMenu = ({ 
  onStartGame, 
  onShowSettings,
  highScore,
  bestAccuracy,
  className = '' 
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium')
  const [showDifficultySelect, setShowDifficultySelect] = useState(false)

  const handleStartGame = () => {
    if (showDifficultySelect) {
      onStartGame(selectedDifficulty)
    } else {
      setShowDifficultySelect(true)
    }
  }

  return (
    <div className={`
      flex items-center justify-center min-h-screen
      bg-gradient-to-b from-surface-900 via-surface-800 to-surface-700
      relative overflow-hidden
      ${className}
    `}>
      {/* Western backdrop elements */}
      <div className="absolute inset-0">
        {/* Saloon silhouette */}
        <div className="absolute bottom-0 left-1/4 w-64 h-48 bg-surface-900/40"
             style={{ clipPath: 'polygon(0% 100%, 0% 40%, 20% 30%, 20% 0%, 80% 0%, 80% 30%, 100% 40%, 100% 100%)' }} />
        
        {/* Windmill */}
        <div className="absolute bottom-0 right-1/4 w-32 h-40 bg-surface-900/30">
          <div className="absolute top-8 left-1/2 w-16 h-16 border-4 border-surface-900/40 rounded-full transform -translate-x-1/2">
            <div className="absolute inset-2 border-2 border-surface-900/40 rounded-full">
              <div className="absolute top-1/2 left-1/2 w-8 h-0.5 bg-surface-900/40 transform -translate-x-1/2 -translate-y-1/2 rotate-45" />
              <div className="absolute top-1/2 left-1/2 w-8 h-0.5 bg-surface-900/40 transform -translate-x-1/2 -translate-y-1/2 -rotate-45" />
            </div>
          </div>
        </div>
      </div>

      <Card className="p-8 max-w-2xl w-full mx-4" hover={false}>
        <div className="text-center space-y-8">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Text variant="display" size="6xl" color="accent" className="drop-shadow-2xl">
              WILD WEST
            </Text>
            <Text variant="display" size="4xl" color="secondary" className="drop-shadow-lg">
              SHOWDOWN
            </Text>
            <Text variant="body" color="muted" className="mt-2">
              Test your aim in the lawless frontier
            </Text>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex justify-center gap-8"
          >
            <div className="text-center">
              <Text variant="display" size="2xl" color="accent">
                {highScore.toLocaleString()}
              </Text>
              <Text variant="caption" color="muted">
                High Score
              </Text>
            </div>
            <div className="text-center">
              <Text variant="display" size="2xl" color="success">
                {bestAccuracy}%
              </Text>
              <Text variant="caption" color="muted">
                Best Accuracy
              </Text>
            </div>
          </motion.div>

          {/* Difficulty Selection or Main Menu */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {showDifficultySelect ? (
              <div className="space-y-6">
                <DifficultySelector
                  selectedDifficulty={selectedDifficulty}
                  onSelect={setSelectedDifficulty}
                />
                <div className="flex gap-4 justify-center">
                  <Button
                    variant="secondary"
                    size="large"
                    onClick={() => setShowDifficultySelect(false)}
                    icon="ArrowLeft"
                  >
                    Back
                  </Button>
                  <Button
                    variant="accent"
                    size="large"
                    onClick={handleStartGame}
                    icon="Play"
                    className="px-8"
                  >
                    Start Game
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Button
                  variant="accent"
                  size="large"
                  onClick={handleStartGame}
                  icon="Target"
                  className="w-full max-w-xs mx-auto text-xl py-4"
                >
                  Quick Draw
                </Button>
                
                <div className="flex gap-4 justify-center">
                  <Button
                    variant="secondary"
                    size="medium"
                    onClick={onShowSettings}
                    icon="Settings"
                  >
                    Settings
                  </Button>
                  
                  <Button
                    variant="secondary"
                    size="medium"
                    icon="HelpCircle"
                  >
                    How to Play
                  </Button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="text-center space-y-2"
          >
            <div className="flex items-center justify-center gap-2 text-surface-400">
              <ApperIcon name="Mouse" className="w-4 h-4" />
              <Text variant="caption" color="muted">
                Click to shoot • Aim for outlaws and bottles • Avoid the sheriff!
              </Text>
            </div>
          </motion.div>
        </div>
      </Card>
    </div>
  )
}

export default MainMenu