import React, { useState, useEffect } from 'react';
import { setupDomain, verifyDomain, fetchProspectData } from '../api/ClientsApi';

const DomainSetup = ({ clientId, onDomainVerified, onProspectsFetched }) => {
    const [domain, setDomain] = useState('');
    const [verificationInProgress, setVerificationInProgress] = useState(false);
    const [dnsRecords, setDnsRecords] = useState([]);
    const [verificationMessage, setVerificationMessage] = useState('');

    useEffect(() => {
        if (onDomainVerified && dnsRecords.length === 0) {
            fetchProspectData(clientId).then(prospects => {
                onProspectsFetched(prospects);
            });
        }
    }, [clientId, onDomainVerified, dnsRecords.length, onProspectsFetched]);

    const handleDomainSubmit = async () => {
        setVerificationInProgress(true);
        setVerificationMessage('');
        try {
            const setupResponse = await setupDomain(clientId, domain);
            if (setupResponse.message === "Domain setup initiated successfully.") {
                setDnsRecords(setupResponse.dns_records);
            } else {
                setVerificationMessage(setupResponse.message);
                onDomainVerified(true); // Assuming that if the domain is already configured, it's also verified
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
            const verifyResponse = await verifyDomain(clientId, true); // Here, we're assuming the verifyDomain endpoint accepts a boolean parameter for verification
            if (verifyResponse.verified) {
                setVerificationMessage(verifyResponse.message);
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
            {!dnsRecords.length && (
                <>
                    <input
                        type="text"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        placeholder="Enter your custom domain"
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
                            <li key={index}>{`Type: ${record.record_type}, Host: ${record.host}, Points to: ${record.points_to}, TTL: ${record.ttl}`}</li>
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
