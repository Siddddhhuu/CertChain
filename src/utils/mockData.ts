import { Certificate } from '../types';
import { format, addMonths } from 'date-fns';

// Generate a random string of specified length
const generateRandomString = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Generate a random XDC address
const generateRandomXDCAddress = (): string => {
  return `xdc${Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
};

// Generate a mock certificate
export const generateMockCertificate = (userId: string): Certificate => {
  const issuedOn = new Date();
  const expiresOn = addMonths(issuedOn, Math.floor(Math.random() * 24) + 12); // 1-3 years expiry
  
  const certId = generateRandomString(10);
  
  const titles = [
    'Blockchain Developer Certification',
    'Smart Contract Engineer',
    'Decentralized Finance Specialist',
    'Blockchain Security Expert',
    'XDC Network Developer',
  ];
  
  const institutions = [
    'Blockchain Academy',
    'XDC Foundation',
    'Crypto University',
    'DLT Institute',
    'Global Blockchain Council',
  ];
  
  const statuses = ['issued', 'expired', 'revoked'] as const;
  
  const randomTitle = titles[Math.floor(Math.random() * titles.length)];
  const randomInstitution = institutions[Math.floor(Math.random() * institutions.length)];
  const randomStatus = Math.random() < 0.8 ? 'issued' : statuses[Math.floor(Math.random() * statuses.length)];
  
  return {
    _id: '60c72b2f9b1e8e6d88f0c9b1', // Example valid ObjectId
    id: certId,
    recipientName: 'John Doe',
    recipientEmail: 'john.doe@example.com',
    recipientWalletAddress: generateRandomXDCAddress(),
    institutionName: randomInstitution,
    institutionId: generateRandomString(8),
    title: randomTitle,
    description: `This certificate verifies the successful completion of the ${randomTitle} program with excellence in all required modules and practical assessments.`,
    issuedOn,
    expiresOn,
    credentialId: `CERT-${generateRandomString(6)}`,
    transactionHash: `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    ipfsHash: `Qm${generateRandomString(44)}`,
    status: randomStatus,
    metadata: {
      courseLength: '6 months',
      creditHours: 120,
      grade: 'A',
    },
    verificationCode: generateRandomString(12),
  };
};

// Generate multiple mock certificates
export const generateMockCertificates = (count: number, userId: string): Certificate[] => {
  return Array.from({ length: count }, () => generateMockCertificate(userId));
};