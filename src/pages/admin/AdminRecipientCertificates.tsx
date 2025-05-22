import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import { ArrowLeft } from 'lucide-react';

const AdminRecipientCertificates: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { authState } = useAuth();

  // Redirect if not authenticated or not admin
  if (!authState.isAuthenticated || authState.user?.role !== 'admin') {
    navigate('/login');
    return null; // Prevent rendering if not authorized
  }

  // TODO: Fetch certificates for this recipient ID
  useEffect(() => {
    if (id) {
      console.log('Fetching certificates for recipient ID:', id);
      // Call backend API to get certificates for this user
      // certificateService.getCertificatesByRecipientId(id).then(data => { ... });
    }
  }, [id]);

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
      {/* TODO: Display list of certificates here */}
    </div>
  );
};

export default AdminRecipientCertificates; 