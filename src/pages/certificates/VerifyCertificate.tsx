import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { certificateService } from '../../services/certificate';
import { Certificate } from '../../types';
import CertificateView from '../../components/certificates/CertificateView';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Search, AlertTriangle, CheckCircle, AlignCenterVertical as CertIcon } from 'lucide-react';

const VerifyCertificate: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  
  const [verificationCode, setVerificationCode] = useState(code || '');
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode.trim()) {
      setErrorMessage('Please enter a verification code');
      setVerificationStatus('error');
      return;
    }
    
    try {
      setIsLoading(true);
      setVerificationStatus('idle');
      setErrorMessage('');
      
      // Call the verify API
      const result = await certificateService.verifyCertificate(verificationCode);
      
      if (!result) {
        setVerificationStatus('error');
        setErrorMessage('Invalid or expired certificate. Could not verify.');
        setCertificate(null);
      } else {
        setVerificationStatus('success');
        setCertificate(result);
      }
    } catch (error) {
      console.error('Error verifying certificate:', error);
      setVerificationStatus('error');
      setErrorMessage('Failed to verify certificate. Please try again.');
      setCertificate(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Auto-verify if code is provided in URL
  React.useEffect(() => {
    if (code && !certificate && !isLoading && verificationStatus === 'idle') {
      handleVerify(new Event('submit') as any);
    }
  }, [code]);
  
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-4">
          <CertIcon className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Verify Certificate</h1>
        <p className="mt-2 text-lg text-gray-600">
          Verify the authenticity of a blockchain certificate
        </p>
      </div>
      
      <Card className="mb-8">
        <CardContent className="p-6">
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="sm:flex sm:items-center">
              <div className="w-full">
                <Input
                  placeholder="Enter certificate verification code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  leftIcon={<Search className="h-5 w-5 text-gray-400" />}
                  error={verificationStatus === 'error' ? errorMessage : undefined}
                />
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isLoading}
                  className="w-full sm:w-auto"
                >
                  Verify
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {verificationStatus === 'success' && certificate && (
            <div className="mb-6">
              <div className="bg-green-50 p-4 rounded-lg flex items-start mb-6">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-green-800">Certificate Verified</h3>
                  <p className="mt-1 text-sm text-green-700">
                    This certificate has been verified on the XDC blockchain and is authentic.
                  </p>
                </div>
              </div>
              
              <CertificateView certificate={certificate} />
            </div>
          )}
          
          {verificationStatus === 'error' && (
            <div className="bg-red-50 p-5 rounded-lg text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-red-800 mb-2">Verification Failed</h3>
              <p className="text-red-700">
                {errorMessage || 'Could not verify this certificate. Please check the verification code and try again.'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VerifyCertificate;