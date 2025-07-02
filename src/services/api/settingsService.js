class SettingsService {
  constructor() {
    this.apperClient = null;
    this.currentSettingsId = null;
    this.initializeClient();
  }

  initializeClient() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getSettings() {
    try {
      if (!this.currentSettingsId) {
        // Create initial settings
        return await this.createSettings();
      }

      const params = {
        fields: [
          { field: { Name: "sfx_volume" } },
          { field: { Name: "music_volume" } },
          { field: { Name: "crosshair_style" } }
        ]
      };

      const response = await this.apperClient.getRecordById('settings', this.currentSettingsId, params);
      
      if (!response.success) {
        console.error('Failed to fetch settings:', response.message);
        return await this.createSettings();
      }

      return this.transformToClientFormat(response.data);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error('Error fetching settings:', error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return await this.createSettings();
    }
  }

  async createSettings() {
    try {
      const params = {
        records: [{
          sfx_volume: 70,
          music_volume: 50,
          crosshair_style: 'classic'
        }]
      };

      const response = await this.apperClient.createRecord('settings', params);
      
      if (!response.success) {
        console.error('Failed to create settings:', response.message);
        return this.getDefaultSettings();
      }

      if (response.results && response.results.length > 0 && response.results[0].success) {
        this.currentSettingsId = response.results[0].data.Id;
        return this.transformToClientFormat(response.results[0].data);
      }

      return this.getDefaultSettings();
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error('Error creating settings:', error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return this.getDefaultSettings();
    }
  }

  async updateSettings(updates) {
    try {
      if (!this.currentSettingsId) {
        const settings = await this.getSettings();
        if (!this.currentSettingsId) return settings;
      }

      const dbUpdates = this.transformToDbFormat(updates);
      
      const params = {
        records: [{
          Id: this.currentSettingsId,
          ...dbUpdates
        }]
      };

      const response = await this.apperClient.updateRecord('settings', params);
      
      if (!response.success) {
        console.error('Failed to update settings:', response.message);
        return await this.getSettings();
      }

      if (response.results && response.results.length > 0 && response.results[0].success) {
        return this.transformToClientFormat(response.results[0].data);
      }

      return await this.getSettings();
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error('Error updating settings:', error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return await this.getSettings();
    }
  }

  async resetSettings() {
    const updates = {
      sfxVolume: 70,
      musicVolume: 50,
      crosshairStyle: 'classic'
    };

    return await this.updateSettings(updates);
  }

  transformToClientFormat(dbData) {
    return {
      Id: dbData.Id,
      sfxVolume: dbData.sfx_volume || 70,
      musicVolume: dbData.music_volume || 50,
      crosshairStyle: dbData.crosshair_style || 'classic'
    };
  }

  transformToDbFormat(clientData) {
    const dbData = {};
    
    if (clientData.sfxVolume !== undefined) dbData.sfx_volume = clientData.sfxVolume;
    if (clientData.musicVolume !== undefined) dbData.music_volume = clientData.musicVolume;
    if (clientData.crosshairStyle !== undefined) dbData.crosshair_style = clientData.crosshairStyle;

    return dbData;
  }

  getDefaultSettings() {
    return {
      Id: null,
      sfxVolume: 70,
      musicVolume: 50,
      crosshairStyle: 'classic'
    };
  }
}

export default new SettingsService()