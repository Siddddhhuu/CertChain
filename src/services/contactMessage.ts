import axios from 'axios';

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

const API_URL = '/api/contact';

export const getAllContactMessages = async (): Promise<ContactMessage[]> => {
  try {
    const response = await axios.get<ContactMessage[]>(API_URL, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    return response.data;
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    throw error;
  }
};

export const softDeleteContactMessage = async (id: string): Promise<void> => {
  try {
    await axios.put(`${API_URL}/${id}/soft-delete`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
  } catch (error) {
    console.error('Error soft-deleting contact message:', error);
    throw error;
  }
}; 