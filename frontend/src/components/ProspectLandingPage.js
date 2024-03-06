import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

function ProspectLandingPage() {
  const { prospectId } = useParams();
  const [videoUrl, setVideoUrl] = useState('');
  const [prospect, setProspect] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`https://api.jamairo.buzz/prospects/${prospectId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ loom_video_url: videoUrl }),
      });
      if (!response.ok) {
        throw new Error('Failed to update Loom video URL');
      }
      // Refresh prospect data after successful update
      fetchProspect();
    } catch (error) {
      console.error('Error updating Loom video URL:', error);
    }
  };

  const fetchProspect = async () => {
    try {
      const response = await fetch(`https://api.jamairo.buzz/prospects/${prospectId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch prospect');
      }
      const data = await response.json();
      setProspect(data);
    } catch (error) {
      console.error('Error fetching prospect:', error);
    }
  };

  const handleVideoUrlChange = (event) => {
    setVideoUrl(event.target.value);
  };

  return (
    <div>
      <h2>Prospect Landing Page</h2>
      {prospect && (
        <div>
          <h3>Prospect Info</h3>
          <p>First Name: {prospect.first_name}</p>
          <p>Company Name: {prospect.company_name}</p>
          <p>Loom Video URL: {prospect.loom_video_url}</p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="videoUrlInput">Enter Loom Video URL:</label>
            <input
              type="text"
              id="videoUrlInput"
              value={videoUrl}
              onChange={handleVideoUrlChange}
              required
            />
            <button type="submit">Submit</button>
          </form>
          {prospect.loom_video_url && (
            <div>
              <h3>Loom Video</h3>
              <iframe
                title="Loom Video"
                width="560"
                height="315"
                src={prospect.loom_video_url}
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProspectLandingPage;
