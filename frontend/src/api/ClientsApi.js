// clientsApi.js
const API_BASE_URL = 'https://api.jamairo.buzz';

export const fetchProspectsByClientId = async (clientId) => {
    const response = await fetch(`${API_BASE_URL}/clients/${clientId}/prospects`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

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
        // Include other headers such as Authorization if required
      },
      body: JSON.stringify({ loom_video_url: loomVideoUrl }),
    });

    if (!response.ok) {
      // Handle non-2xx responses
      const errorData = await response.text();
      console.error(`Error updating prospect Loom URL: ${errorData}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating prospect Loom URL:', error);
    throw error; // Rethrow the error if you want to handle it outside
  }
};