import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Mail, Lock, LogIn } from 'lucide-react';

interface LoginFormValues {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { login, authState } = useAuth();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();
  
  const onSubmit = async (data: LoginFormValues) => {
    try {
      setLoginError(null);
      await login(data.email, data.password);
      navigate('/certificates');
    } catch (error) {
      setLoginError('Invalid email or password. Please try again.');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <LogIn className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access your certificates
          </p>
        </CardHeader>
        
        <Card>
          <CardContent>
            {loginError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">
                {loginError}
              </div>
            )}
            
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
              
              <Input
                label="Password"
                type="password"
                leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
                error={errors.password?.message}
                placeholder="********"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
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
                  Sign in
                </Button>
              </div>
            </form>
            
            <div className="mt-6">
              <div className="text-center text-sm">
                <span className="text-gray-600">
                  Don't have an account?{' '}
                </span>
                <Link
                  to="/signup"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>
            For demo purposes, use:
          </p>
          <p className="mt-1">
            - Admin: <span className="font-medium">admin@example.com</span> / password
          </p>
          <p>
            - User: <span className="font-medium">user@example.com</span> / password
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;