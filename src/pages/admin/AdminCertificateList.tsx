import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Certificate } from '../../types';
import { certificateService } from '../../services/certificate';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Search, Plus, Trash2, Edit } from 'lucide-react';

const AdminCertificateList: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { authState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authState.isAuthenticated || authState.user?.role !== 'admin') {
      navigate('/login');
      return;
    }

    const fetchCertificates = async () => {
      try {
        setIsLoading(true);
        // Fetch all certificates for admin (no soft-delete filter here)
        const data = await certificateService.getAllCertificatesForAdmin(); // We'll create this service function
        setCertificates(data);
      } catch (error) {
        console.error('Error fetching certificates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertificates();
  }, [authState, navigate]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredCertificates = certificates.filter(cert =>
    cert.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.recipientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.institutionName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this certificate?')) {
      try {
        await certificateService.deleteCertificate(id); // Use the actual delete API
        setCertificates(certificates.filter(cert => cert.id !== id));
      } catch (error) {
        console.error('Error deleting certificate:', error);
        alert('Failed to delete certificate.');
      }
    }
  };

  const handleEdit = (id: string) => {
    // Navigate to an edit page (we might need to create this)
    navigate(`/admin/certificates/edit/${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Manage Certificates (Admin)
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage all digital certificates in the system
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Button
            variant="primary"
            leftIcon={<Plus className="h-5 w-5" />}
            onClick={() => navigate('/admin/certificates/new')}
          >
            Issue Certificate
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6 mb-8">
        <div className="w-full max-w-lg">
          <Input
            placeholder="Search certificates..."
            value={searchTerm}
            onChange={handleSearch}
            leftIcon={<Search className="h-5 w-5 text-gray-400" />}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredCertificates.length > 0 ? (
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Title</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Recipient</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Institution</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Issued On</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredCertificates.map((certificate) => (
                <tr key={certificate.id || certificate._id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{certificate.title}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{certificate.recipientName}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{certificate.institutionName}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(certificate.issuedOn).toLocaleDateString()}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5
                      ${certificate.status === 'issued' ? 'bg-green-100 text-green-800' :
                       certificate.status === 'revoked' ? 'bg-red-100 text-red-800' :
                       'bg-yellow-100 text-yellow-800'}`}
                    >
                      {certificate.status.charAt(0).toUpperCase() + certificate.status.slice(1)}
                    </span>
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button
                      onClick={() => handleEdit(certificate.id || certificate._id || '')}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <Edit className="h-4 w-4 inline-block" />
                      <span className="sr-only">, {certificate.title}</span>
                    </button>
                    <button
                      onClick={() => handleDelete(certificate.id || certificate._id || '')}
                      className="text-red-600 hover:text-red-900"
                    >
                       <Trash2 className="h-4 w-4 inline-block" />
                      <span className="sr-only">, {certificate.title}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

export default AdminCertificateList; 