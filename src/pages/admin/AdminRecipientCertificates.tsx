import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import { ArrowLeft } from 'lucide-react';
import { Certificate } from '../../types';
import { certificateService } from '../../services/certificate';
import CertificateCard from '../../components/certificates/CertificateCard';

const AdminRecipientCertificates: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { authState } = useAuth();

  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated or not admin
  if (!authState.isAuthenticated || authState.user?.role !== 'admin') {
    navigate('/login');
    return null; // Prevent rendering if not authorized
  }

  // TODO: Fetch certificates for this recipient ID
  useEffect(() => {
    if (!id) {
      setError('Recipient ID is missing.');
      setIsLoading(false);
      return;
    }

    const fetchCertificates = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // console.log('Fetching certificates for recipient ID:', id);
        const data = await certificateService.getCertificatesByRecipientId(id);
        // console.log('Fetched recipient certificates:', data);
        setCertificates(data);
      } catch (err: any) {
        console.error('Error fetching recipient certificates:', err);
        setError(err.message || 'Failed to fetch recipient certificates');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertificates();
  }, [id]); // Fetch whenever the recipient ID changes

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          leftIcon={<ArrowLeft className="h-4 w-4" />}
          onClick={() => navigate('/admin/recipients')}
        >
          Back to Recipients
        </Button>
      </div>

      <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate mb-6">Certificates for Recipient ID: {id}</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">Error loading certificates: {error}</div>
      ) : certificates.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certificates.map((certificate) => (
            <CertificateCard
              key={certificate.id || certificate._id}
              certificate={certificate}
              onView={() => navigate(`/certificates/${certificate.id || certificate._id}`)}
              onShare={() => { /* Implement share if needed */ alert('Share functionality not implemented yet.'); }}
              onDelete={undefined}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">No certificates found for this recipient.</p>
        </div>
      )}
    </div>
  );
};

export default AdminRecipientCertificates; 