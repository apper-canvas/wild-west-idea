import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import MainMenu from '@/components/organisms/MainMenu'
import GameCanvas from '@/components/organisms/GameCanvas'
import GameHUD from '@/components/organisms/GameHUD'
import GameOverScreen from '@/components/organisms/GameOverScreen'
import SettingsPanel from '@/components/organisms/SettingsPanel'
import gameStateService from '@/services/api/gameStateService'

const Home = () => {
  const [gameState, setGameState] = useState(null)
  const [gameScreen, setGameScreen] = useState('menu') // 'menu', 'playing', 'gameOver'
  const [showSettings, setShowSettings] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isNewHighScore, setIsNewHighScore] = useState(false)
  const [gameTimer, setGameTimer] = useState(null)

  // Load initial game state
  useEffect(() => {
    const loadGameState = async () => {
      setLoading(true)
      try {
        const result = await gameStateService.getGameState()
        setGameState(result)
      } catch (error) {
        console.error('Failed to load game state:', error)
        toast.error('Failed to initialize game')
      } finally {
        setLoading(false)
      }
    }

    loadGameState()
  }, [])

  // Game timer
  useEffect(() => {
    if (gameState?.isPlaying && !gameState?.isPaused && gameState?.timeRemaining > 0) {
      const timer = setInterval(async () => {
        try {
          const newTime = Math.max(0, gameState.timeRemaining - 1)
          const updatedState = await gameStateService.updateGameState({ 
            timeRemaining: newTime 
          })
          setGameState(updatedState)

          // End game when time runs out
          if (newTime === 0) {
            handleGameEnd()
          }
        } catch (error) {
          console.error('Failed to update timer:', error)
        }
      }, 1000)

      setGameTimer(timer)
      return () => clearInterval(timer)
    } else if (gameTimer) {
      clearInterval(gameTimer)
      setGameTimer(null)
    }
  }, [gameState?.isPlaying, gameState?.isPaused, gameState?.timeRemaining])

  // Start game
  const handleStartGame = async (difficulty) => {
    try {
      const newGameState = await gameStateService.startGame(difficulty)
      setGameState(newGameState)
      setGameScreen('playing')
      setIsNewHighScore(false)
      toast.success(`Game started on ${difficulty} mode!`)
    } catch (error) {
      console.error('Failed to start game:', error)
      toast.error('Failed to start game')
    }
  }

  // Update score and game state
  const updateGameState = useCallback(async (updates) => {
    try {
      const oldHighScore = gameState.highScore
      const updatedState = await gameStateService.updateGameState(updates)
      setGameState(updatedState)

      // Check for new high score
      if (updatedState.highScore > oldHighScore) {
        setIsNewHighScore(true)
      }
    } catch (error) {
      console.error('Failed to update game state:', error)
      toast.error('Failed to update game')
    }
  }, [gameState?.highScore])

  // End game
  const handleGameEnd = async () => {
    try {
      const endedState = await gameStateService.endGame()
      setGameState(endedState)
      setGameScreen('gameOver')
      
      if (gameTimer) {
        clearInterval(gameTimer)
        setGameTimer(null)
      }
    } catch (error) {
      console.error('Failed to end game:', error)
      toast.error('Failed to end game')
    }
  }

  // Pause/Resume game
  const handlePauseToggle = async () => {
    try {
      const updatedState = await gameStateService.updateGameState({ 
        isPaused: !gameState.isPaused 
      })
      setGameState(updatedState)
      toast.info(updatedState.isPaused ? 'Game paused' : 'Game resumed')
    } catch (error) {
      console.error('Failed to toggle pause:', error)
      toast.error('Failed to pause game')
    }
  }

  // Quit to main menu
  const handleQuitGame = async () => {
    try {
      await gameStateService.resetGame()
      setGameScreen('menu')
      
      if (gameTimer) {
        clearInterval(gameTimer)
        setGameTimer(null)
      }
      
      toast.info('Returned to main menu')
    } catch (error) {
      console.error('Failed to quit game:', error)
      toast.error('Failed to quit game')
    }
  }

  // Restart game with same difficulty
  const handleRestartGame = async () => {
    if (gameState?.difficulty) {
      await handleStartGame(gameState.difficulty)
    }
  }

  // Return to main menu
  const handleMainMenu = async () => {
    try {
      await gameStateService.resetGame()
      setGameScreen('menu')
      setIsNewHighScore(false)
    } catch (error) {
      console.error('Failed to return to menu:', error)
      toast.error('Failed to return to menu')
    }
  }

  if (loading || !gameState) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-background relative">
      {/* Main Menu */}
      {gameScreen === 'menu' && (
        <MainMenu
          onStartGame={handleStartGame}
          onShowSettings={() => setShowSettings(true)}
          highScore={gameState.highScore}
          bestAccuracy={gameState.bestAccuracy}
        />
      )}

      {/* Game Playing */}
      {gameScreen === 'playing' && (
        <div className="h-full w-full relative">
          {/* Game HUD */}
          <GameHUD
            gameState={gameState}
            onPauseToggle={handlePauseToggle}
            onQuitGame={handleQuitGame}
            highScore={gameState.highScore}
          />

          {/* Game Canvas */}
          <div className="pt-24 h-full">
            <GameCanvas
              gameState={gameState}
              onScoreUpdate={updateGameState}
              onGameEnd={handleGameEnd}
              className="h-full"
            />
          </div>

          {/* Pause Overlay */}
          {gameState.isPaused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/50 flex items-center justify-center z-40"
            >
              <div className="text-center space-y-4">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <h2 className="font-display text-6xl text-accent drop-shadow-2xl">
                    PAUSED
                  </h2>
                </motion.div>
                <p className="text-surface-300 text-lg">
                  Click Resume or press spacebar to continue
                </p>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Game Over Screen */}
      {gameScreen === 'gameOver' && (
        <GameOverScreen
          gameState={gameState}
          onRestart={handleRestartGame}
          onMainMenu={handleMainMenu}
          isNewHighScore={isNewHighScore}
        />
      )}

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  )
}

export default Home