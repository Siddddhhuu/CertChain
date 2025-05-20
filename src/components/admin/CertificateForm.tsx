import React from 'react';
import { useForm } from 'react-hook-form';
import { Check, Calendar, User, Mail, Wallet, Award, Building, FileText } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';

interface CertificateFormValues {
  recipientName: string;
  recipientEmail: string;
  recipientWalletAddress: string;
  title: string;
  description: string;
  issueDate: string;
  expiryDate?: string;
}

interface CertificateFormProps {
  onSubmit: (data: CertificateFormValues) => void;
  isLoading?: boolean;
}

const CertificateForm: React.FC<CertificateFormProps> = ({ 
  onSubmit, 
  isLoading = false 
}) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<CertificateFormValues>();

  const currentDate = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-gray-50 p-5 rounded-lg mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Recipient Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Recipient Name"
            placeholder="Enter full name"
            leftIcon={<User className="h-5 w-5 text-gray-400" />}
            error={errors.recipientName?.message}
            {...register('recipientName', { required: 'Recipient name is required' })}
          />
          
          <Input
            label="Recipient Email"
            type="email"
            placeholder="Enter email address"
            leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
            error={errors.recipientEmail?.message}
            {...register('recipientEmail', { 
              required: 'Email is required',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Please enter a valid email',
              }
            })}
          />
          
          <Input
            label="Recipient Wallet Address"
            placeholder="Enter XDC wallet address"
            leftIcon={<Wallet className="h-5 w-5 text-gray-400" />}
            error={errors.recipientWalletAddress?.message}
            {...register('recipientWalletAddress', { 
              required: 'Wallet address is required',
              pattern: {
                value: /^(xdc)?[0-9a-fA-F]{40}$/,
                message: 'Please enter a valid XDC wallet address',
              }
            })}
          />
        </div>
      </div>
      
      <div className="bg-gray-50 p-5 rounded-lg mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Certificate Details</h3>
        <div className="grid grid-cols-1 gap-4">
          <Input
            label="Certificate Title"
            placeholder="e.g., Blockchain Developer Certification"
            leftIcon={<Award className="h-5 w-5 text-gray-400" />}
            error={errors.title?.message}
            {...register('title', { required: 'Certificate title is required' })}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Issue Date"
              type="date"
              defaultValue={currentDate}
              leftIcon={<Calendar className="h-5 w-5 text-gray-400" />}
              error={errors.issueDate?.message}
              {...register('issueDate', { required: 'Issue date is required' })}
            />
            
            <Input
              label="Expiry Date (Optional)"
              type="date"
              leftIcon={<Calendar className="h-5 w-5 text-gray-400" />}
              error={errors.expiryDate?.message}
              min={currentDate}
              {...register('expiryDate')}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Certificate Description
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                className={`
                  rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500
                  shadow-sm pl-10 pr-3 py-2
                  block bg-white text-gray-900 placeholder-gray-400
                  focus:outline-none focus:ring-2
                  disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
                  text-base w-full min-h-[100px]
                `}
                placeholder="Enter certificate description and achievements"
                {...register('description', { required: 'Description is required' })}
              />
            </div>
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          leftIcon={<Check className="h-5 w-5" />}
        >
          Issue Certificate
        </Button>
      </div>
    </form>
  );
};

export default CertificateForm;