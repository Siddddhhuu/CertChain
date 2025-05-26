import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface ForgotPasswordFormValues {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const { forgotPassword } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>();
  
  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      setError(null);
      await forgotPassword(data.email);
      setIsSubmitted(true);
    } catch (error) {
      setError('Failed to send reset email. Please try again.');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </CardHeader>
        
        <Card>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">
                {error}
              </div>
            )}
            
            {isSubmitted ? (
              <div className="text-center">
                <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-md">
                  Password reset instructions have been sent to your email.
                </div>
                <Link
                  to="/login"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Return to login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  label="Email"
                  type="email"
                  leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
                  error={errors.email?.message}
                  placeholder="you@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: 'Please enter a valid email',
                    },
                  })}
                />
                
                <div>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                  >
                    Send Reset Link
                  </Button>
                </div>
              </form>
            )}
            
            <div className="mt-6">
              <div className="text-center text-sm">
                <Link
                  to="/login"
                  className="font-medium text-blue-600 hover:text-blue-500 flex items-center justify-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to login
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword; 