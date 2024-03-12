// clientsApi.js
const API_BASE_URL = 'https://api.jamairo.buzz';

export const fetchProspectData = async (prospectId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/prospects/${prospectId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching prospect data:', error);
    }
};

export const updateProspectLoomUrl = async (prospectId, loomVideoUrl) => {
    try {
        const response = await fetch(`${API_BASE_URL}/prospects/${prospectId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({loom_video_url: loomVideoUrl}),
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`HTTP error! status: ${response.status}: ${errorData}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating prospect Loom URL:', error);
        // Possibly handle error state in UI as well
    }
};

// Add new functions for domain setup and verification
export const setupDomain = async (clientId, domain) => {
    const response = await fetch(`${API_BASE_URL}/setup-domain`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({clientId, domain}),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
};

export const verifyDomain = async (clientId) => {
    const response = await fetch(`${API_BASE_URL}/verify-domain/${clientId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({verified: true}), // Assuming verification is a simple boolean for now
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
};
