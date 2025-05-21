import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CertificateCard from '../../components/certificates/CertificateCard';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Search, Download, Share2, Plus, RefreshCw } from 'lucide-react';
import { Certificate } from '../../types';
import { generateMockCertificates } from '../../utils/mockData';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { certificateService } from '../../services/certificate';

const CertificateList: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { authState } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    certificateService.getCertificates().then(data => {
      setCertificates(data);
      setIsLoading(false);
    });
  }, []);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredCertificates = certificates.filter(cert => 
  cert.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  cert.institutionName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewCertificate = (id: string) => {
    navigate(`/certificates/${id}`);
  };
  
  const handleDownloadCertificate = async (id: string) => {
    try {
      // In a real app, you'd generate a PDF from the server or use a library
      // For demo purposes, we'll just simulate the download
      
      alert(`Certificate ${id} download started`);
      
      // In a real implementation:
      // 1. Fetch the certificate data
      // 2. Use html2canvas to capture the certificate view
      // 3. Convert to PDF with jsPDF
      // 4. Trigger download
      
      // Example code (not executed here):
      // const certificateElement = document.getElementById('certificate-view');
      // const canvas = await html2canvas(certificateElement);
      // const imgData = canvas.toDataURL('image/png');
      // const pdf = new jsPDF('l', 'mm', 'a4');
      // pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);
      // pdf.save(`certificate-${id}.pdf`);
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert('Failed to download certificate');
    }
  };
  
  const handleShareCertificate = (id: string) => {
    // In a real app, you'd generate a shareable link
    // For demo purposes, we'll just show a message
    
    const shareableLink = `https://certchain.example/verify/${id}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareableLink)
      .then(() => {
        alert(`Shareable link copied to clipboard: ${shareableLink}`);
      })
      .catch(err => {
        console.error('Failed to copy link:', err);
        alert(`Your shareable link: ${shareableLink}`);
      });
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            My Certificates
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage all your digital certificates
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          {authState.user?.role === 'admin' && (
            <Button
              variant="primary"
              leftIcon={<Plus className="h-5 w-5" />}
              onClick={() => navigate('/admin/certificates/new')}
            >
              Issue Certificate
            </Button>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6 mb-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="w-full max-w-lg">
            <Input
              placeholder="Search certificates..."
              value={searchTerm}
              onChange={handleSearch}
              leftIcon={<Search className="h-5 w-5 text-gray-400" />}
            />
          </div>
          <div className="mt-4 md:mt-0">
            <Button
              variant="outline"
              leftIcon={<RefreshCw className="h-5 w-5" />}
              onClick={() => {
                setIsLoading(true);
                certificateService.getCertificates().then(data => {
                  setCertificates(data);
                  setIsLoading(false);
                });
              }}
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredCertificates.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCertificates.map((certificate) => (
            <CertificateCard
              key={certificate.id}
              certificate={certificate}
              onView={handleViewCertificate}
              onDownload={handleDownloadCertificate}
              onShare={handleShareCertificate}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">No certificates found</p>
          {searchTerm && (
            <p className="mt-2 text-sm text-gray-400">
              Try adjusting your search terms
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CertificateList;