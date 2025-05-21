import React from 'react';
import { format, isValid } from 'date-fns';
import { Certificate } from '../../types';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle, Calendar, Award, School, User, Key } from 'lucide-react';

interface CertificateViewProps {
  certificate: Certificate;
}

const CertificateView: React.FC<CertificateViewProps> = ({ certificate }) => {
  const {
    title,
    description,
    recipientName,
    institutionName,
    issuedOn,
    expiresOn,
    credentialId,
    verificationCode,
    transactionHash,
  } = certificate;

  const verificationUrl = `https://xdc-certificate-verifier.example/verify/${verificationCode}`;

  return (
    <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg border border-gray-200 max-w-4xl mx-auto">
      {/* Certificate Header */}
      <div className="flex justify-between items-center w-full mb-8">
        <div className="flex items-center">
          <School className="h-10 w-10 text-blue-600 mr-4" />
          <div>
            <h2 className="text-xl font-bold text-gray-800">{institutionName}</h2>
            <p className="text-sm text-gray-500">Official Digital Certificate</p>
          </div>
        </div>
        <div className="bg-green-100 text-green-800 px-4 py-1.5 rounded-full flex items-center text-sm font-medium">
          <CheckCircle className="h-4 w-4 mr-2" />
          Verified on Blockchain
        </div>
      </div>

      {/* Certificate Title */}
      <div className="text-center mb-8 pb-6 border-b border-gray-200 w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-lg text-gray-600">{description}</p>
      </div>

      {/* Recipient Info */}
      <div className="text-center mb-8">
        <div className="text-gray-600 mb-2 flex items-center justify-center">
          <User className="h-5 w-5 mr-2" />
          This certificate is proudly presented to
        </div>
        <h2 className="text-2xl font-bold text-blue-800 mb-4">{recipientName}</h2>
        <p className="text-gray-600">
          for successfully completing all requirements as specified by the issuing institution
        </p>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-8">
        <div className="flex items-start">
          <Calendar className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-gray-500">Issue Date</h3>
            <p className="text-base font-medium">{isValid(new Date(certificate.issuedOn)) ? format(new Date(certificate.issuedOn), 'MMM d, yyyy') : 'Invalid Date'}</p>
          </div>
        </div>
        
        {expiresOn && (
          <div className="flex items-start">
            <Calendar className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Expiry Date</h3>
              <p className="text-base font-medium">{format(new Date(expiresOn), 'MMMM d, yyyy')}</p>
            </div>
          </div>
        )}
        
        <div className="flex items-start">
          <Key className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-gray-500">Credential ID</h3>
            <p className="text-base font-medium">{credentialId}</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Award className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-gray-500">Certification Type</h3>
            <p className="text-base font-medium">Digital Certificate</p>
          </div>
        </div>
      </div>

      {/* Verification Section */}
      <div className="border border-gray-200 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between bg-gray-50 w-full">
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Verify this certificate</h3>
          <p className="text-gray-600 mb-4 md:mb-0">
            Scan the QR code or enter the verification code: 
            <span className="font-mono ml-2 font-medium">{verificationCode}</span>
          </p>
        </div>
        <QRCodeSVG 
          value={verificationUrl} 
          size={100} 
          level="H"
          className="bg-white p-2 rounded-lg"
        />
      </div>

      {/* Blockchain Verification */}
      {transactionHash && (
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Transaction Hash: {transactionHash.substring(0, 10)}...{transactionHash.substring(transactionHash.length - 10)}</p>
          <p className="mt-1">
            <a 
              href={`https://explorer.apothem.network/tx/${transactionHash}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View on XDC Blockchain Explorer
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default CertificateView;