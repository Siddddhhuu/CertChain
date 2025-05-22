import React from 'react';
import { Certificate } from '../../types';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../common/Card';
import Button from '../common/Button';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Share2, ExternalLink, Award, AlertTriangle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format, isValid } from 'date-fns';


interface CertificateCardProps {
  certificate: Certificate;
  onView: (id: string) => void;
  onShare: (id: string) => void;
  onDelete?: (id: string) => Promise<void>;
}

const CertificateCard: React.FC<CertificateCardProps> = ({
  certificate,
  onView,
  onShare,
  onDelete
}) => {
  const { 
    id, 
    title, 
    recipientName, 
    institutionName, 
    issuedOn, 
    status, 
    transactionHash 
  } = certificate;

  const statusColors = {
    issued: 'bg-green-100 text-green-800',
    revoked: 'bg-red-100 text-red-800',
    expired: 'bg-yellow-100 text-yellow-800',
  };

  const statusIcons = {
    issued: <CheckCircle className="h-4 w-4 mr-1" />,
    revoked: <AlertTriangle className="h-4 w-4 mr-1" />,
    expired: <AlertTriangle className="h-4 w-4 mr-1" />,
  };

  const verificationUrl = `https://xdc-certificate-verifier.example/verify/${certificate.verificationCode}`;

  const navigate = useNavigate();

  return (
    <Card hover className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{title}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">Issued by {institutionName}</p>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs flex items-center ${statusColors[status]}`}>
            {statusIcons[status]}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="min-w-[100px] flex justify-center">
            <QRCodeSVG 
              value={verificationUrl} 
              size={100} 
              level="H"
              className="rounded-lg"
            />
          </div>
          <div className="flex-grow">
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500">Recipient</p>
                <p className="font-medium">{recipientName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Issued On</p>
                <p> {isValid(new Date(issuedOn)) ? format(new Date(issuedOn), 'MMM d, yyyy') : 'Unknown Date'}</p>
              </div>
              {transactionHash && (
                <div>
                  <p className="text-xs text-gray-500">Blockchain Verification</p>
                  <a 
                    href={`https://explorer.apothem.network/tx/${transactionHash}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View on Explorer
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-2 md:flex-row md:justify-end md:space-x-1 md:space-y-0">
        <Button
          variant="outline"
          size="sm"
          leftIcon={<Award className="h-4 w-4" />}
          onClick={() => onView(id)}
        >
          View
        </Button>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<Share2 className="h-4 w-4" />}
          onClick={() => onShare(id)}
        > 
          Share
        </Button>
        {onDelete && (
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(id)}
          >
            Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CertificateCard;