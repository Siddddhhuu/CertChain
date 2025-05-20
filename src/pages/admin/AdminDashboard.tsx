import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Certificate } from '../../types';
import { certificateService } from '../../services/certificate';
import Button from '../../components/common/Button';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Plus, Users, FileText as CertIcon, Shield, Wallet, User, BarChart } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!authState.isAuthenticated || authState.user?.role !== 'admin') {
      navigate('/login');
      return;
    }
    
    const loadData = async () => {
      try {
        setIsLoading(true);
        const certs = await certificateService.getCertificates(authState.user?.id || '');
        setCertificates(certs);
      } catch (error) {
        console.error('Error loading certificates:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [authState, navigate]);
  
  // Stats calculations
  const totalCertificates = certificates.length;
  const activeCertificates = certificates.filter(cert => cert.status === 'issued').length;
  const revokedCertificates = certificates.filter(cert => cert.status === 'revoked').length;
  const expiredCertificates = certificates.filter(cert => cert.status === 'expired').length;
  
  const stats = [
    { name: 'Total Certificates', value: totalCertificates, icon: <CertIcon className="h-8 w-8 text-blue-600" /> },
    { name: 'Active Certificates', value: activeCertificates, icon: <Shield className="h-8 w-8 text-green-600" /> },
    { name: 'Revoked Certificates', value: revokedCertificates, icon: <Shield className="h-8 w-8 text-red-600" /> },
    { name: 'Expired Certificates', value: expiredCertificates, icon: <Shield className="h-8 w-8 text-yellow-600" /> },
  ];
  
  const quickActions = [
    { 
      name: 'Issue Certificate', 
      description: 'Create and issue a new digital certificate',
      icon: <Plus className="h-8 w-8 text-white-600" />,
      action: () => navigate('/admin/certificates/new'),
      // primary: true,
    },
    { 
      name: 'Manage Templates', 
      description: 'Create and modify certificate templates',
      icon: <CertIcon className="h-8 w-8 text-blue-600" />,
      action: () => navigate('/admin/templates'),
    },
    { 
      name: 'View Recipients', 
      description: 'Manage certificate recipients and their details',
      icon: <Users className="h-8 w-8 text-blue-600" />,
      action: () => navigate('/admin/recipients'),
    },
    { 
      name: 'XDC Wallet', 
      description: 'Manage your blockchain wallet and gas funds',
      icon: <Wallet className="h-8 w-8 text-blue-600" />,
      action: () => navigate('/admin/wallet'),
    },
  ];
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your blockchain certificates and recipient information
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
      
      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.name} className="bg-white">
            <CardContent className="flex items-center py-5">
              <div className="flex-shrink-0 mr-4">
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {stat.name}
                </p>
                <p className="text-3xl font-semibold text-gray-900">
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Quick Actions */}
      <h2 className="text-xl font-semibold text-gray-900 mb-5">Quick Actions</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {quickActions.map((action) => (
          <Card 
            key={action.name} 
            className="hover:shadow-lg transition-shadow bg-white"
            hover
          >
            <div 
              className="p-5 flex flex-col h-full cursor-pointer"
              onClick={action.action}
            >
              <div className="flex-shrink-0 mb-4 rounded-full bg-blue-100 p-3 inline-flex w-min">
                {action.icon}
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                {action.name}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {action.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="bg-gray-50 px-6 py-4">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Last Certificate Issued</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {certificates.length > 0 ? 
                  new Date(certificates[0].issuedOn).toLocaleDateString() : 
                  'No certificates issued yet'}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Gas Balance</dt>
              <dd className="mt-1 text-sm text-gray-900">0.58 XDC</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Wallet Status</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Connected
                </span>
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Network</dt>
              <dd className="mt-1 text-sm text-gray-900">XDC Apothem Testnet</dd>
            </div>
          </dl>
        </div>
      </div>
      
      {/* Recent Certificates */}
      <h2 className="text-xl font-semibold text-gray-900 mb-5">Recent Certificates</h2>
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : certificates.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {certificates.slice(0, 5).map((certificate) => (
              <li key={certificate.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/certificates/${certificate.id}`)}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-blue-600 truncate">
                      {certificate.title}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${certificate.status === 'issued' ? 'bg-green-100 text-green-800' : 
                          certificate.status === 'revoked' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {certificate.status.charAt(0).toUpperCase() + certificate.status.slice(1)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <User className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        {certificate.recipientName}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        Issued on {new Date(certificate.issuedOn).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
            <Button
              variant="outline"
              fullWidth
              onClick={() => navigate('/admin/certificates')}
            >
              View All Certificates
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <CertIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No certificates issued yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by issuing your first certificate.</p>
          <div className="mt-6">
            <Button
              variant="primary"
              onClick={() => navigate('/admin/certificates/new')}
            >
              Issue Certificate
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;