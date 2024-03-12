import React, { useState } from 'react';
import { setupDomain, verifyDomain } from '../api/ClientsApi';

const DomainSetup = ({ clientId }) => {
  const [domain, setDomain] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const handleDomainSubmit = async () => {
    try {
      // Here you would have an endpoint to initiate the domain setup process
      await setupDomain().post('/setup-domain', { clientId, domain });
      alert('Please update your DNS settings as instructed and click verify when done.');
    } catch (error) {
      console.error('Error setting up domain:', error);
    }
  };

  const handleVerifyDomain = async () => {
    try {
      // Endpoint to verify domain
      const response = await verifyDomain().get(`/verify-domain?clientId=${clientId}&domain=${domain}`);
      if (response.data.isVerified) {
        setIsVerified(true);
        alert('Domain verified! Now you can setup your Loom URL.');
      } else {
        alert('Domain not verified yet. Please ensure DNS settings are correct and propagated.');
      }
    } catch (error) {
      console.error('Error verifying domain:', error);
    }
  };

  return (
    <div>
      {!isVerified ? (
        <>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="Enter your custom domain"
          />
          <button onClick={handleDomainSubmit}>Setup Domain</button>
          <button onClick={handleVerifyDomain}>Verify Domain</button>
        </>
      ) : (
        <p>Domain is verified. You can now add your Loom video URL.</p>
      )}
    </div>
  );
};

export default DomainSetup;
