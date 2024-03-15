import React, { useState } from 'react';
import { setupDomain, verifyDomain } from '../api/ClientsApi';

const DomainSetup = ({ clientId, onDomainVerified }) => {
  const [domain, setDomain] = useState('');
  const [verificationInProgress, setVerificationInProgress] = useState(false);
  const [dnsRecords, setDnsRecords] = useState([]);
  const [verificationMessage, setVerificationMessage] = useState('');

  const handleDomainSubmit = async () => {
    try {
      setVerificationInProgress(true);
      const setupResponse = await setupDomain(clientId, `video.${domain}`);
      setDnsRecords(setupResponse.dns_records); // Now we directly set the array of records
      setVerificationInProgress(false);
    } catch (error) {
      console.error('Error setting up domain:', error);
      alert('Failed to initiate domain setup. Please try again.');
      setVerificationInProgress(false);
    }
  };

  const handleVerifyDomain = async () => {
    setVerificationInProgress(true);
    try {
      const verifyResponse = await verifyDomain(clientId, true);
      setVerificationMessage(verifyResponse.message);
      onDomainVerified(verifyResponse.verified);
    } catch (error) {
      console.error('Error verifying domain:', error);
      setVerificationMessage('An error occurred during domain verification.');
    }
    setVerificationInProgress(false);
  };

  return (
    <div>
      <h2>Setup Your Custom Domain</h2>
      {!verificationInProgress && !dnsRecords.length && (
        <>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="Enter your custom domain without 'video.' prefix"
            disabled={verificationInProgress}
          />
          <button onClick={handleDomainSubmit} disabled={verificationInProgress || !domain.trim()}>
            Setup Domain
          </button>
        </>
      )}
      {dnsRecords.length > 0 && (
        <>
          <p>Please add the following DNS records to your domain's settings:</p>
          <ul>
            {dnsRecords.map((record, index) => (
              <li key={index}>
                Type: {record.record_type}, Host: {record.host}, Points to: {record.points_to}, TTL: {record.ttl}
              </li>
            ))}
          </ul>
          <button onClick={handleVerifyDomain} disabled={verificationInProgress}>
            Verify Domain
          </button>
        </>
      )}
      <p>{verificationMessage}</p>
    </div>
  );
};

export default DomainSetup;
