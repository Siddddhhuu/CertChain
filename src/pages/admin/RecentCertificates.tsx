import React, { useEffect, useState } from 'react';
import { certificateService } from '../../services/certificate';
import { Certificate } from '../../types';
import CertificateCard from '../../components/certificates/CertificateCard';
import { useNavigate } from 'react-router-dom';

const RecentCertificates: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    certificateService.getCertificates().then(data => {
      setCertificates(data.reverse().slice(0, 10)); // Show 10 most recent
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Recent Certificates</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certificates.map(cert => {
          const certificateId = cert._id || cert.id;
          if (!certificateId) {
            console.error('Certificate missing ID:', cert);
            return null;
          }
          return (
            <CertificateCard
              key={certificateId}
              certificate={cert}
              onView={() => navigate(`/certificates/${certificateId}`)}
              onDownload={() => {/* download logic */}}
              onShare={() => {/* share logic */}}
            />
          );
        })}
      </div>
    </div>
  );
};

export default RecentCertificates;
