import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000'; // Default to localhost if env var not set

const apiService = {
  getAllBots: async (query) => {
    try {
      const response = await axios.get(`${apiUrl}/bots`, { params: { query } });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch bots');
    }
  },
  getBotById: async (botId) => {
    try {
      const response = await axios.get(`${apiUrl}/bots/${botId}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch bot');
    }
  },
  getAllCategories: async () => {
    try {
      const response = await axios.get(`${apiUrl}/categories`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch categories');
    }
  },
  submitBot: async (botData) => {
    try {
      const response = await axios.post(`${apiUrl}/bots`, botData);
      return response.data;
    } catch (error) {
      throw new Error('Failed to submit bot');
    }
  },
  getBotReviews: async (botId) => {
    try {
      const response = await axios.get(`${apiUrl}/bots/${botId}/reviews`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch reviews');
    }
  },
  createReview: async (reviewData) => {
    try {
      const response = await axios.post(`${apiUrl}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      throw new Error('Failed to create review');
    }
  },
  getAllUsers: async () => {
    try {
      const response = await axios.get(`${apiUrl}/users`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch users');
    }
  },
  updateBotApproval: async (botId, approved) => {
    try {
      await axios.put(`${apiUrl}/bots/${botId}/approve`, { approved });
    } catch (error) {
      throw new Error('Failed to update bot approval');
    }
  },
  deleteBot: async (botId) => {
    try {
      await axios.delete(`${apiUrl}/bots/${botId}`);
    } catch (error) {
      throw new Error('Failed to delete bot');
    }
  },
  updateUserBanStatus: async (userId, banned) => {
    try {
      await axios.put(`${apiUrl}/users/${userId}/ban`, { banned });
    } catch (error) {
      throw new Error('Failed to update user ban status');
    }
  },
  updateSetting: async (setting, value) => {
    try {
      await axios.put(`${apiUrl}/settings`, { setting, value });
    } catch (error) {
      throw new Error('Failed to update setting');
    }
  }
};

export default apiService;
```