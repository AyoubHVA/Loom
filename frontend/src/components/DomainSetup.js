import React, { useState } from 'react';
import { setupDomain, verifyDomain } from '../api/ClientsApi';

const DomainSetup = ({ clientId, onDomainVerified }) => {
  const [domain, setDomain] = useState('');
  const [verificationInProgress, setVerificationInProgress] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('');

  const handleDomainSubmit = async () => {
    try {
      const setupResponse = await setupDomain(clientId, domain);
      // Assuming setupResponse will include DNS records information
      alert(`Please add the following DNS records to your domain's settings:\n${setupResponse.dnsRecords}`);
      setVerificationInProgress(true);
    } catch (error) {
      console.error('Error setting up domain:', error);
      alert('Failed to initiate domain setup. Please try again.');
    }
  };

  const handleVerifyDomain = async () => {
    try {
      setVerificationInProgress(true);
      const verifyResponse = await verifyDomain(clientId, domain);
      if (verifyResponse.isVerified) {
        setVerificationStatus('success');
        alert('Domain verified successfully! You can now proceed.');
        onDomainVerified(true);
      } else {
        setVerificationStatus('failed');
        alert('Domain verification failed. Please ensure the DNS settings are correct and have propagated.');
      }
    } catch (error) {
      console.error('Error verifying domain:', error);
      setVerificationStatus('failed');
      alert('An error occurred during domain verification.');
    } finally {
      setVerificationInProgress(false);
    }
  };

  return (
    <div>
      <h2>Setup Your Custom Domain</h2>
      {verificationStatus !== 'success' && (
        <>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="Enter your custom domain"
            disabled={verificationInProgress}
          />
          <button onClick={handleDomainSubmit} disabled={verificationInProgress}>Setup Domain</button>
          <button onClick={handleVerifyDomain} disabled={verificationInProgress || !domain}>Verify Domain</button>
        </>
      )}
      {verificationStatus === 'success' && (
        <p>Domain verified! You can now add your Loom video URL.</p>
      )}
      {verificationStatus === 'failed' && (
        <p>Domain verification failed. Please check the instructions and try again.</p>
      )}
    </div>
  );
};

export default DomainSetup;
