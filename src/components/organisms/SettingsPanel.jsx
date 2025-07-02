import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Text from '@/components/atoms/Text'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'
import settingsService from '@/services/api/settingsService'

const SettingsPanel = ({ 
  isOpen, 
  onClose,
  className = '' 
}) => {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(false)

  // Load settings
  useEffect(() => {
    const loadSettings = async () => {
      if (!isOpen) return
      
      setLoading(true)
      try {
const result = await settingsService.getSettings()
        setSettings(result)
      } catch (error) {
        console.error('Failed to load settings:', error)
        toast.error('Failed to load settings')
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [isOpen])

  // Update setting
  const updateSetting = async (key, value) => {
    try {
      const updates = { [key]: value }
const result = await settingsService.updateSettings(updates)
      setSettings(result)
      toast.success('Settings saved')
    } catch (error) {
      console.error('Failed to update settings:', error)
      toast.error('Failed to save settings')
    }
  }

  // Reset settings
  const resetSettings = async () => {
    try {
const result = await settingsService.resetSettings()
      setSettings(result)
      toast.success('Settings reset to defaults')
    } catch (error) {
      console.error('Failed to reset settings:', error)
      toast.error('Failed to reset settings')
    }
  }

  if (!settings && !loading) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Settings Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className={`
              fixed right-0 top-0 bottom-0 w-full max-w-md
              bg-surface-900 border-l border-surface-600
              z-50 overflow-y-auto
              ${className}
            `}
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <Text variant="display" size="2xl" color="accent">
                  Settings
                </Text>
                <Button
                  variant="secondary"
                  size="small"
                  icon="X"
                  onClick={onClose}
                />
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-surface-700 rounded w-1/3 mb-2" />
                      <div className="h-10 bg-surface-700 rounded" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Audio Settings */}
                  <Card className="p-4">
                    <Text variant="heading" size="lg" color="secondary" className="mb-4">
                      Audio
                    </Text>
                    
                    <div className="space-y-4">
                      {/* SFX Volume */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Text variant="body" color="primary">
                            Sound Effects
                          </Text>
                          <Text variant="caption" color="accent">
                            {settings.sfxVolume}%
                          </Text>
                        </div>
                        <div className="relative">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={settings.sfxVolume}
                            onChange={(e) => updateSetting('sfxVolume', parseInt(e.target.value))}
                            className="w-full h-2 bg-surface-600 rounded-lg appearance-none cursor-crosshair
                                     slider:bg-accent slider:h-4 slider:w-4 slider:rounded-full"
                          />
                        </div>
                      </div>

                      {/* Music Volume */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Text variant="body" color="primary">
                            Background Music
                          </Text>
                          <Text variant="caption" color="accent">
                            {settings.musicVolume}%
                          </Text>
                        </div>
                        <div className="relative">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={settings.musicVolume}
                            onChange={(e) => updateSetting('musicVolume', parseInt(e.target.value))}
                            className="w-full h-2 bg-surface-600 rounded-lg appearance-none cursor-crosshair"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Gameplay Settings */}
                  <Card className="p-4">
                    <Text variant="heading" size="lg" color="secondary" className="mb-4">
                      Gameplay
                    </Text>
                    
                    <div className="space-y-4">
                      {/* Crosshair Style */}
                      <div>
                        <Text variant="body" color="primary" className="mb-2">
                          Crosshair Style
                        </Text>
                        <div className="grid grid-cols-3 gap-2">
                          {['classic', 'modern', 'minimal'].map(style => (
                            <Button
                              key={style}
                              variant={settings.crosshairStyle === style ? 'accent' : 'secondary'}
                              size="small"
                              onClick={() => updateSetting('crosshairStyle', style)}
                              className="capitalize"
                            >
                              {style}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Game Data */}
                  <Card className="p-4">
                    <Text variant="heading" size="lg" color="secondary" className="mb-4">
                      Game Data
                    </Text>
                    
                    <div className="space-y-4">
                      <Button
                        variant="danger"
                        size="medium"
                        icon="Trash2"
                        onClick={resetSettings}
                        className="w-full"
                      >
                        Reset All Settings
                      </Button>
                      
                      <Text variant="caption" color="muted" className="text-center">
                        This will reset all settings to their default values.
                        High scores will not be affected.
                      </Text>
                    </div>
                  </Card>

                  {/* Game Info */}
                  <Card className="p-4">
                    <Text variant="heading" size="lg" color="secondary" className="mb-4">
                      About
                    </Text>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <ApperIcon name="Target" className="w-5 h-5 text-accent" />
                        <Text variant="body" color="primary">
                          Wild West Showdown v1.0
                        </Text>
                      </div>
                      <div className="flex items-center gap-3">
                        <ApperIcon name="Gamepad2" className="w-5 h-5 text-secondary" />
                        <Text variant="caption" color="muted">
                          Test your aim in the lawless frontier
                        </Text>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default SettingsPanel