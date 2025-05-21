import axios from 'axios';
import { Certificate } from '../types';
import { certificateContract } from './contract';
import { generateMockCertificate } from '../utils/mockData';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const API_URL = '/api/certificates'; // Adjust if your backend route is different

// Mock database for local development
let mockCertificates: Certificate[] = [];

export const certificateService = {
  // Get all certificates for a user
  async getCertificates(): Promise<Certificate[]> {
    const res = await axios.get(API_URL, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    return res.data;
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
    // Find the certificate by verification code
    const certificate = mockCertificates.find(cert => cert.verificationCode === verificationCode);
    
    if (!certificate) {
      return null;
    }
    
    // In a real app, this would verify the certificate on the blockchain
    const isValid = certificateContract.mockVerifyCertificate();
    
    if (!isValid) {
      return null;
    }
    
    return certificate;
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
      // For real implementation, we would:
      // 1. Get certificate element
      // 2. Convert to canvas
      // 3. Create PDF
      // 4. Trigger download
      
      // Demo code (commented out as it's not functional without actual DOM elements)
      /*
      const certificateElement = document.getElementById('certificate-view');
      if (!certificateElement) throw new Error('Certificate element not found');
      
      const canvas = await html2canvas(certificateElement);
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`certificate-${id}.pdf`);
      */
      
      console.log('Certificate download simulated for ID:', id);
    } catch (error) {
      console.error('Error downloading certificate:', error);
      throw new Error('Failed to download certificate');
    }
  }
};