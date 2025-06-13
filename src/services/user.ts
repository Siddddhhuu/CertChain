import axios from 'axios';

const API_URL = '/api/user';

interface User {
  id: string;
  email: string;
  role: string;
  walletAddress?: string; // Add walletAddress as optional, just in case
  // Add other user properties as needed
}

interface UserProfileData {
  id: string; // Use id in the frontend interface
  name?: string;
  email: string;
  walletAddress?: string;
  role: string;
  phoneNumber?: string;
  address?: string;
  profilePictureUrl?: string;
  // Add other profile fields you want to display
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
  async createUser(userData: any): Promise<UserProfileData> {
    try {
      const res = await axios.post(API_URL, userData, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      // Map _id to id for frontend use
      const user = res.data;
      return { ...user, id: user._id || user.id };
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error(axios.isAxiosError(error) ? error.response?.data?.message || 'Failed to create user' : 'Failed to create user');
    }
  },

  // Get a single user by ID
  async getUserById(id: string): Promise<UserProfileData> {
    try {
      const res = await axios.get(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      // Map _id to id for frontend use
      const user = res.data;
      return { ...user, id: user._id || user.id };
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw new Error(axios.isAxiosError(error) ? error.response?.data?.message || 'Failed to fetch user' : 'Failed to fetch user');
    }
  },

  // Update a user by ID
  async updateUser(id: string, userData: any): Promise<UserProfileData> {
    try {
      // Ensure the ID is included in the data sent, backend expects _id in body sometimes or uses param
      const dataToSend = { ...userData };
       if (dataToSend.id) {
         dataToSend._id = dataToSend.id; // Map id back to _id for backend if present
         delete dataToSend.id; // Remove id to avoid conflicts
       }

      const res = await axios.put(`${API_URL}/${id}`, dataToSend, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      // Map _id to id for frontend use in the response
      const user = res.data;
       return { ...user, id: user._id || user.id };
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error(axios.isAxiosError(error) ? error.response?.data?.message || 'Failed to update user' : 'Failed to update user');
    }
  },

  // Upload profile picture
  async uploadProfilePicture(userId: string, file: File): Promise<UserProfileData> {
    try {
      // console.log('Starting profile picture upload for user ID:', userId); // Debug log
      const formData = new FormData();
      formData.append('profilePicture', file);

      const res = await axios.post(
        `${API_URL}/${userId}/profile-picture`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      // console.log('Profile picture uploaded successfully:', res.data); // Debug log
      return res.data;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw new Error(axios.isAxiosError(error) ? error.response?.data?.message || 'Failed to upload profile picture' : 'Failed to upload profile picture');
    }
  },

  // You can add other user-related service functions here later
}; 