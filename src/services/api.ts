import axios from 'axios';

const BASE_URL = 'https://api.example.com';

export const tramApi = {
  getSchedule: async (stopId: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/schedule/${stopId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tram schedule:', error);
      throw error;
    }
  },

  getStops: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/stops`);
      return response.data;
    } catch (error) {
      console.error('Error fetching stops:', error);
      throw error;
    }
  }
};