import Certificate from '../models/Certificate.js';

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
    const userId = req.user.id; // Assuming user ID is available in req.user
    const certs = await Certificate.find({ deletedByUsers: { $ne: userId } }).populate('issuer template'); // Filter out soft-deleted certs
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
      console.log('Transformed certificate:', transformed); // Debug log
      return transformed;
    });
    res.json(transformedCerts);
  } catch (err) {
    console.error('Error in getCertificates:', err); // Debug log
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
