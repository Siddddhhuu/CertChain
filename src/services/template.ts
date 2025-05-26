import axios from 'axios';
import { CertificateTemplate } from '../types';

const API_URL = '/api/templates';

export const templateService = {
  async getAllTemplates(): Promise<CertificateTemplate[]> {
    try {
      const response = await axios.get<CertificateTemplate[]>(API_URL, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      // Map _id to id for frontend consistency
      return response.data.map(template => ({ ...template, id: template._id || template.id }));
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
  },

  async getTemplateById(id: string): Promise<CertificateTemplate> {
    try {
      const response = await axios.get<CertificateTemplate>(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      // Map _id to id for frontend consistency
      const template = response.data;
      return { ...template, id: template._id || template.id };
    } catch (error) {
      console.error(`Error fetching template ${id}:`, error);
      throw error;
    }
  },

  async createTemplate(templateData: Omit<CertificateTemplate, 'id' | '_id' | 'createdBy'>): Promise<CertificateTemplate> {
    try {
      const response = await axios.post<CertificateTemplate>(API_URL, templateData, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      // Map _id to id for frontend consistency
      const template = response.data;
       return { ...template, id: template._id || template.id };
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  },

  async updateTemplate(id: string, templateData: Partial<Omit<CertificateTemplate, 'id' | '_id' | 'createdBy'>>): Promise<CertificateTemplate> {
    try {
      const response = await axios.put<CertificateTemplate>(`${API_URL}/${id}`, templateData, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      // Map _id to id for frontend consistency
       const template = response.data;
       return { ...template, id: template._id || template.id };
    } catch (error) {
      console.error(`Error updating template ${id}:`, error);
      throw error;
    }
  },

  async deleteTemplate(id: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    } catch (error) {
      console.error(`Error deleting template ${id}:`, error);
      throw error;
    }
  },
}; 