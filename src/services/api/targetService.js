class TargetService {
  constructor() {
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "type" } },
          { field: { Name: "x" } },
          { field: { Name: "y" } },
          { field: { Name: "speed" } },
          { field: { Name: "points" } },
          { field: { Name: "is_hit" } },
          { field: { Name: "direction" } },
          { field: { Name: "created_at" } }
        ],
        orderBy: [
          { fieldName: "created_at", sorttype: "DESC" }
        ]
      };

      const response = await this.apperClient.fetchRecords('target', params);
      
      if (!response.success) {
        console.error('Failed to fetch targets:', response.message);
        return [];
      }

      return response.data.map(target => this.transformToClientFormat(target));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error('Error fetching targets:', error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "type" } },
          { field: { Name: "x" } },
          { field: { Name: "y" } },
          { field: { Name: "speed" } },
          { field: { Name: "points" } },
          { field: { Name: "is_hit" } },
          { field: { Name: "direction" } },
          { field: { Name: "created_at" } }
        ]
      };

      const response = await this.apperClient.getRecordById('target', parseInt(id), params);
      
      if (!response.success) {
        console.error('Failed to fetch target:', response.message);
        return null;
      }

      return this.transformToClientFormat(response.data);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error('Error fetching target:', error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async create(targetData) {
    try {
      const dbData = this.transformToDbFormat(targetData);
      
      const params = {
        records: [dbData]
      };

      const response = await this.apperClient.createRecord('target', params);
      
      if (!response.success) {
        console.error('Failed to create target:', response.message);
        return null;
      }

      if (response.results && response.results.length > 0 && response.results[0].success) {
        return this.transformToClientFormat(response.results[0].data);
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error('Error creating target:', error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async update(id, updates) {
    try {
      const dbUpdates = this.transformToDbFormat(updates);
      
      const params = {
        records: [{
          Id: parseInt(id),
          ...dbUpdates
        }]
      };

      const response = await this.apperClient.updateRecord('target', params);
      
      if (!response.success) {
        console.error('Failed to update target:', response.message);
        return null;
      }

      if (response.results && response.results.length > 0 && response.results[0].success) {
        return this.transformToClientFormat(response.results[0].data);
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error('Error updating target:', error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord('target', params);
      
      if (!response.success) {
        console.error('Failed to delete target:', response.message);
        return false;
      }

      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error('Error deleting target:', error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }

  async clearAll() {
    try {
      // First get all targets
      const targets = await this.getAll();
      
      if (targets.length === 0) return true;

      const targetIds = targets.map(target => target.Id);
      
      const params = {
        RecordIds: targetIds
      };

      const response = await this.apperClient.deleteRecord('target', params);
      
      if (!response.success) {
        console.error('Failed to clear all targets:', response.message);
        return false;
      }

      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error('Error clearing targets:', error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }

  async hitTarget(id) {
    const target = await this.update(id, { isHit: true });
    if (target) {
      // Remove target after short delay to show hit animation
      setTimeout(() => this.delete(id), 200);
    }
    return target;
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
    };

    const availableTargets = targetTypes[difficulty] || targetTypes.medium;
    const targetTemplate = availableTargets[Math.floor(Math.random() * availableTargets.length)];
    
    return {
      ...targetTemplate,
      x: Math.random() > 0.5 ? -100 : window.innerWidth + 100,
      y: 150 + Math.random() * 300,
      direction: Math.random() > 0.5 ? 1 : -1,
      created_at: new Date().toISOString()
    };
  }

  transformToClientFormat(dbData) {
    return {
      Id: dbData.Id,
      type: dbData.type || 'outlaw',
      x: dbData.x || 0,
      y: dbData.y || 0,
      speed: dbData.speed || 1,
      points: dbData.points || 100,
      isHit: dbData.is_hit || false,
      direction: dbData.direction || 1,
      createdAt: dbData.created_at || Date.now()
    };
  }

  transformToDbFormat(clientData) {
    const dbData = {};
    
    if (clientData.type !== undefined) dbData.type = clientData.type;
    if (clientData.x !== undefined) dbData.x = clientData.x;
    if (clientData.y !== undefined) dbData.y = clientData.y;
    if (clientData.speed !== undefined) dbData.speed = parseFloat(clientData.speed);
    if (clientData.points !== undefined) dbData.points = clientData.points;
    if (clientData.isHit !== undefined) dbData.is_hit = clientData.isHit;
    if (clientData.direction !== undefined) dbData.direction = clientData.direction;
    if (clientData.createdAt !== undefined) {
      dbData.created_at = typeof clientData.createdAt === 'number' 
        ? new Date(clientData.createdAt).toISOString()
        : clientData.createdAt;
    }

    return dbData;
  }
}

export default new TargetService()