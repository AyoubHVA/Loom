import React, { useEffect, useState } from 'react';
import { fetchProspectData, updateProspectLoomUrl } from '../api/ClientsApi';
import LoomUrlModal from '../modals/LoomUrlModal'; // Adjust the import path as necessary

const ProspectLandingPage = ({ prospectId, isModalOpen, setIsModalOpen }) => {
  const [prospect, setProspect] = useState(null);
  const [loomUrl, setLoomUrl] = useState('');

 useEffect(() => {
    console.log(`Prospect ID received: ${prospectId}`);
    const getProspectData = async () => {
      try {
        const data = await fetchProspectData(prospectId);
        if (data) { // Check if data is not undefined
          setProspect(data);
          setLoomUrl(data.loom_video_url || '');
        } else {
          console.log('No prospect data returned from the API');
        }
      } catch (error) {
        console.error('Error fetching prospect data:', error);
      }
    };

    if (prospectId) {
      getProspectData().then(r => console.log('Prospect data fetched:', r));
    }
  }, [prospectId]);

  const handleLoomUrlSubmit = async (newUrl) => {
    try {
      const updatedProspect = await updateProspectLoomUrl(prospectId, newUrl);
      setProspect(updatedProspect);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating prospect loom URL:', error);
    }
  };

  return (
    <div>
      {prospect && (
        <div>
          <h1>{prospect.first_name}'s Landing Page</h1>
          <p>Company: {prospect.company_name}</p>
          {prospect.loom_video_url ? (
            <iframe
              src={prospect.loom_video_url}
              title="Loom Video"
              allowFullScreen
              style={{ width: '100%', height: '400px' }} // Adjust size as needed
            />
          ) : (
            <button onClick={() => setIsModalOpen(true)}>Add Loom Video</button>
          )}
          <LoomUrlModal
            isOpen={isModalOpen}
            loomUrl={loomUrl}
            onSubmit={handleLoomUrlSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default ProspectLandingPage;
