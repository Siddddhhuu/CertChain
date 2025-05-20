import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { certificateService } from '../../services/certificate';
import { Certificate } from '../../types';
import CertificateView from '../../components/certificates/CertificateView';
import Button from '../../components/common/Button';
import { Download, ArrowLeft, Share2, Copy, AlertTriangle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const CertificateDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    const loadCertificate = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const cert = await certificateService.getCertificateById(id);
        
        if (!cert) {
          setError('Certificate not found');
          return;
        }
        
        setCertificate(cert);
        setShareUrl(`${window.location.origin}/verify/${cert.verificationCode}`);
      } catch (err) {
        console.error('Error loading certificate:', err);
        setError('Failed to load certificate');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCertificate();
  }, [id]);
  
  const handleDownload = async () => {
    if (!certificate) return;
    
    try {
      await certificateService.downloadCertificate(certificate.id);
    } catch (err) {
      console.error('Error downloading certificate:', err);
      alert('Failed to download certificate');
    }
  };
  
  const handleShare = async () => {
    if (!certificate) return;
    
    try {
      // Try to use the Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: `Certificate: ${certificate.title}`,
          text: `Check out my certificate: ${certificate.title}`,
          url: shareUrl,
        });
        return;
      }
      
      // Fallback to clipboard
      handleCopyLink();
    } catch (err) {
      console.error('Error sharing certificate:', err);
    }
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error || !certificate) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-red-800">Error</h3>
              <p className="text-red-700 mt-1">{error || 'Certificate not found'}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={() => navigate('/certificates')}
              >
                Back to Certificates
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          leftIcon={<ArrowLeft className="h-4 w-4" />}
          onClick={() => navigate('/certificates')}
        >
          Back to Certificates
        </Button>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Certificate Details</h1>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Button
              variant="outline"
              leftIcon={copied ? <Copy className="h-5 w-5 text-green-500" /> : <Share2 className="h-5 w-5" />}
              onClick={handleCopyLink}
            >
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>
            <Button
              variant="primary"
              leftIcon={<Download className="h-5 w-5" />}
              onClick={handleDownload}
            >
              Download PDF
            </Button>
          </div>
        </div>
        
        <div className="mb-8">
          <CertificateView certificate={certificate} />
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Share Certificate</h3>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="bg-white p-3 border border-gray-200 rounded-lg">
              <QRCodeSVG 
                value={shareUrl} 
                size={150} 
                level="H"
              />
            </div>
            <div className="flex-grow">
              <p className="text-sm text-gray-600 mb-2">
                Share this QR code or verification link to allow others to verify this certificate:
              </p>
              <div className="flex w-full">
                <input 
                  type="text" 
                  value={shareUrl} 
                  readOnly 
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-sm"
                />
                <Button
                  variant="primary"
                  className="rounded-l-none"
                  onClick={handleCopyLink}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              <div className="mt-4">
                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<Share2 className="h-5 w-5" />}
                  onClick={handleShare}
                >
                  Share Certificate
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateDetail;