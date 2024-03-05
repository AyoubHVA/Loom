// Define a base URL for your backend API
const API_BASE_URL = 'https://api.jamairo.buzz';

// Fetch the prospect data based on the identifier
export const fetchProspectData = async (prospectIdentifier) => {
  try {
    const response = await fetch(`${API_BASE_URL}/prospects/${prospectIdentifier}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching prospect data:', error);
  }
};

// Update the Loom video URL for a given prospect
export const updateProspectLoomUrl = async (prospectIdentifier, loomVideoUrl) => {
  try {
    const response = await fetch(`${API_BASE_URL}/prospects/${prospectIdentifier}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ loom_video_url: loomVideoUrl }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const updatedData = await response.json();
    return updatedData;
  } catch (error) {
    console.error('Error updating prospect loom URL:', error);
  }
};
