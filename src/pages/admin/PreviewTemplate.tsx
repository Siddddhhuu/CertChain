import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { templateService } from '../../services/template';
import { CertificateTemplate } from '../../types';
import Button from '../../components/common/Button';
import { ArrowLeft } from 'lucide-react';

const PreviewTemplate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<CertificateTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplate = async () => {
      if (!id) {
        setError('Template ID is missing.');
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        // console.log(`Fetching template with ID: ${id}`);
        const fetchedTemplate = await templateService.getTemplateById(id);
        // console.log('Fetched template:', fetchedTemplate);
        setTemplate(fetchedTemplate);
      } catch (err: any) {
        console.error('Error fetching template:', err);
        setError(err.message || 'Failed to fetch template');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplate();
  }, [id]);

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading template preview...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-600">Error: {error}</div>;
  }

  if (!template) {
    return <div className="container mx-auto px-4 py-8 text-center">Template not found.</div>;
  }

  // Ensure design object exists with default values
  const design = template.design || {
    backgroundColor: '#ffffff',
    textColor: '#000000',
    accentColor: '#2563eb',
    logoUrl: '',
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Preview Template: {template.name}</h1>
        <Button
          variant="outline"
          onClick={() => navigate('/admin/templates')}
          leftIcon={<ArrowLeft className="h-4 w-4" />}
        >
          Back to Templates
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Certificate Preview */}
        <div 
          className="p-8 aspect-[1.414] relative" // A4 aspect ratio
          style={{
            backgroundColor: design.backgroundColor,
            color: design.textColor,
          }}
        >
          {/* Certificate Content */}
          <div className="h-full flex flex-col items-center justify-center text-center">
            {/* Logo */}
            {design.logoUrl && (
              <div className="mb-8">
                <img 
                  src={design.logoUrl} 
                  alt="Institution Logo" 
                  className="h-20 w-auto"
                />
              </div>
            )}

            <h2 
              className="text-4xl font-bold mb-4"
              style={{ color: design.accentColor }}
            >
              Certificate of Completion
            </h2>

            <div className="space-y-6 w-full max-w-2xl">
              <p className="text-lg" style={{ color: design.textColor }}>
                This is to certify that
              </p>

              {/* Recipient Name */}
              <div className="my-6">
                <p className="text-2xl font-semibold border-b-2 pb-2" style={{ borderColor: design.accentColor, color: design.textColor }}>
                  John Doe
                </p>
              </div>

              <p className="text-lg" style={{ color: design.textColor }}>
                has successfully completed the course
              </p>

              {/* Course Name */}
              <div className="my-6">
                <p className="text-xl font-semibold" style={{ color: design.textColor }}>
                  Advanced Web Development
                </p>
              </div>

              {/* Template Fields */}
              {template.fields && template.fields.length > 0 && (
                <div className="mt-8 space-y-4">
                  {template.fields.map((field, index) => (
                    <div key={index} className="flex flex-col items-center space-y-2">
                      <label className="text-lg font-medium" style={{ color: design.textColor }}>
                        {field.label}
                      </label>
                      <div 
                        className="w-full max-w-md border-b-2 pb-2" 
                        style={{ borderColor: design.accentColor }}
                      >
                        <span className="text-gray-500 italic">
                          {field.type === 'date' ? '01/01/2024' : 'Sample Value'}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Issue Date */}
              <div className="mt-8">
                <p className="text-lg" style={{ color: design.textColor }}>
                  Issued on: <span className="font-medium">01/01/2024</span>
                </p>
              </div>
            </div>

            {/* Signature Section */}
            <div className="mt-12 w-full max-w-2xl">
              <div className="flex justify-between items-end">
                <div className="w-1/3">
                  <div className="border-t-2 pt-2" style={{ borderColor: design.accentColor }}>
                    <p className="text-lg" style={{ color: design.textColor }}>Course Instructor</p>
                  </div>
                </div>
                <div className="w-1/3">
                  <div className="border-t-2 pt-2" style={{ borderColor: design.accentColor }}>
                    <p className="text-lg" style={{ color: design.textColor }}>Institution Director</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Institution Name */}
            <div className="mt-8">
              <p className="text-lg font-semibold" style={{ color: design.accentColor }}>
                {template.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Template Details */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Template Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Name:</p>
            <p className="font-medium">{template.name}</p>
          </div>
          <div>
            <p className="text-gray-600">Description:</p>
            <p className="font-medium">{template.description}</p>
          </div>
          <div>
            <p className="text-gray-600">Number of Fields:</p>
            <p className="font-medium">{template.fields?.length || 0}</p>
          </div>
          <div>
            <p className="text-gray-600">Design Colors:</p>
            <div className="flex gap-2 mt-1">
              <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: design.backgroundColor }} />
              <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: design.textColor }} />
              <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: design.accentColor }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewTemplate; 