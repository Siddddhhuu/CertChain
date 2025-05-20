import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CertificateTemplate } from '../../types';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../../components/common/Card';
import { Search, Plus, FileText, Edit2, Trash2, Copy, Eye } from 'lucide-react';

const Template: React.FC = () => {
  const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { authState } = useAuth();
  const navigate = useNavigate();

  // Mock data loading
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock templates data
        const mockTemplates: CertificateTemplate[] = [
          {
            id: '1',
            name: 'Academic Certificate',
            description: 'Standard template for academic achievements',
            institutionId: authState.user?.id || '1',
            fields: [
              { id: '1', name: 'studentName', label: 'Student Name', type: 'text', required: true },
              { id: '2', name: 'degree', label: 'Degree', type: 'text', required: true },
              { id: '3', name: 'graduationDate', label: 'Graduation Date', type: 'date', required: true },
              { id: '4', name: 'gpa', label: 'GPA', type: 'text', required: false }
            ],
            design: {
              backgroundColor: '#ffffff',
              textColor: '#000000',
              accentColor: '#2563eb',
              logoUrl: '/logo.png'
            }
          },
          {
            id: '2',
            name: 'Professional Certification',
            description: 'Template for professional certifications and licenses',
            institutionId: authState.user?.id || '1',
            fields: [
              { id: '1', name: 'recipientName', label: 'Recipient Name', type: 'text', required: true },
              { id: '2', name: 'certificationName', label: 'Certification Name', type: 'text', required: true },
              { id: '3', name: 'issueDate', label: 'Issue Date', type: 'date', required: true },
              { id: '4', name: 'expiryDate', label: 'Expiry Date', type: 'date', required: false }
            ],
            design: {
              backgroundColor: '#f8fafc',
              textColor: '#1e293b',
              accentColor: '#0f766e',
              logoUrl: '/logo.png'
            }
          }
        ];
        
        setTemplates(mockTemplates);
      } catch (error) {
        console.error('Error loading templates:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTemplates();
  }, [authState.user]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateTemplate = () => {
    navigate('/admin/templates/new');
  };

  const handleEditTemplate = (id: string) => {
    navigate(`/admin/templates/${id}/edit`);
  };

  const handleDuplicateTemplate = (id: string) => {
    // In a real app, this would create a copy of the template
    const template = templates.find(t => t.id === id);
    if (template) {
      const newTemplate = {
        ...template,
        id: Date.now().toString(),
        name: `${template.name} (Copy)`
      };
      setTemplates([...templates, newTemplate]);
    }
  };

  const handleDeleteTemplate = (id: string) => {
    // In a real app, this would delete the template from the backend
    setTemplates(templates.filter(t => t.id !== id));
  };

  const handlePreviewTemplate = (id: string) => {
    navigate(`/admin/templates/${id}/preview`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Certificate Templates
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage your certificate templates
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Button
            variant="primary"
            leftIcon={<Plus className="h-5 w-5" />}
            onClick={handleCreateTemplate}
          >
            Create Template
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6 mb-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="w-full max-w-lg">
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={handleSearch}
              leftIcon={<Search className="h-5 w-5 text-gray-400" />}
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{template.name}</CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Eye className="h-4 w-4" />}
                      onClick={() => handlePreviewTemplate(template.id)}
                    >
                      Preview
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Edit2 className="h-4 w-4" />}
                      onClick={() => handleEditTemplate(template.id)}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">{template.description}</p>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Fields:</p>
                  <div className="flex flex-wrap gap-2">
                    {template.fields.map((field) => (
                      <span
                        key={field.id}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {field.label}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Copy className="h-4 w-4" />}
                  onClick={() => handleDuplicateTemplate(template.id)}
                >
                  Duplicate
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  leftIcon={<Trash2 className="h-4 w-4" />}
                  onClick={() => handleDeleteTemplate(template.id)}
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No templates found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first template.</p>
          <div className="mt-6">
            <Button
              variant="primary"
              onClick={handleCreateTemplate}
            >
              Create Template
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Template; 