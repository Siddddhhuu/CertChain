import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import Card, { CardContent } from '../../components/common/Card';
import { ArrowLeft } from 'lucide-react';

const AdminRecipientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { authState } = useAuth();

  // Redirect if not authenticated or not admin
  if (!authState.isAuthenticated || authState.user?.role !== 'admin') {
    navigate('/login');
    return null; // Prevent rendering if not authorized
  }

  // TODO: Fetch recipient/user details based on the ID
  useEffect(() => {
    if (id) {
      // console.log('Fetching details for recipient ID:', id);
      // Call backend API to get user details
      // userService.getUserById(id).then(data => { ... });
    }
  }, [id]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

      <Card>
        <CardContent>
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate mb-6">Recipient Details (Admin)</h1>
          <p>Details for recipient with ID: {id}</p>
          {/* TODO: Display recipient details here */}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRecipientDetail; 