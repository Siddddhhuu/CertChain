import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Web3Provider } from './contexts/Web3Context';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import CertificateList from './pages/certificates/CertificateList';
import CertificateDetail from './pages/certificates/CertificateDetail';
import VerifyCertificate from './pages/certificates/VerifyCertificate';
import AdminDashboard from './pages/admin/AdminDashboard';
import IssueCertificate from './pages/admin/IssueCertificate';
import Template from './pages/admin/Template';
import Recipients from './pages/admin/Recipients';
import WalletPage from './pages/admin/Wallet';

// Auth Guard component to protect routes
const PrivateRoute = ({ children, requiredRole }: { children: JSX.Element, requiredRole?: string }) => {
  // Get the auth state from local storage (simple implementation)
  const savedUser = localStorage.getItem("user");
  const isAuthenticated = !!savedUser;
  const user = savedUser ? JSON.parse(savedUser) : null;
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Check if role requirement is met
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Web3Provider>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/verify/:code?" element={<VerifyCertificate />} />
                
                {/* Protected routes */}
                <Route 
                  path="/certificates" 
                  element={
                    <PrivateRoute>
                      <CertificateList />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/certificates/:id" 
                  element={
                    <PrivateRoute>
                      <CertificateDetail />
                    </PrivateRoute>
                  } 
                />
                
                {/* Admin routes */}
                <Route 
                  path="/admin" 
                  element={
                    <PrivateRoute requiredRole="admin">
                      <AdminDashboard />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/admin/certificates/new" 
                  element={
                    <PrivateRoute requiredRole="admin">
                      <IssueCertificate />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/admin/templates" 
                  element={
                    <PrivateRoute requiredRole="admin">
                      <Template />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/admin/recipients" 
                  element={
                    <PrivateRoute requiredRole="admin">
                      <Recipients />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/admin/wallet" 
                  element={
                    <PrivateRoute requiredRole="admin">
                      <WalletPage />
                    </PrivateRoute>
                  } 
                />
                
                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
        </Router>
      </Web3Provider>
    </AuthProvider>
  );
}

export default App;