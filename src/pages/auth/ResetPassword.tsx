import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Lock, Key } from 'lucide-react';

interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

const ResetPassword: React.FC = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormValues>();

  const password = watch('password');

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      setError(null);
      await resetPassword(token!, data.password);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setError('Failed to reset password. Please try again.');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Key className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <p className="mt-2 text-sm text-gray-600">
            Enter your new password below
          </p>
        </CardHeader>
        
        <Card>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">
                {error}
              </div>
            )}
            
            {isSuccess ? (
              <div className="text-center">
                <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-md">
                  Password has been reset successfully. Redirecting to login...
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  label="New Password"
                  type="password"
                  leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
                  error={errors.password?.message}
                  placeholder="********"
                  togglePasswordVisibility={true}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    },
                  })}
                />
                
                <Input
                  label="Confirm New Password"
                  type="password"
                  leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
                  error={errors.confirmPassword?.message}
                  placeholder="********"
                  togglePasswordVisibility={true}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) =>
                      value === password || 'Passwords do not match',
                  })}
                />
                
                <div>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                  >
                    Reset Password
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword; 