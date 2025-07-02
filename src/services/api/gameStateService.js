class GameStateService {
  constructor() {
    this.apperClient = null;
    this.currentGameStateId = null;
    this.initializeClient();
  }

  initializeClient() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getGameState() {
    try {
      if (!this.currentGameStateId) {
        // Create initial game state
        return await this.createGameState();
      }

      const params = {
        fields: [
          { field: { Name: "score" } },
          { field: { Name: "accuracy" } },
          { field: { Name: "time_remaining" } },
          { field: { Name: "combo" } },
          { field: { Name: "difficulty" } },
          { field: { Name: "is_playing" } },
          { field: { Name: "is_paused" } },
          { field: { Name: "shots_hit" } },
          { field: { Name: "shots_fired" } },
          { field: { Name: "high_score" } },
          { field: { Name: "best_accuracy" } }
        ]
      };

      const response = await this.apperClient.getRecordById('game_state', this.currentGameStateId, params);
      
      if (!response.success) {
        console.error('Failed to fetch game state:', response.message);
        return await this.createGameState();
      }

      return this.transformToClientFormat(response.data);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error('Error fetching game state:', error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return await this.createGameState();
    }
  }

  async createGameState() {
    try {
      const params = {
        records: [{
          score: 0,
          accuracy: 100.0,
          time_remaining: 60,
          combo: 0,
          difficulty: 'medium',
          is_playing: false,
          is_paused: false,
          shots_hit: 0,
          shots_fired: 0,
          high_score: 0,
          best_accuracy: 0.0
        }]
      };

      const response = await this.apperClient.createRecord('game_state', params);
      
      if (!response.success) {
        console.error('Failed to create game state:', response.message);
        return this.getDefaultState();
      }

      if (response.results && response.results.length > 0 && response.results[0].success) {
        this.currentGameStateId = response.results[0].data.Id;
        return this.transformToClientFormat(response.results[0].data);
      }

      return this.getDefaultState();
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error('Error creating game state:', error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return this.getDefaultState();
    }
  }

  async updateGameState(updates) {
    try {
      if (!this.currentGameStateId) {
        const gameState = await this.getGameState();
        if (!this.currentGameStateId) return gameState;
      }

      const dbUpdates = this.transformToDbFormat(updates);
      
      const params = {
        records: [{
          Id: this.currentGameStateId,
          ...dbUpdates
        }]
      };

      const response = await this.apperClient.updateRecord('game_state', params);
      
      if (!response.success) {
        console.error('Failed to update game state:', response.message);
        return await this.getGameState();
      }

      if (response.results && response.results.length > 0 && response.results[0].success) {
        return this.transformToClientFormat(response.results[0].data);
      }

      return await this.getGameState();
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error('Error updating game state:', error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return await this.getGameState();
    }
  }

  async startGame(difficulty = 'medium') {
    const timeMap = { easy: 90, medium: 60, hard: 45 };
    
    const updates = {
      score: 0,
      accuracy: 100.0,
      time_remaining: timeMap[difficulty] || 60,
      combo: 0,
      difficulty: difficulty,
      is_playing: true,
      is_paused: false,
      shots_hit: 0,
      shots_fired: 0
    };

    return await this.updateGameState(updates);
  }

  async endGame() {
    const updates = {
      is_playing: false,
      is_paused: false,
      time_remaining: 0
    };

    return await this.updateGameState(updates);
  }

  async resetGame() {
    const updates = {
      score: 0,
      accuracy: 100.0,
      time_remaining: 60,
      combo: 0,
      is_playing: false,
      is_paused: false,
      shots_hit: 0,
      shots_fired: 0
    };

    return await this.updateGameState(updates);
  }

  transformToClientFormat(dbData) {
    return {
      Id: dbData.Id,
      score: dbData.score || 0,
      accuracy: dbData.accuracy || 100,
      timeRemaining: dbData.time_remaining || 60,
      combo: dbData.combo || 0,
      difficulty: dbData.difficulty || 'medium',
      isPlaying: dbData.is_playing || false,
      isPaused: dbData.is_paused || false,
      shotsHit: dbData.shots_hit || 0,
      shotsFired: dbData.shots_fired || 0,
      highScore: dbData.high_score || 0,
      bestAccuracy: dbData.best_accuracy || 0
    };
  }

  transformToDbFormat(clientData) {
    const dbData = {};
    
    if (clientData.score !== undefined) dbData.score = clientData.score;
    if (clientData.accuracy !== undefined) dbData.accuracy = parseFloat(clientData.accuracy);
    if (clientData.timeRemaining !== undefined) dbData.time_remaining = clientData.timeRemaining;
    if (clientData.combo !== undefined) dbData.combo = clientData.combo;
    if (clientData.difficulty !== undefined) dbData.difficulty = clientData.difficulty;
    if (clientData.isPlaying !== undefined) dbData.is_playing = clientData.isPlaying;
    if (clientData.isPaused !== undefined) dbData.is_paused = clientData.isPaused;
    if (clientData.shotsHit !== undefined) dbData.shots_hit = clientData.shotsHit;
    if (clientData.shotsFired !== undefined) dbData.shots_fired = clientData.shotsFired;
    if (clientData.highScore !== undefined) dbData.high_score = clientData.highScore;
    if (clientData.bestAccuracy !== undefined) dbData.best_accuracy = parseFloat(clientData.bestAccuracy);

    return dbData;
  }

  getDefaultState() {
    return {
      Id: null,
      score: 0,
      accuracy: 100,
      timeRemaining: 60,
      combo: 0,
      difficulty: 'medium',
      isPlaying: false,
      isPaused: false,
      shotsHit: 0,
      shotsFired: 0,
      highScore: 0,
      bestAccuracy: 0
    };
  }
}

export default new GameStateService()