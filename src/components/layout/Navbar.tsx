import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useWeb3 } from '../../contexts/Web3Context';
import Button from '../common/Button';
import { FileText, UserCircle, LogOut, Menu, X, Wallet, Home, Shield } from 'lucide-react';
import Avatar from '../common/Avatar';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { authState, logout } = useAuth();
  const { web3State, connect, disconnect } = useWeb3();
  const location = useLocation();
  
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  
  const isAdmin = authState.user?.role === 'admin';
  
  const navLinks = [
    { name: 'Home', href: '/', icon: <Home className="h-5 w-5" /> },
    { name: 'Certificates', href: '/certificates', icon: <FileText className="h-5 w-5" /> },
    ...(isAdmin ? [{ name: 'Admin Dashboard', href: '/admin', icon: <Shield className="h-5 w-5" /> }] : []),
  ];
  
  const handleConnectWallet = async () => {
    if (web3State.isConnected) {
      disconnect();
    } else {
      await connect();
    }
  };
  
  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">CertChain</span>
              </Link>
            </div>
            
            {/* Desktop nav links */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'text-blue-700 border-b-2 border-blue-500'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-2">{link.icon}</span>
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>
          
          {/* Desktop right side buttons */}
          <div className="hidden sm:flex sm:items-center sm:space-x-2">
            {authState.isAuthenticated ? (
              <>
                <Button
                  variant={web3State.isConnected ? "outline" : "primary"}
                  size="sm"
                  leftIcon={<Wallet className="h-4 w-4" />}
                  onClick={handleConnectWallet}
                >
                  {web3State.isConnected
                    ? truncateAddress(web3State.account!)
                    : "Connect Wallet"}
                </Button>
                
                <div className="ml-3 relative flex items-center space-x-4">
                  <Link to="/profile" className="flex items-center">
                    <Avatar name={authState.user?.name} size="sm" />
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      {authState.user?.name}
                    </span>
                  </Link>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<LogOut className="h-4 w-4" />}
                    onClick={logout}
                  >
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-x-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-600"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`sm:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.name}
                to={link.href}
                onClick={closeMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center">
                  <span className="mr-3">{link.icon}</span>
                  {link.name}
                </div>
              </Link>
            );
          })}
        </div>
        
        <div className="pt-4 pb-3 border-t border-gray-200">
          {authState.isAuthenticated ? (
            <div>
              <div className="flex items-center px-4 py-2">
                <div className="flex-shrink-0">
                  <Avatar name={authState.user?.name} size="md" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {authState.user?.name}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {authState.user?.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1 px-2">
                <Button
                  fullWidth
                  variant={web3State.isConnected ? "outline" : "primary"}
                  leftIcon={<Wallet className="h-5 w-5" />}
                  onClick={handleConnectWallet}
                  className="justify-start"
                >
                  {web3State.isConnected
                    ? truncateAddress(web3State.account!)
                    : "Connect Wallet"}
                </Button>
                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  <div className="flex items-center">
                    <UserCircle className="mr-3 h-5 w-5" />
                    Your Profile
                  </div>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="px-4 py-2 space-y-2">
              <Link to="/login" onClick={closeMenu}>
                <Button variant="outline" fullWidth>
                  Log In
                </Button>
              </Link>
              <Link to="/signup" onClick={closeMenu}>
                <Button variant="primary" fullWidth>
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;