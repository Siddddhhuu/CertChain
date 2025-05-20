import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';
import { FileText, Shield, User, Check, Award, FileCheck } from 'lucide-react';

const Home: React.FC = () => {
  const { authState } = useAuth();
  
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-blue-50 to-indigo-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-28 relative z-10">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Secure Blockchain</span>
                <span className="block text-blue-600">Certificate Platform</span>
              </h1>
              <p className="mt-6 text-base text-gray-600 sm:text-lg md:text-xl">
                Issue, verify, and manage tamper-proof digital certificates
                using XDC blockchain technology for ultimate security and
                authenticity.
              </p>
              
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left">
                {authState.isAuthenticated ? (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/certificates">
                      <Button size="lg" leftIcon={<FileText className="h-5 w-5" />}>
                        View My Certificates
                      </Button>
                    </Link>
                    {authState.user?.role === 'admin' && (
                      <Link to="/admin">
                        <Button variant="outline" size="lg" leftIcon={<Shield className="h-5 w-5" />}>
                          Admin Dashboard
                        </Button>
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/login">
                      <Button size="lg">Get Started</Button>
                    </Link>
                    <Link to="/signup">
                      <Button variant="outline" size="lg">Create Account</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-12 lg:mt-0 lg:col-span-6">
              <div className="bg-white shadow-xl rounded-lg overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="px-8 py-10 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold">Blockchain Certificate</h2>
                      <p className="text-blue-100 mt-1">Verified on XDC Network</p>
                    </div>
                    <Award className="h-12 w-12" />
                  </div>
                </div>
                <div className="px-8 py-6">
                  <div className="flex items-center mb-4">
                    <User className="h-5 w-5 text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Recipient</p>
                      <p className="font-medium">Jane Smith</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-4">
                    <h3 className="text-lg font-semibold">Blockchain Developer Certification</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Successfully completed the advanced blockchain developer program with excellence
                    </p>
                  </div>
                  <div className="mt-6 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      <FileCheck className="h-4 w-4 inline mr-1" />
                      Issued: June.10.2025
                    </div>
                    <div className="flex items-center text-green-600 text-sm font-medium">
                      <Check className="h-4 w-4 mr-1" />
                      Verified
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
              Why Choose CertChain?
            </p>
            <p className="mt-5 max-w-2xl mx-auto text-xl text-gray-500">
              Our platform offers a secure, transparent, and efficient way to manage certificates
            </p>
          </div>
          
          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: 'Blockchain Security',
                  description: 'Certificates are stored on the XDC blockchain, making them immutable and tamper-proof.',
                  icon: <Shield className="h-8 w-8 text-blue-600" />,
                },
                {
                  title: 'Instant Verification',
                  description: 'Verify the authenticity of certificates instantly using our QR code technology.',
                  icon: <Check className="h-8 w-8 text-blue-600" />,
                },
                {
                  title: 'Easy Management',
                  description: 'Manage all your certificates in one place with our intuitive dashboard.',
                  icon: <FileText className="h-8 w-8 text-blue-600" />,
                },
                {
                  title: 'Institutional Control',
                  description: 'Educational institutions maintain complete control over certificate issuance and revocation.',
                  icon: <Award className="h-8 w-8 text-blue-600" />,
                },
                {
                  title: 'Recipient Ownership',
                  description: 'Recipients own their credentials and can share them securely with third parties.',
                  icon: <User className="h-8 w-8 text-blue-600" />,
                },
                {
                  title: 'Transparent History',
                  description: 'View the complete history and audit trail of any certificate on the blockchain.',
                  icon: <FileCheck className="h-8 w-8 text-blue-600" />,
                },
              ].map((feature, index) => (
                <div key={index} className="pt-6">
                  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                          {feature.icon}
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                        {feature.title}
                      </h3>
                      <p className="mt-5 text-base text-gray-500">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-blue-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-blue-200">Create your account today.</span>
          </h2>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 lg:mt-0 lg:flex-shrink-0">
            <Link to="/signup">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 transition-all duration-200"
              >
                Sign up for free
              </Button>
            </Link>
            <Link to="/login">
              <Button 
                variant="outline" 
                size="lg" 
                className="text-white border-white hover:bg-blue-600 hover:border-transparent transition-all duration-200"
              >
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;