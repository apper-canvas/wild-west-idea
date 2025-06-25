const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class GameStateService {
  constructor() {
    this.data = {
      Id: 1,
      score: 0,
      accuracy: 100,
      timeRemaining: 60,
      combo: 0,
      difficulty: 'medium',
      isPlaying: false,
      isPaused: false,
      shotsHit: 0,
      shotsFired: 0,
      highScore: parseInt(localStorage.getItem('wildWestHighScore') || '0'),
      bestAccuracy: parseInt(localStorage.getItem('wildWestBestAccuracy') || '0')
    }
  }

  async getGameState() {
    await delay(100)
    return { ...this.data }
  }

  async updateGameState(updates) {
    await delay(100)
    this.data = { ...this.data, ...updates }
    
    // Calculate accuracy
    if (this.data.shotsFired > 0) {
      this.data.accuracy = Math.round((this.data.shotsHit / this.data.shotsFired) * 100)
    }

    // Update high scores
    if (this.data.score > this.data.highScore) {
      this.data.highScore = this.data.score
      localStorage.setItem('wildWestHighScore', this.data.score.toString())
    }

    if (this.data.accuracy > this.data.bestAccuracy && this.data.shotsFired >= 10) {
      this.data.bestAccuracy = this.data.accuracy
      localStorage.setItem('wildWestBestAccuracy', this.data.accuracy.toString())
    }

    return { ...this.data }
  }

  async resetGame() {
    await delay(100)
    this.data = {
      ...this.data,
      score: 0,
      accuracy: 100,
      timeRemaining: 60,
      combo: 0,
      isPlaying: false,
      isPaused: false,
      shotsHit: 0,
      shotsFired: 0
    }
    return { ...this.data }
  }

  async startGame(difficulty = 'medium') {
    await delay(200)
    const timeMap = { easy: 90, medium: 60, hard: 45 }
    
    this.data = {
      ...this.data,
      score: 0,
      accuracy: 100,
      timeRemaining: timeMap[difficulty] || 60,
      combo: 0,
      difficulty,
      isPlaying: true,
      isPaused: false,
      shotsHit: 0,
      shotsFired: 0
    }
    return { ...this.data }
  }

  async endGame() {
    await delay(100)
    this.data = {
      ...this.data,
      isPlaying: false,
      isPaused: false,
      timeRemaining: 0
    }
    return { ...this.data }
  }
}

export default new GameStateService()