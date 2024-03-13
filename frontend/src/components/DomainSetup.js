import React, { useState } from 'react';
import { setupDomain, verifyDomain } from '../api/ClientsApi';

const DomainSetup = ({ clientId, onDomainVerified }) => {
  const [domain, setDomain] = useState('');
  const [verificationInProgress, setVerificationInProgress] = useState(false);
  const [dnsRecordsInstruction, setDnsRecordsInstruction] = useState('');
  const [verificationMessage, setVerificationMessage] = useState('');

  const handleDomainSubmit = async () => {
    setVerificationInProgress(true);
    try {
      const response = await setupDomain(clientId, domain);
      setDnsRecordsInstruction(response.dns_records_instruction);
      // Continue to verification step
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
      {!dnsRecordsInstruction && (
        <>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="Enter your custom domain without 'video.' prefix"
            disabled={verificationInProgress}
          />
          <button onClick={handleDomainSubmit} disabled={verificationInProgress}>Setup Domain</button>
        </>
      )}
      {dnsRecordsInstruction && (
        <>
          <p>Please add the following DNS records to your domain's settings:</p>
          <code>{dnsRecordsInstruction}</code>
          <button onClick={handleVerifyDomain} disabled={verificationInProgress}>Verify Domain</button>
        </>
      )}
      <p>{verificationMessage}</p>
    </div>
  );
};

export default DomainSetup;
