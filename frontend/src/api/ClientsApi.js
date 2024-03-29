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
export const setupDomain = async (clientId, domain) => {
    const response = await fetch(`${API_BASE_URL}/setup-domain/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({client_id: clientId, domain}),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}: ${errorData.detail}`);
    }

    return response.json();
};


// Example of verifying a domain from the frontend
export const verifyDomain = async (clientId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/verify-domain/${clientId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error during domain verification:', error);
        // Handle error state in UI as needed
        throw error; // Rethrow the error if you need to handle it upstream
    }
};
