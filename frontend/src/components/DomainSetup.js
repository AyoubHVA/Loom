import React, { useState } from 'react';
import { setupDomain, verifyDomain, fetchProspectData } from '../api/ClientsApi';

const DomainSetup = ({ clientId, onDomainVerified, onProspectsFetched }) => {
    const [domain, setDomain] = useState('');
    const [verificationInProgress, setVerificationInProgress] = useState(false);
    const [dnsRecords, setDnsRecords] = useState([]);
    const [verificationMessage, setVerificationMessage] = useState('');
    const [domainSetupComplete, setDomainSetupComplete] = useState(false);

    const handleDomainSubmit = async () => {
        setVerificationInProgress(true);
        try {
            const response = await setupDomain(clientId, domain);
            if (response.status === 'existing') {
                setVerificationMessage("Client already has this domain configured, please verify.");
                setDomainSetupComplete(true); // Proceed to verification
            } else {
                setDnsRecords(response.dns_records || []);
                setVerificationMessage("Please add the following DNS records to your domain's settings:");
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
            if (verifyResponse.verified) {
                setVerificationMessage('Domain verified successfully.');
                onDomainVerified(true);
                fetchProspectData(clientId).then(prospects => {
                    onProspectsFetched(prospects);
                }).catch(error => {
                    console.error('Error fetching prospect data:', error);
                });
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
            {!domainSetupComplete && (
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
                    <p>{verificationMessage}</p>
                    <ul>
                        {dnsRecords.map((record, index) => (
                            <li key={index}>{`${record.record_type} ${record.host} -> ${record.points_to} TTL: ${record.ttl}`}</li>
                        ))}
                    </ul>
                    <button onClick={handleVerifyDomain} disabled={verificationInProgress}>
                        Verify Domain
                    </button>
                </>
            )}
            {domainSetupComplete && !dnsRecords.length && (
                <>
                    <p>{verificationMessage}</p>
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
