import React from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Text from '@/components/atoms/Text'
import Card from '@/components/atoms/Card'
import ScoreDisplay from '@/components/molecules/ScoreDisplay'
import ApperIcon from '@/components/ApperIcon'

const GameOverScreen = ({ 
  gameState, 
  onRestart, 
  onMainMenu,
  isNewHighScore,
  className = '' 
}) => {
  const getPerformanceMessage = () => {
    if (gameState.accuracy >= 90) return { text: "Legendary Gunslinger!", icon: "Award", color: "accent" }
    if (gameState.accuracy >= 75) return { text: "Sharp Shooter!", icon: "Target", color: "success" }
    if (gameState.accuracy >= 60) return { text: "Good Aim, Partner", icon: "Eye", color: "secondary" }
    if (gameState.accuracy >= 40) return { text: "Keep Practicing", icon: "RotateCcw", color: "warning" }
    return { text: "Better Luck Next Time", icon: "Frown", color: "error" }
  }

  const performance = getPerformanceMessage()

  return (
    <div className={`
      flex items-center justify-center min-h-screen
      bg-gradient-to-b from-surface-900/95 via-surface-800/95 to-surface-700/95
      backdrop-blur-sm
      relative overflow-hidden
      ${className}
    `}>
      <Card className="p-8 max-w-2xl w-full mx-4" hover={false}>
        <div className="text-center space-y-8">
          {/* Game Over Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Text variant="display" size="5xl" color="error" className="drop-shadow-2xl">
              GAME OVER
            </Text>
            {isNewHighScore && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-center gap-2 mt-2"
              >
                <ApperIcon name="Trophy" className="w-6 h-6 text-accent" />
                <Text variant="heading" size="lg" color="accent">
                  NEW HIGH SCORE!
                </Text>
                <ApperIcon name="Trophy" className="w-6 h-6 text-accent" />
              </motion.div>
            )}
          </motion.div>

          {/* Performance Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center justify-center gap-3"
          >
            <ApperIcon 
              name={performance.icon} 
              className={`w-8 h-8 text-${performance.color}`} 
            />
            <Text variant="heading" size="xl" color={performance.color}>
              {performance.text}
            </Text>
          </motion.div>

          {/* Final Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <ScoreDisplay
              score={gameState.score}
              combo={gameState.combo}
              accuracy={gameState.accuracy}
              className="justify-center"
            />
          </motion.div>

          {/* Detailed Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-surface-800/50 rounded border border-surface-600"
          >
            <div className="text-center">
              <Text variant="display" size="xl" color="accent">
                {gameState.shotsHit}
              </Text>
              <Text variant="caption" color="muted">
                Hits
              </Text>
            </div>
            <div className="text-center">
              <Text variant="display" size="xl" color="error">
                {gameState.shotsFired - gameState.shotsHit}
              </Text>
              <Text variant="caption" color="muted">
                Misses
              </Text>
            </div>
            <div className="text-center">
              <Text variant="display" size="xl" color="secondary">
                {gameState.shotsFired}
              </Text>
              <Text variant="caption" color="muted">
                Total Shots
              </Text>
            </div>
            <div className="text-center">
              <Text variant="display" size="xl" color="warning">
                {gameState.difficulty.toUpperCase()}
              </Text>
              <Text variant="caption" color="muted">
                Difficulty
              </Text>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="flex gap-4 justify-center"
          >
            <Button
              variant="accent"
              size="large"
              onClick={onRestart}
              icon="RotateCcw"
              className="px-8"
            >
              Play Again
            </Button>
            
            <Button
              variant="secondary"
              size="large"
              onClick={onMainMenu}
              icon="Home"
            >
              Main Menu
            </Button>
          </motion.div>

          {/* Motivational quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="text-center border-t border-surface-600 pt-4"
          >
            <Text variant="body" color="muted" className="italic">
              "In the Wild West, it's not the fastest gun that wins...
              <br />
              it's the most accurate."
            </Text>
          </motion.div>
        </div>
      </Card>
    </div>
  )
}

export default GameOverScreen