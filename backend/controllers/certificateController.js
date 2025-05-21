import Certificate from '../models/Certificate.js';

export const createCertificate = async (req, res) => {
  try {
    const cert = new Certificate(req.body);
    await cert.save();
    res.status(201).json(cert);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getCertificates = async (req, res) => {
  try {
    const certs = await Certificate.find().populate('issuer template');
    // Transform the data structure to match frontend expectations
    const transformedCerts = certs.map(cert => ({
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
      metadata: cert.metadata
    }));
    res.json(transformedCerts);
  } catch (err) {
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
      metadata: cert.metadata
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
