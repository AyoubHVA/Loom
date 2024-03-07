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

  const handleLoomUrlSubmit = async (submittedUrl) => {
    try {
      const updatedProspect = await updateProspectLoomUrl(prospectId, submittedUrl);
      setProspect(updatedProspect);
      setLoomUrl(updatedProspect.loom_video_url || '');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating prospect loom URL:', error);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
            <button onClick={handleOpenModal}>Add Loom Video</button>
          )}
          {isModalOpen && (
            <LoomUrlModal
              isOpen={isModalOpen}
              loomUrl={loomUrl}
              setLoomUrl={setLoomUrl}
              onSubmit={handleLoomUrlSubmit}
              onCancel={handleCloseModal}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ProspectLandingPage;
