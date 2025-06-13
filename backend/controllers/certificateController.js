import Certificate from '../models/Certificate.js';
import User from '../models/User.js';

export const createCertificate = async (req, res) => {
  try {
    const cert = new Certificate(req.body);
    await cert.save();
    res.status(201).json({ ...cert.toObject(), id: cert._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getCertificates = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    // console.log('getCertificates called.');
    // console.log('Authenticated user:', req.user);
    // console.log('User ID:', userId);
    // console.log('User Role:', userRole);

    let certs;
    if (userRole === 'admin') {
      // console.log('Fetching all certificates for admin...');
      // Admin can see all certificates
      certs = await Certificate.find().populate('issuer template');
      // console.log('Fetched certificates count (admin):', certs.length);
    } else {
      // console.log('Fetching certificates for regular user...');
      // Regular users can only see their own certificates
      certs = await Certificate.find({
        'recipient.email': req.user.email,
        deletedByUsers: { $ne: userId }
      }).populate('issuer template');
      //  console.log('Fetched certificates count (user):', certs.length);
    }

    // Transform the data structure to match frontend expectations
    const transformedCerts = certs.map(cert => {
      const transformed = {
        ...cert.toObject(),
        recipientName: cert.recipient?.name,
        recipientEmail: cert.recipient?.email,
        recipientWalletAddress: cert.recipient?.walletAddress,
        title: cert.metadata?.title,
        description: cert.metadata?.description,
        institutionName: cert.metadata?.institutionName,
        institutionId: cert.metadata?.institutionId,
        issuedOn: cert.issuedAt,
        credentialId: cert.code,
        verificationCode: cert.code,
        transactionHash: cert.blockchainTx,
        status: cert.status,
        metadata: cert.metadata,
        id: cert._id
      };
      return transformed;
    });
    // console.log('Sending transformed certificates.', transformedCerts.length);
    res.json(transformedCerts);
  } catch (err) {
    console.error('Error in getCertificates:', err);
    res.status(500).json({ message: err.message });
  }
};

export const getCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id).populate('issuer template');
    if (!cert) return res.status(404).json({ message: 'Certificate not found' });
    
    // Transform the data structure to match frontend expectations
    const transformedCert = {
      ...cert.toObject(),
      recipientName: cert.recipient?.name,
      recipientEmail: cert.recipient?.email,
      recipientWalletAddress: cert.recipient?.walletAddress,
      title: cert.metadata?.title,
      description: cert.metadata?.description,
      institutionName: cert.metadata?.institutionName,
      institutionId: cert.metadata?.institutionId,
      issuedOn: cert.issuedAt,
      credentialId: cert.code,
      verificationCode: cert.code,
      transactionHash: cert.blockchainTx,
      status: cert.status,
      metadata: cert.metadata,
      id: cert._id
    };
    
    res.json(transformedCert);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cert) return res.status(404).json({ message: 'Certificate not found' });
    res.json(cert);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findByIdAndDelete(req.params.id);
    if (!cert) return res.status(404).json({ message: 'Certificate not found' });
    res.json({ message: 'Certificate deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const verifyCertificate = async (req, res) => {
  try {
    const { code } = req.params;
    
    // Find the certificate by code
    const cert = await Certificate.findOne({ code }).populate('issuer template');
    
    if (!cert) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    
    // Check if certificate is revoked
    if (cert.status === 'revoked') {
      return res.status(400).json({ message: 'Certificate has been revoked' });
    }
    
    // Check if certificate is expired
    if (cert.expiresAt && new Date(cert.expiresAt) < new Date()) {
      return res.status(400).json({ message: 'Certificate has expired' });
    }
    
    // Transform the data structure to match frontend expectations
    const transformedCert = {
      ...cert.toObject(),
      recipientName: cert.recipient?.name,
      recipientEmail: cert.recipient?.email,
      recipientWalletAddress: cert.recipient?.walletAddress,
      title: cert.metadata?.title,
      description: cert.metadata?.description,
      institutionName: cert.metadata?.institutionName,
      institutionId: cert.metadata?.institutionId,
      issuedOn: cert.issuedAt,
      credentialId: cert.code,
      verificationCode: cert.code,
      transactionHash: cert.blockchainTx,
      status: cert.status,
      metadata: cert.metadata,
      id: cert._id
    };
    
    res.json(transformedCert);
  } catch (err) {
    console.error('Error verifying certificate:', err);
    res.status(500).json({ message: err.message });
  }
};

export const softDeleteCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Assuming user ID is available in req.user

    const cert = await Certificate.findById(id);

    if (!cert) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    // Add user ID to the deletedByUsers array if not already present
    if (!cert.deletedByUsers.includes(userId)) {
      cert.deletedByUsers.push(userId);
      await cert.save();
    }

    res.json({ message: 'Certificate soft-deleted successfully' });
  } catch (err) {
    console.error('Error soft-deleting certificate:', err);
    res.status(500).json({ message: err.message });
  }
};

export const getCertificatesByRecipientId = async (req, res) => {
  try {
    const { recipientId } = req.params;
    
    // 1. Find the recipient user to get their email
    const recipientUser = await User.findById(recipientId);
    if (!recipientUser) {
      return res.status(404).json({ message: 'Recipient user not found.' });
    }

    // 2. Find certificates matching the recipient's email
    const certs = await Certificate.find({ 'recipient.email': recipientUser.email }).populate('issuer template');
    
    // Transform the data structure to match frontend expectations (similar to getCertificates)
    const transformedCerts = certs.map(cert => {
      const transformed = {
        ...cert.toObject(),
        recipientName: cert.recipient?.name,
        recipientEmail: cert.recipient?.email,
        recipientWalletAddress: cert.recipient?.walletAddress,
        title: cert.metadata?.title,
        description: cert.metadata?.description,
        institutionName: cert.metadata?.institutionName,
        institutionId: cert.metadata?.institutionId,
        issuedOn: cert.issuedAt,
        credentialId: cert.code,
        verificationCode: cert.code,
        transactionHash: cert.blockchainTx,
        status: cert.status,
        metadata: cert.metadata,
        id: cert._id
      };
      return transformed;
    });

    res.json(transformedCerts);
  } catch (err) {
    console.error('Error in getCertificatesByRecipientId:', err);
    res.status(500).json({ message: err.message });
  }
};
