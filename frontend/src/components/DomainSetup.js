import React, { useState } from 'react';
import { setupDomain, verifyDomain } from '../api/ClientsApi';

const DomainSetup = ({ clientId, onDomainVerified }) => {
  const [domain, setDomain] = useState('');
  const [verificationInProgress, setVerificationInProgress] = useState(false);
  const [dnsRecords, setDnsRecords] = useState([]);
  const [verificationMessage, setVerificationMessage] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  const handleDomainSubmit = async () => {
    setVerificationInProgress(true);
    setVerificationMessage('');
    try {
      const setupResponse = await setupDomain(clientId, `video.${domain}`);
      if (setupResponse && setupResponse.dns_records) {
        setDnsRecords(setupResponse.dns_records);
      } else {
        // Handle the case where dns_records is not as expected
        setVerificationMessage('Domain setup was successful but no DNS instructions were provided.');
      }
    } catch (error) {
      console.error('Error setting up domain:', error);
      setVerificationMessage('Failed to initiate domain setup. Please try again.');
    }
    setVerificationInProgress(false);
  };

  const handleVerifyDomain = async () => {
    setVerificationInProgress(true);
    try {
      const verifyResponse = await verifyDomain(clientId);
      setVerificationMessage(verifyResponse.message);
      setVerificationSuccess(verifyResponse.verified);
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
      {!dnsRecords.length && (
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
      {dnsRecords.length > 0 && !verificationSuccess && (
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
      {verificationSuccess && (
        <p>Domain verified successfully. You can now use your custom domain for prospects.</p>
      )}
      <p>{verificationMessage}</p>
    </div>
  );
};

export default DomainSetup;
