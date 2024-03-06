import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProspectData, updateProspectLoomUrl } from '../data/data';

const ProspectLandingPage = () => {
  const { prospectIdentifier } = useParams();
  const [prospect, setProspect] = useState(null);
  const [loomUrl, setLoomUrl] = useState('');

  // Fetch the prospect data when the component mounts
  useEffect(() => {
    fetchProspectData(prospectIdentifier).then(data => {
      setProspect(data);
      if (data && data.loom_video_url) {
        setLoomUrl(data.loom_video_url);
      }
    });
  }, [prospectIdentifier]);

  const handleLoomUrlSubmit = async (event) => {
    event.preventDefault();
    const updatedProspect = await updateProspectLoomUrl(prospectIdentifier, loomUrl);
    setProspect(updatedProspect);
  };

  return (
    <div>
      {prospect && (
        <>
          <h1>{prospect.first_name}'s Landing Page</h1>
          <form onSubmit={handleLoomUrlSubmit}>
            <input
              type="text"
              value={loomUrl}
              onChange={(e) => setLoomUrl(e.target.value)}
              placeholder="Enter the Loom video URL"
            />
            <button type="submit">Save Loom Video</button>
          </form>
          {/* Display the loom video if the URL is present */}
          {prospect.loom_video_url && (
            <iframe
              src={prospect.loom_video_url}
              webkitallowfullscreen="true"
              mozallowfullscreen="true"
              allowFullScreen
              title="Loom Video"
              style={{ width: '100%', height: '360px' }}
            ></iframe>
          )}
        </>
      )}
    </div>
  );
};

export default ProspectLandingPage;
