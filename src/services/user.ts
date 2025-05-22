import axios from 'axios';

const API_URL = '/api/user';

interface User {
  id: string;
  email: string;
  role: string;
  walletAddress?: string; // Add walletAddress as optional, just in case
  // Add other user properties as needed
}

export const userService = {
  async getAllUsers(): Promise<User[]> {
    try {
      const res = await axios.get(API_URL, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      return res.data;
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw new Error(axios.isAxiosError(error) ? error.response?.data?.message || 'Failed to fetch users' : 'Failed to fetch users');
    }
  },

  // Create a new user
  async createUser(userData: any): Promise<User> {
    try {
      const res = await axios.post(API_URL, userData, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      return res.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error(axios.isAxiosError(error) ? error.response?.data?.message || 'Failed to create user' : 'Failed to create user');
    }
  },

  // You can add other user-related service functions here later
}; 