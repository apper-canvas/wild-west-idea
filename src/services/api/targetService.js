const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class TargetService {
  constructor() {
    this.data = []
    this.nextId = 1
  }

  async getAll() {
    await delay(50)
    return [...this.data]
  }

  async getById(id) {
    await delay(50)
    const target = this.data.find(item => item.Id === parseInt(id))
    return target ? { ...target } : null
  }

  async create(targetData) {
    await delay(100)
    const newTarget = {
      Id: this.nextId++,
      type: targetData.type || 'outlaw',
      x: targetData.x || Math.random() * 800,
      y: targetData.y || Math.random() * 400 + 100,
      speed: targetData.speed || 1,
      points: targetData.points || 100,
      isHit: false,
      direction: targetData.direction || (Math.random() > 0.5 ? 1 : -1),
      createdAt: Date.now()
    }
    this.data.push(newTarget)
    return { ...newTarget }
  }

  async update(id, updates) {
    await delay(50)
    const index = this.data.findIndex(item => item.Id === parseInt(id))
    if (index === -1) return null
    
    this.data[index] = { ...this.data[index], ...updates }
    return { ...this.data[index] }
  }

  async delete(id) {
    await delay(50)
    const index = this.data.findIndex(item => item.Id === parseInt(id))
    if (index === -1) return false
    
    this.data.splice(index, 1)
    return true
  }

  async clearAll() {
    await delay(100)
    this.data = []
    return true
  }

  async hitTarget(id) {
    await delay(50)
    const target = await this.update(id, { isHit: true })
    if (target) {
      // Remove target after short delay to show hit animation
      setTimeout(() => this.delete(id), 200)
    }
    return target
  }

  generateTarget(difficulty = 'medium') {
    const targetTypes = {
      easy: [
        { type: 'bottle', points: 50, speed: 0.5 },
        { type: 'outlaw', points: 100, speed: 0.8 },
        { type: 'poster', points: 75, speed: 0.6 }
      ],
      medium: [
        { type: 'bottle', points: 75, speed: 1 },
        { type: 'outlaw', points: 150, speed: 1.2 },
        { type: 'poster', points: 100, speed: 1 },
        { type: 'bandit', points: 200, speed: 1.5 }
      ],
      hard: [
        { type: 'bottle', points: 100, speed: 1.8 },
        { type: 'outlaw', points: 200, speed: 2 },
        { type: 'poster', points: 150, speed: 1.8 },
        { type: 'bandit', points: 300, speed: 2.5 },
        { type: 'sheriff', points: -100, speed: 1.2 } // Don't shoot the sheriff!
      ]
    }

    const availableTargets = targetTypes[difficulty] || targetTypes.medium
    const targetTemplate = availableTargets[Math.floor(Math.random() * availableTargets.length)]
    
    return {
      ...targetTemplate,
      x: Math.random() > 0.5 ? -100 : window.innerWidth + 100,
      y: 150 + Math.random() * 300,
      direction: Math.random() > 0.5 ? 1 : -1
    }
  }
}

export default new TargetService()