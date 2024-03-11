import React, { useEffect, useState } from 'react';
import { fetchProspectData, updateProspectLoomUrl } from '../api/ClientsApi';
import LoomUrlModal from '../modals/LoomUrlModal';
import { oembed } from '@loomhq/loom-embed';

const ProspectLandingPage = ({ prospectId, isModalOpen, setIsModalOpen }) => {
  const [prospect, setProspect] = useState(null);
  const [loomHtml, setLoomHtml] = useState('');

  useEffect(() => {
    const getProspectData = async () => {
      try {
        const data = await fetchProspectData(prospectId);
        if (data && data.loom_video_url) {
          setProspect(data);
          const { html } = await oembed(data.loom_video_url);
          setLoomHtml(html);
        } else {
          console.error('No prospect data or Loom URL found.');
        }
      } catch (error) {
        console.error('Error fetching prospect data:', error);
      }
    };

    if (prospectId) {
      getProspectData();
    }
  }, [prospectId]);

  const handleLoomUrlSubmit = async (newUrl) => {
    try {
      const updatedProspect = await updateProspectLoomUrl(prospectId, newUrl);
      if (updatedProspect && updatedProspect.loom_video_url) {
        setProspect(updatedProspect);
        const { html } = await oembed(updatedProspect.loom_video_url);
        setLoomHtml(html);
      }
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
          <div dangerouslySetInnerHTML={{ __html: loomHtml }} />
          <LoomUrlModal
            isOpen={isModalOpen}
            loomUrl={prospect.loom_video_url || ''}
            onSubmit={handleLoomUrlSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default ProspectLandingPage;
