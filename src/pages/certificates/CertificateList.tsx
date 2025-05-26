import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { certificateService } from '../../services/certificate';
import { Certificate } from '../../types';
import CertificateCard from '../../components/certificates/CertificateCard';
import Button from '../../components/common/Button';
import { Plus } from 'lucide-react';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';

const CertificateList: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [certificateToDelete, setCertificateToDelete] = useState<string | null>(null);
  const { authState } = useAuth();
  const navigate = useNavigate();

  const fetchCertificates = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await certificateService.getCertificates();
      setCertificates(data);
    } catch (error: any) {
      console.error('Error fetching certificates:', error);
      setError(error.message);
      if (error.message.includes('Session expired') || error.message.includes('No authentication token')) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authState.isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchCertificates();
  }, [authState.isAuthenticated, navigate]);

  const handleDelete = async (id: string) => {
    setCertificateToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!certificateToDelete) return;
    
    try {
      await certificateService.softDeleteCertificate(certificateToDelete);
      setCertificates(certificates.filter(cert => cert.id !== certificateToDelete));
    } catch (error: any) {
      console.error('Error deleting certificate:', error);
      setError(error.message);
    } finally {
      setShowDeleteConfirm(false);
      setCertificateToDelete(null);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => fetchCertificates()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Certificates</h1>
        {authState.user?.role === 'admin' && (
          <Button
            onClick={() => navigate('/admin/certificates/new')}
            variant="primary"
            leftIcon={<Plus className="h-5 w-5" />}
          >
            Issue New Certificate
          </Button>
        )}
      </div>

      {certificates.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No certificates found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((certificate) => (
            <CertificateCard
              key={certificate.id}
              certificate={certificate}
              onView={() => navigate(`/certificates/${certificate.id}`)}
              onShare={() => {
                const shareableLink = `https://certchain.example/verify/${certificate.verificationCode}`;
                navigator.clipboard.writeText(shareableLink)
                  .then(() => {
                    alert(`Shareable link copied to clipboard: ${shareableLink}`);
                  })
                  .catch(err => {
                    console.error('Failed to copy link:', err);
                    alert(`Your shareable link: ${shareableLink}`);
                  });
              }}
              onDelete={() => handleDelete(certificate.id)}
            />
          ))}
        </div>
      )}

      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Certificate"
        message="Are you sure you want to remove this certificate from your list? This action cannot be undone."
      />
    </div>
  );
};

export default CertificateList;