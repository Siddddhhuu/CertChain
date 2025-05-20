import { Certificate } from '../types';
import { certificateContract } from './contract';
import { generateMockCertificate } from '../utils/mockData';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Mock database for local development
let mockCertificates: Certificate[] = [];

export const certificateService = {
  // Get all certificates for a user
  async getCertificates(userId: string): Promise<Certificate[]> {
    // In a real application, this would be an API call
    // For now, return mock data if available or generate new ones
    if (mockCertificates.length === 0) {
      mockCertificates = Array.from({ length: 5 }, () => generateMockCertificate(userId));
    }
    return mockCertificates;
  },

  // Get a single certificate by ID
  async getCertificateById(id: string): Promise<Certificate | null> {
    // In a real application, this would be an API call
    const certificate = mockCertificates.find(cert => cert.id === id);
    return certificate || null;
  },

  // Issue a new certificate
  async issueCertificate(certificateData: Omit<Certificate, 'id' | 'transactionHash' | 'status' | 'verificationCode' | 'ipfsHash' | 'credentialId'>): Promise<Certificate> {
    // Generate certificate ID and verification code
    const id = Math.random().toString(36).substring(2, 12);
    const verificationCode = Math.random().toString(36).substring(2, 14);
    const credentialId = `CERT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const ipfsHash = `Qm${Array.from({ length: 44 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    
    // Create the certificate object
    const newCertificate: Certificate = {
      ...certificateData,
      id,
      credentialId,
      ipfsHash,
      status: 'issued',
      verificationCode,
      metadata: {
        courseLength: '6 months',
        creditHours: 120,
        grade: 'A',
      }
    };
    
    try {
      // In a real app, this would issue the certificate on the blockchain
      // For demo, use the mock function
      const txHash = certificateContract.mockIssueCertificate();
      
      // Update the certificate with the transaction hash
      newCertificate.transactionHash = txHash;
      
      // Add to mock database
      mockCertificates.push(newCertificate);
      
      return newCertificate;
    } catch (error) {
      console.error('Error issuing certificate:', error);
      throw new Error('Failed to issue certificate');
    }
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