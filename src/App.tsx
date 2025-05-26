import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Web3Provider, useWeb3 } from './contexts/Web3Context';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import CertificateList from './pages/certificates/CertificateList';
import CertificateDetail from './pages/certificates/CertificateDetail';
import VerifyCertificate from './pages/certificates/VerifyCertificate';
import AdminDashboard from './pages/admin/AdminDashboard';
import IssueCertificate from './pages/admin/IssueCertificate';
import Template from './pages/admin/Template';
import Recipients from './pages/admin/Recipients';
import WalletPage from './pages/admin/Wallet';
import AdminCertificateList from './pages/admin/AdminCertificateList';
import AddRecipient from './pages/admin/AddRecipient';
import AdminRecipientDetail from './pages/admin/AdminRecipientDetail';
import AdminRecipientCertificates from './pages/admin/AdminRecipientCertificates';
import UserProfile from './pages/user/UserProfile';
import About from './pages/About';
import Contact from './pages/Contact';
import ContactMessages from './pages/admin/ContactMessages';
import CreateTemplate from './pages/admin/CreateTemplate';
import EditTemplate from './pages/admin/EditTemplate';
import PreviewTemplate from './pages/admin/PreviewTemplate';
import Footer from './components/layout/Footer';


// Auth Guard component to protect routes
const PrivateRoute = ({ children, requiredRole }: { children: JSX.Element, requiredRole?: string }) => {
  const savedUser = localStorage.getItem("user");
  const isAuthenticated = !!savedUser;
  const user = savedUser ? JSON.parse(savedUser) : null;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

// ✅ Component to show XDC warning if needed
const NetworkWarning = () => {
  const { isXDCNetwork, web3State, switchToXDCNetwork } = useWeb3();

  if (!isXDCNetwork && web3State.isConnected) {
    return (
      <div style={{ backgroundColor: '#ffe5e5', padding: '10px', textAlign: 'center', color: 'red' }}>
        ⚠️ You are not connected to the <strong>XDC Apothem Testnet</strong>.{" "}
        <button onClick={switchToXDCNetwork} style={{ marginLeft: "10px", backgroundColor: '#ffcccc', padding: '5px 10px', borderRadius: '5px' }}>
          Switch Network
        </button>
      </div>
    );
  }

  return null;
};

function App() {
  return (
    <AuthProvider>
      <Web3Provider>
        <Router>
          <div className="min-h-screen bg-gray-100 flex flex-col">
            <Navbar />
            <NetworkWarning />
            <main className="flex-grow">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/verify/:code?" element={<VerifyCertificate />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />

                {/* Protected routes */}
                <Route 
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <UserProfile />
                    </PrivateRoute>
                  }
                />
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
                  path="/admin/certificates"
                  element={
                    <PrivateRoute requiredRole="admin">
                      <AdminCertificateList />
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
                  path="/admin/templates/new"
                  element={
                    <PrivateRoute requiredRole="admin">
                      <CreateTemplate />
                    </PrivateRoute>
                  }
                />
                <Route 
                  path="/admin/templates/:id/edit"
                  element={
                    <PrivateRoute requiredRole="admin">
                      <EditTemplate />
                    </PrivateRoute>
                  }
                />
                <Route 
                  path="/admin/templates/:id/preview"
                  element={
                    <PrivateRoute requiredRole="admin">
                      <PreviewTemplate />
                    </PrivateRoute>
                  }
                />
                <Route 
                  path="/admin/recipients/new"
                  element={
                    <PrivateRoute requiredRole="admin">
                      <AddRecipient />
                    </PrivateRoute>
                  }
                />
                <Route 
                  path="/admin/recipients/:id"
                  element={
                    <PrivateRoute requiredRole="admin">
                      <AdminRecipientDetail />
                    </PrivateRoute>
                  }
                />
                <Route 
                  path="/admin/recipients/:id/certificates"
                  element={
                    <PrivateRoute requiredRole="admin">
                      <AdminRecipientCertificates />
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
                <Route
                  path="/admin/contact-messages"
                  element={
                    <PrivateRoute requiredRole="admin">
                      <ContactMessages />
                    </PrivateRoute>
                  }
                />

                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </Web3Provider>
    </AuthProvider>
  );
}

export default App;