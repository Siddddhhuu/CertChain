import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Mail, Lock, UserPlus, User } from 'lucide-react';

interface SignupFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Signup: React.FC = () => {
  const { login, authState } = useAuth();
  const navigate = useNavigate();
  const [signupError, setSignupError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupFormValues>();
  
  const password = watch('password');
  
  const onSubmit = async (data: SignupFormValues) => {
    try {
      setSignupError(null);
      // In a real application, you would call a signup API endpoint here
      // For demo purposes, we'll just log in the user
      await login(data.email, data.password);
      navigate('/certificates');
    } catch (error) {
      setSignupError('Failed to create account. Please try again.');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <UserPlus className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <p className="mt-2 text-sm text-gray-600">
            Sign up to manage your certificates
          </p>
        </CardHeader>
        
        <Card>
          <CardContent>
            {signupError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">
                {signupError}
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="Full Name"
                leftIcon={<User className="h-5 w-5 text-gray-400" />}
                error={errors.name?.message}
                placeholder="John Doe"
                {...register('name', {
                  required: 'Name is required',
                })}
              />
              
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
              
              <Input
                label="Password"
                type="password"
                leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
                error={errors.password?.message}
                placeholder="********"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                })}
              />
              
              <Input
                label="Confirm Password"
                type="password"
                leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
                error={errors.confirmPassword?.message}
                placeholder="********"
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
                  isLoading={authState.isLoading}
                >
                  Sign up
                </Button>
              </div>
            </form>
            
            <div className="mt-6">
              <div className="text-center text-sm">
                <span className="text-gray-600">
                  Already have an account?{' '}
                </span>
                <Link
                  to="/login"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;