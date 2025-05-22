import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useWeb3 } from '../../contexts/Web3Context';
import CertificateForm from '../../components/admin/CertificateForm';
import Button from '../../components/common/Button';
import { ArrowLeft, AlertTriangle, CheckCircle } from 'lucide-react';
import { certificateService } from '../../services/certificate';

const IssueCertificate: React.FC = () => {
  const { authState } = useAuth();
  const { web3State, isXDCNetwork, switchToXDCNetwork } = useWeb3();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Check if user is admin
  if (!authState.isAuthenticated || authState.user?.role !== 'admin') {
    navigate('/login');
    return null;
  }
  
  const handleIssueCertificate = async (data: any) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      
      // Check if wallet is connected
      if (!web3State.isConnected) {
        setError('Please connect your XDC wallet to issue certificates');
        return;
      }
      
      // Check if connected to XDC network
      if (!isXDCNetwork) {
        await switchToXDCNetwork();
        if (!isXDCNetwork) {
          setError('Please switch to the XDC network in your wallet');
          return;
        }
      }
      
      // Generate a unique code for the certificate
      const code = `CERT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      // Prepare certificate data in the structure expected by the backend
      const certificateData = {
        code,
        recipient: {
          name: data.recipientName,
          email: data.recipientEmail,
          walletAddress: data.recipientWalletAddress,
        },
        issuer: authState.user?.id,
        issuedAt: data.issueDate ? new Date(data.issueDate) : new Date(),
        expiresAt: data.expiryDate ? new Date(data.expiryDate) : undefined,
        status: 'issued' as const,
        metadata: {
          title: data.title,
          description: data.description,
          institutionName: data.institutionName || 'XDC Institution',
          institutionId: data.institutionId || 'INST-001',
        }
      };
      
      // Issue the certificate
      const certificate = await certificateService.issueCertificate(certificateData);
      
      setSuccess(`Certificate issued successfully! Certificate ID: ${certificate.id}`);
      
      // Navigate to the certificate detail after a short delay
      setTimeout(() => {
        navigate(`/certificates/${certificate.id}`);
      }, 2000);
    } catch (err) {
      console.error('Error issuing certificate:', err);
      setError('Failed to issue certificate. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          leftIcon={<ArrowLeft className="h-4 w-4" />}
          onClick={() => navigate('/admin')}
        >
          Back to Dashboard
        </Button>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <h1 className="text-xl font-semibold text-gray-900">Issue New Certificate</h1>
          <p className="mt-1 text-sm text-gray-600">
            Fill in the details to issue a new blockchain-verified certificate
          </p>
        </div>
        
        <div className="px-6 py-6">
          {/* Network Warning */}
          {web3State.isConnected && !isXDCNetwork && (
            <div className="mb-6 p-4 bg-yellow-50 rounded-md flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Network Warning</h3>
                <p className="mt-2 text-sm text-yellow-700">
                  You are not connected to the XDC Network. Please switch networks in your wallet.
                </p>
                <div className="mt-3">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={switchToXDCNetwork}
                  >
                    Switch to XDC Network
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 rounded-md">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-red-400 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="mt-2 text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 rounded-md">
              <div className="flex">
                <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-green-800">Success</h3>
                  <p className="mt-2 text-sm text-green-700">{success}</p>
                </div>
              </div>
            </div>
          )}
          
          <CertificateForm 
            onSubmit={handleIssueCertificate}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default IssueCertificate;