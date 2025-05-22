import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card, { CardContent } from '../../components/common/Card';
import { ArrowLeft, Save } from 'lucide-react';
import { userService } from '../../services/user';

const AddRecipient: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    walletAddress: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { authState } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated or not admin
  if (!authState.isAuthenticated || authState.user?.role !== 'admin') {
    navigate('/login');
    return null; // Prevent rendering if not authorized
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await userService.createUser(formData);
      alert('Recipient (User) added successfully!');
      navigate('/admin/recipients');
    } catch (error: any) {
      console.error('Error adding recipient:', error);
      alert(`Failed to add recipient: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

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
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate mb-6">Add New Recipient</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Wallet Address"
              name="walletAddress"
              value={formData.walletAddress}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <div>
              <Button type="submit" variant="primary" isLoading={isLoading} leftIcon={<Save className="h-5 w-5" />}>
                Add Recipient
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddRecipient; 