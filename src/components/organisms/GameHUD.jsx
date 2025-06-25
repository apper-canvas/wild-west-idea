import React from 'react'
import { motion } from 'framer-motion'
import ScoreDisplay from '@/components/molecules/ScoreDisplay'
import Timer from '@/components/molecules/Timer'
import Button from '@/components/atoms/Button'
import Text from '@/components/atoms/Text'

const GameHUD = ({ 
  gameState, 
  onPauseToggle, 
  onQuitGame,
  highScore,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`
        absolute top-0 left-0 right-0 z-30
        bg-gradient-to-b from-surface-900/95 to-transparent
        backdrop-blur-sm
        p-4
        border-b border-surface-600
        ${className}
      `}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Left side - Score and stats */}
          <div className="flex items-center space-x-8">
            <ScoreDisplay 
              score={gameState.score}
              combo={gameState.combo}
              accuracy={gameState.accuracy}
            />
          </div>

          {/* Center - Game title and high score */}
          <div className="text-center">
            <Text variant="display" size="2xl" color="accent" className="drop-shadow-lg">
              WILD WEST SHOWDOWN
            </Text>
            <Text variant="caption" color="muted">
              High Score: {highScore.toLocaleString()}
            </Text>
          </div>

          {/* Right side - Timer and controls */}
          <div className="flex items-center space-x-6">
            <Timer timeRemaining={gameState.timeRemaining} />
            
            <div className="flex items-center gap-2">
              <Button
                variant="secondary" 
                size="small"
                icon={gameState.isPaused ? "Play" : "Pause"}
                onClick={onPauseToggle}
                className="px-3"
              >
                {gameState.isPaused ? 'Resume' : 'Pause'}
              </Button>
              
              <Button
                variant="danger" 
                size="small"
                icon="X"
                onClick={onQuitGame}
                className="px-3"
              >
                Quit
              </Button>
            </div>
          </div>
        </div>

        {/* Difficulty indicator */}
        <div className="mt-2 flex justify-center">
          <span className={`
            px-3 py-1 rounded-full text-xs font-display uppercase tracking-wider
            ${gameState.difficulty === 'easy' ? 'bg-success/20 text-success' : 
              gameState.difficulty === 'medium' ? 'bg-warning/20 text-warning' : 
              'bg-error/20 text-error'}
          `}>
            {gameState.difficulty} Mode
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default GameHUD