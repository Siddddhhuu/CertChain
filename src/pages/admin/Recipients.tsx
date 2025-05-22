import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../../components/common/Card';
import { Search, Plus, User, Mail, Wallet, Award, ExternalLink, Filter } from 'lucide-react';
import { userService } from '../../services/user';

interface Recipient {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
  certificatesCount: number;
  lastCertificateDate?: Date;
  status: 'active' | 'inactive';
}

const Recipients: React.FC = () => {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const { authState } = useAuth();
  const navigate = useNavigate();

  // Fetch real user data
  useEffect(() => {
    if (!authState.isAuthenticated || authState.user?.role !== 'admin') {
      navigate('/login');
      return;
    }

    const loadUsers = async () => {
      try {
        setIsLoading(true);
        const users = await userService.getAllUsers(); // Fetch real users
        // Map user data to Recipient interface (adjust as needed based on your User model)
        const recipientsData: Recipient[] = users.map(user => ({
          id: user.id,
          name: user.email, // Assuming user object has a name or use email
          email: user.email,
          walletAddress: user.walletAddress || '', // Assuming user object has walletAddress
          certificatesCount: 0, // We don't have this data from the user endpoint
          status: 'active', // Assuming all fetched users are active
          // lastCertificateDate: undefined // We don't have this data
        }));
        setRecipients(recipientsData);
      } catch (error) {
        console.error('Error loading recipients:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, [authState, navigate]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredRecipients = recipients.filter(recipient => {
    const matchesSearch = 
      recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipient.walletAddress.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || recipient.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddRecipient = () => {
    navigate('/admin/recipients/new');
  };

  const handleViewRecipient = (id: string) => {
    navigate(`/admin/recipients/${id}`);
  };

  const handleViewCertificates = (id: string) => {
    navigate(`/admin/recipients/${id}/certificates`);
  };

  const handleViewOnExplorer = (walletAddress: string) => {
    window.open(`https://explorer.apothem.network/address/${walletAddress}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Recipients
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage certificate recipients and their details
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Button
            variant="primary"
            leftIcon={<Plus className="h-5 w-5" />}
            onClick={handleAddRecipient}
          >
            Add Recipient
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6 mb-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="w-full max-w-lg">
            <Input
              placeholder="Search recipients..."
              value={searchTerm}
              onChange={handleSearch}
              leftIcon={<Search className="h-5 w-5 text-gray-400" />}
            />
          </div>
          <div className="mt-4 md:mt-0 md:ml-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredRecipients.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRecipients.map((recipient) => (
            <Card key={recipient.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{recipient.name}</CardTitle>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    recipient.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {recipient.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Mail className="h-4 w-4 mr-2" />
                    {recipient.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Wallet className="h-4 w-4 mr-2" />
                    <span className="truncate">{recipient.walletAddress}</span>
                    <button
                      onClick={() => handleViewOnExplorer(recipient.walletAddress)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Award className="h-4 w-4 mr-2" />
                    {recipient.certificatesCount} Certificate{recipient.certificatesCount !== 1 ? 's' : ''}
                  </div>
                  {recipient.lastCertificateDate && (
                    <div className="text-sm text-gray-500">
                      Last certificate: {new Date(recipient.lastCertificateDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewRecipient(recipient.id)}
                >
                  View Details
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleViewCertificates(recipient.id)}
                >
                  View Certificates
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No recipients found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding your first recipient.</p>
          <div className="mt-6">
            <Button
              variant="primary"
              onClick={handleAddRecipient}
            >
              Add Recipient
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipients; 