import axios from 'axios';
import { Certificate } from '../types';
import { API_BASE_URL } from '../config';
import { certificateContract } from './contract';
import { generateMockCertificate } from '../utils/mockData';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const API_URL = '/api/certificates';

// Mock database for local development
let mockCertificates: Certificate[] = [];

export const certificateService = {
  // Get all certificates for a user (backend handles admin vs. user)
  async getCertificates(): Promise<Certificate[]> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const res = await axios.get(API_URL, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return res.data;
    } catch (error) {
      console.error('Error fetching certificates:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          // Clear invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(error.response?.data?.message || 'Failed to fetch certificates');
      }
      throw error;
    }
  },

  // Get a single certificate by ID
  async getCertificateById(id: string): Promise<Certificate | null> {
    if (!id) {
      throw new Error('Certificate ID is required');
    }
    
    try {
      const res = await axios.get(`${API_URL}/${id}`, { 
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
      });
      const cert = res.data;
      return { ...cert, id: cert.id || cert._id };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          return null;
        }
        throw new Error(error.response?.data?.message || 'Failed to fetch certificate');
      }
      throw error;
    }
  },

  // Get certificates for a specific recipient (Admin only, backend enforces)
  async getCertificatesByRecipientId(recipientId: string): Promise<Certificate[]> {
    try {
      const res = await axios.get(`${API_URL}/recipient/${recipientId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return res.data;
    } catch (error) {
      console.error('Error fetching recipient certificates:', error);
      throw new Error(axios.isAxiosError(error) ? error.response?.data?.message || 'Failed to fetch recipient certificates' : 'Failed to fetch recipient certificates');
    }
  },

  // Issue a new certificate
  async issueCertificate(certificateData: Partial<Certificate>): Promise<Certificate> {
    const res = await axios.post(API_URL, certificateData, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    return res.data;
  },

  // Revoke a certificate
  async revokeCertificate(id: string): Promise<Certificate> {
    // Find the certificate
    const certificate = mockCertificates.find(cert => cert.id === id);
    
    if (!certificate) {
      throw new Error('Certificate not found');
    }
    
    try {
      // In a real app, this would revoke the certificate on the blockchain
      // For demo, just update the status
      certificate.status = 'revoked';
      
      return certificate;
    } catch (error) {
      console.error('Error revoking certificate:', error);
      throw new Error('Failed to revoke certificate');
    }
  },

  // Verify a certificate
  async verifyCertificate(verificationCode: string): Promise<Certificate | null> {
    try {
      const response = await axios.get(`${API_URL}/verify/${verificationCode}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          return null;
        }
        throw new Error(error.response?.data?.message || 'Failed to verify certificate');
      }
      throw error;
    }
  },

  // Generate a PDF of a certificate
  async generateCertificatePDF(id: string): Promise<string> {
    // Get the certificate
    const certificate = await this.getCertificateById(id);
    
    if (!certificate) {
      throw new Error('Certificate not found');
    }
    
    try {
      // In a real application, this would capture an HTML element and convert to PDF
      // For demo purposes, return a mock URL
      return `data:application/pdf;base64,JVBERi0xLjcKJeLjz9MKNSAwIG9iago8PC9GaWx0Z...`;
    } catch (error) {
      console.error('Error generating certificate PDF:', error);
      throw new Error('Failed to generate certificate PDF');
    }
  },

  // Download a certificate as a PDF
  async downloadCertificate(id: string): Promise<void> {
    try {
      // console.log('Attempting to download certificate with ID:', id); // Log start
      // 1. Get certificate element
      const certificateElement = document.getElementById('certificate-view');
      if (!certificateElement) {
        console.error('Error: Certificate element not found for PDF generation.'); // Log element not found
        throw new Error('Certificate element not found for PDF generation.');
      }

      // console.log('Certificate element found.', certificateElement); // Log element found

      // 2. Convert to canvas
      // console.log('Converting element to canvas...'); // Log canvas conversion start
      const canvas = await html2canvas(certificateElement, { scale: 2 }); // Increase scale for better resolution
      // console.log('Element converted to canvas.', canvas); // Log canvas conversion end
      const imgData = canvas.toDataURL('image/png');

      // 3. Create PDF
      // console.log('Creating PDF from canvas...'); // Log PDF creation start
      const pdf = new jsPDF('l', 'mm', 'a4'); // 'l' for landscape, 'mm' for millimeters, 'a4' for A4 size
      const imgWidth = 297; // A4 landscape width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      // console.log('PDF created.'); // Log PDF creation end

      // 4. Trigger download
      // console.log('Triggering PDF download.'); // Log download trigger
      pdf.save(`certificate-${id}.pdf`);

      // console.log('Certificate download process finished for ID:', id); // Log end
    } catch (error) {
      console.error('Error generating or downloading certificate PDF:', error); // Log error with details
      throw new Error('Failed to download certificate PDF.');
    }
  },

  // Permanently delete a certificate (admin only)
  async deleteCertificate(id: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    } catch (error) {
      console.error('Error deleting certificate:', error);
      throw new Error(axios.isAxiosError(error) ? error.response?.data?.message || 'Failed to delete certificate' : 'Failed to delete certificate');
    }
  },

  // Soft delete a certificate for the current user
  async softDeleteCertificate(id: string): Promise<void> {
    try {
      await axios.put(`${API_URL}/soft-delete/${id}`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    } catch (error) {
      console.error('Error soft-deleting certificate:', error);
      throw new Error(axios.isAxiosError(error) ? error.response?.data?.message || 'Failed to soft-delete certificate' : 'Failed to soft-delete certificate');
    }
  }
};