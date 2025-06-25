import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import TargetSprite from '@/components/molecules/TargetSprite'
import targetService from '@/services/api/targetService'

const GameCanvas = ({ 
  gameState, 
  onScoreUpdate, 
  onGameEnd,
  className = '' 
}) => {
  const [targets, setTargets] = useState([])
  const [muzzleFlash, setMuzzleFlash] = useState(null)
  const [screenShake, setScreenShake] = useState(false)
  const intervalRef = useRef(null)
  const animationRef = useRef(null)

  // Target spawn rates based on difficulty
  const getSpawnRate = (difficulty) => {
    const rates = { easy: 2000, medium: 1500, hard: 1000 }
    return rates[difficulty] || 1500
  }

  // Load targets
  const loadTargets = useCallback(async () => {
    try {
      const result = await targetService.getAll()
      setTargets(result)
    } catch (error) {
      console.error('Failed to load targets:', error)
    }
  }, [])

  // Create new target
  const createTarget = useCallback(async () => {
    if (!gameState.isPlaying) return

    try {
      const targetData = targetService.generateTarget(gameState.difficulty)
      const newTarget = await targetService.create(targetData)
      await loadTargets()
    } catch (error) {
      console.error('Failed to create target:', error)
    }
  }, [gameState.isPlaying, gameState.difficulty, loadTargets])

  // Hit target
  const handleTargetHit = useCallback(async (targetId) => {
    try {
      const target = await targetService.hitTarget(targetId)
      if (target) {
        // Calculate score with combo multiplier
        const comboMultiplier = Math.max(1, gameState.combo)
        const points = target.points * comboMultiplier

        // Update game state
        const newCombo = target.points > 0 ? gameState.combo + 1 : 0
        const newShotsHit = target.points > 0 ? gameState.shotsHit + 1 : gameState.shotsHit
        
        await onScoreUpdate({
          score: Math.max(0, gameState.score + points),
          combo: newCombo,
          shotsHit: newShotsHit,
          shotsFired: gameState.shotsFired + 1
        })

        // Show muzzle flash
        setMuzzleFlash({ x: target.x, y: target.y })
        setTimeout(() => setMuzzleFlash(null), 100)

        // Screen shake for hits
        if (target.points > 0) {
          setScreenShake(true)
          setTimeout(() => setScreenShake(false), 200)
        }

        await loadTargets()
      }
    } catch (error) {
      console.error('Failed to hit target:', error)
      toast.error('Failed to register hit')
    }
  }, [gameState, onScoreUpdate, loadTargets])

  // Handle canvas click (miss)
  const handleCanvasClick = useCallback(async (e) => {
    if (!gameState.isPlaying) return

    // Only count as miss if not clicking on a target
    const isTargetClick = e.target.closest('[data-target]')
    if (!isTargetClick) {
      await onScoreUpdate({
        combo: 0, // Reset combo on miss
        shotsFired: gameState.shotsFired + 1
      })

      // Show muzzle flash at click position
      const rect = e.currentTarget.getBoundingClientRect()
      setMuzzleFlash({ 
        x: e.clientX - rect.left - 16, 
        y: e.clientY - rect.top - 16 
      })
      setTimeout(() => setMuzzleFlash(null), 100)
    }
  }, [gameState.isPlaying, gameState.shotsFired, onScoreUpdate])

  // Update target positions
  const updateTargets = useCallback(async () => {
    if (!gameState.isPlaying) return

    const currentTargets = await targetService.getAll()
    const now = Date.now()

    for (const target of currentTargets) {
      const age = now - target.createdAt
      const newX = target.x + (target.direction * target.speed * 2)

      // Remove targets that have moved off screen or are too old
      if (newX < -100 || newX > window.innerWidth + 100 || age > 8000) {
        await targetService.delete(target.Id)
      } else {
        await targetService.update(target.Id, { x: newX })
      }
    }

    await loadTargets()
  }, [gameState.isPlaying, loadTargets])

  // Game loop
  useEffect(() => {
    if (!gameState.isPlaying) return

    // Target spawning
    intervalRef.current = setInterval(createTarget, getSpawnRate(gameState.difficulty))

    // Animation loop for target movement
    const animate = () => {
      updateTargets()
      animationRef.current = requestAnimationFrame(animate)
    }
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [gameState.isPlaying, gameState.difficulty, createTarget, updateTargets])

  // Clear targets when game ends
  useEffect(() => {
    if (!gameState.isPlaying) {
      targetService.clearAll()
      setTargets([])
    }
  }, [gameState.isPlaying])

  return (
    <motion.div
      className={`
        relative w-full h-full overflow-hidden
        bg-gradient-to-b from-orange-300 via-amber-200 to-yellow-100
        cursor-crosshair
        ${screenShake ? 'animate-screen-shake' : ''}
        ${className}
      `}
      onClick={handleCanvasClick}
      animate={screenShake ? { x: [-2, 2, -2, 2, 0] } : {}}
      transition={{ duration: 0.2 }}
    >
      {/* Western Background */}
      <div className="absolute inset-0">
        {/* Desert landscape silhouette */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface-800 to-transparent opacity-60" />
        
        {/* Cacti silhouettes */}
        <div className="absolute bottom-8 left-10 w-8 h-20 bg-surface-900 opacity-40" 
             style={{ clipPath: 'polygon(40% 0%, 60% 0%, 65% 30%, 80% 30%, 80% 35%, 65% 35%, 60% 100%, 40% 100%, 35% 35%, 20% 35%, 20% 30%, 35% 30%)' }} />
        <div className="absolute bottom-12 right-20 w-6 h-16 bg-surface-900 opacity-30"
             style={{ clipPath: 'polygon(35% 0%, 65% 0%, 70% 25%, 85% 25%, 85% 35%, 70% 35%, 65% 100%, 35% 100%, 30% 35%, 15% 35%, 15% 25%, 30% 25%)' }} />
        
        {/* Mountains in background */}
        <div className="absolute bottom-20 left-0 right-0 h-40 bg-gradient-to-t from-surface-700/20 to-transparent"
             style={{ clipPath: 'polygon(0% 100%, 25% 60%, 50% 80%, 75% 40%, 100% 70%, 100% 100%)' }} />
      </div>

      {/* Targets */}
      <AnimatePresence>
        {targets.map(target => (
          <div key={target.Id} data-target="true">
            <TargetSprite 
              target={target}
              onHit={handleTargetHit}
            />
          </div>
        ))}
      </AnimatePresence>

      {/* Muzzle Flash */}
      <AnimatePresence>
        {muzzleFlash && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="absolute w-8 h-8 bg-accent rounded-full pointer-events-none animate-muzzle-flash"
            style={{
              left: muzzleFlash.x,
              top: muzzleFlash.y
            }}
          />
        )}
      </AnimatePresence>

      {/* Bullet holes for misses */}
      <div className="absolute inset-0 pointer-events-none">
        {/* These would be dynamically added based on misses */}
      </div>
    </motion.div>
  )
}

export default GameCanvas