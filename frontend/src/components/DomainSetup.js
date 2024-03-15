import React, { useState } from 'react';
import { setupDomain, verifyDomain } from '../api/ClientsApi';

const DomainSetup = ({ clientId, onDomainVerified }) => {
  const [domain, setDomain] = useState('');
  const [verificationInProgress, setVerificationInProgress] = useState(false);
  const [dnsRecordsInstruction, setDnsRecordsInstruction] = useState('');
  const [verificationMessage, setVerificationMessage] = useState('');
  const [isDomainAlreadyConfigured, setIsDomainAlreadyConfigured] = useState(false);

  const handleDomainSubmit = async () => {
    setVerificationInProgress(true);
    setVerificationMessage('');
    setIsDomainAlreadyConfigured(false); // Reset the state to handle repeated submissions
    try {
      const setupResponse = await setupDomain(clientId, `video.${domain}`);
      if (setupResponse.dns_records) {
        // If DNS records are present in the response, display them
        setDnsRecordsInstruction(JSON.stringify(setupResponse.dns_records, null, 2));
      } else if (setupResponse.message === "Client already has this domain configured") {
        // Handle the case where the domain is already configured for the client
        setIsDomainAlreadyConfigured(true);
        setVerificationMessage(setupResponse.message);
        onDomainVerified(true); // Optionally, you can call onDomainVerified here if you want to proceed to the next step
      } else {
        setVerificationMessage('Domain setup was successful but no DNS instructions were provided.');
      }
    } catch (error) {
      console.error('Error setting up domain:', error);
      setVerificationMessage('Failed to initiate domain setup. Please try again.');
    }
    setVerificationInProgress(false);
  };

  const handleVerifyDomain = async () => {
    if (isDomainAlreadyConfigured) {
      // If the domain is already configured, there's no need to verify again
      onDomainVerified(true);
      return;
    }
    setVerificationInProgress(true);
    try {
      const verifyResponse = await verifyDomain(clientId);
      if (verifyResponse.verified) {
        setVerificationMessage('Domain verified successfully. You can now use your custom domain for prospects.');
        onDomainVerified(true);
      } else {
        setVerificationMessage('Domain verification failed. Please ensure the DNS settings are correct and have propagated.');
      }
    } catch (error) {
      console.error('Error verifying domain:', error);
      setVerificationMessage('An error occurred during domain verification.');
    }
    setVerificationInProgress(false);
  };

  return (
    <div>
      <h2>Setup Your Custom Domain</h2>
      {!isDomainAlreadyConfigured && (
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
      {dnsRecordsInstruction && (
        <>
          <p>Please add the following DNS records to your domain's settings:</p>
          <pre>{dnsRecordsInstruction}</pre>
          <button onClick={handleVerifyDomain} disabled={verificationInProgress}>
            Verify Domain
          </button>
        </>
      )}
      {isDomainAlreadyConfigured && (
        <button onClick={() => onDomainVerified(true)}>
          Client already has this domain configured, proceed to select prospects
        </button>
      )}
      <p>{verificationMessage}</p>
    </div>
  );
};

export default DomainSetup;
