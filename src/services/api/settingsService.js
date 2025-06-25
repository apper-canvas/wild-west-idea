const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class SettingsService {
  constructor() {
    this.data = {
      Id: 1,
      sfxVolume: parseInt(localStorage.getItem('wildWestSfxVolume') || '70'),
      musicVolume: parseInt(localStorage.getItem('wildWestMusicVolume') || '50'),
      crosshairStyle: localStorage.getItem('wildWestCrosshairStyle') || 'classic'
    }
  }

  async getSettings() {
    await delay(100)
    return { ...this.data }
  }

  async updateSettings(updates) {
    await delay(150)
    this.data = { ...this.data, ...updates }
    
    // Persist to localStorage
    if (updates.sfxVolume !== undefined) {
      localStorage.setItem('wildWestSfxVolume', updates.sfxVolume.toString())
    }
    if (updates.musicVolume !== undefined) {
      localStorage.setItem('wildWestMusicVolume', updates.musicVolume.toString())
    }
    if (updates.crosshairStyle !== undefined) {
      localStorage.setItem('wildWestCrosshairStyle', updates.crosshairStyle)
    }

    return { ...this.data }
  }

  async resetSettings() {
    await delay(100)
    this.data = {
      Id: 1,
      sfxVolume: 70,
      musicVolume: 50,
      crosshairStyle: 'classic'
    }
    
    localStorage.removeItem('wildWestSfxVolume')
    localStorage.removeItem('wildWestMusicVolume')
    localStorage.removeItem('wildWestCrosshairStyle')
    
    return { ...this.data }
  }
}

export default new SettingsService()