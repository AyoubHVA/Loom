import React, {useState} from 'react';
import {setupDomain, verifyDomain} from '../api/ClientsApi';

const DomainSetup = ({clientId, onDomainVerified}) => {
    const [domain, setDomain] = useState('');
    const [verificationInProgress, setVerificationInProgress] = useState(false);
    const [dnsRecords, setDnsRecords] = useState(null);
    const [verificationMessage, setVerificationMessage] = useState('');

    const handleDomainSubmit = async () => {
        try {
            // Call the API to set up domain
            const setupResponse = await setupDomain(clientId, `video.${domain}`);
            // Show the DNS instructions returned by the API
            setDnsRecords(setupResponse.dns_records_instruction);
            // Allow verification to proceed
            setVerificationInProgress(true);
        } catch (error) {
            console.error('Error setting up domain:', error);
            alert('Failed to initiate domain setup. Please try again.');
        }
    };

    const handleVerifyDomain = async () => {
        try {
            const verifyResponse = await verifyDomain(clientId, domain);
            if (verifyResponse.isVerified) {
                setVerificationMessage('Domain verified successfully! You can now proceed.');
                onDomainVerified(true);
            } else {
                setVerificationMessage('Domain verification failed. Please ensure the DNS settings are correct and have propagated.');
            }
        } catch (error) {
            console.error('Error verifying domain:', error);
            setVerificationMessage('An error occurred during domain verification.');
        }
    };

    return (
        <div>
            <h2>Setup Your Custom Domain</h2>
            {!verificationInProgress && (
                <>
                    <input
                        type="text"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        placeholder="Enter your custom domain without 'video.' prefix"
                    />
                    <button onClick={handleDomainSubmit}>Setup Domain</button>
                </>
            )}
            {verificationInProgress && dnsRecords && (
                <>
                    <p>{dnsRecords}</p>
                    <button onClick={handleVerifyDomain}>Verify Domain</button>
                </>
            )}
            {dnsRecords && (
                <>
                    <p>Please add the following DNS records to your domain's settings:</p>
                    <code>{dnsRecords}</code>
                    <button onClick={handleVerifyDomain} disabled={verificationInProgress}>Verify Domain</button>
                </>
            )}
            {verificationMessage && (
                <p>{verificationMessage}</p>
            )}
        </div>
    );
};

export default DomainSetup;
