// ProspectLandingPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProspectData, updateProspectLoomUrl } from '../api/ClientsApi';
import LoomUrlModal from "../modals/LoomUrlModal";

const ProspectLandingPage = () => {
  const { prospectId } = useParams();
  const [prospect, setProspect] = useState(null);
  const [loomUrl, setLoomUrl] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch the prospect data when the component mounts
  useEffect(() => {
    if (prospectId) {
      fetchProspectData(prospectId)
        .then(data => {
          setProspect(data);
          setLoomUrl(data.loom_video_url || '');
        })
        .catch(error => console.error('Error fetching prospect data:', error));
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
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <iframe
                src={prospect.loom_video_url}
                title="Loom Video"
                webkitallowfullscreen="true"
                mozallowfullscreen="true"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              />
            </div>
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
