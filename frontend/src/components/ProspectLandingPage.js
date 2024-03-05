import React, { useState, useEffect } from 'react';
import {useParams} from "react-router-dom";
import {fetchProspectData, updateProspectLoomUrl} from "../data/data";


const ProspectLandingPage = () => {
  const { prospectIdentifier } = useParams(); // If using React Router
  const [prospect, setProspect] = useState(null);
  const [loomUrl, setLoomUrl] = useState('');
  const [embedUrl, setEmbedUrl] = useState('');

  // Fetch the prospect data when the component mounts
  useEffect(() => {
  fetchProspectData(prospectIdentifier).then(data => {
    setProspect(data); // Assuming 'data' is the full prospect object
    if (data && data.loom_video_url) {
      setEmbedUrl(data.loom_video_url); // Assuming 'data.loom_video_url' contains the Loom URL
    }
  });
}, [prospectIdentifier]);

const handleSubmit = async (e) => {
  e.preventDefault();
  const updatedData = await updateProspectLoomUrl(prospectIdentifier, loomUrl);
  setEmbedUrl(updatedData.loom_video_url); // Update state with new Loom URL
};

  return (
    <div>
      <h1>{prospect?.first_name}'s Landing Page</h1>
      {embedUrl ? (
        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
          <iframe src={`https://www.loom.com/embed/${extractVideoId(embedUrl)}`}
                  webkitallowfullscreen="true"
                  mozallowfullscreen="true"
                  allowFullScreen
                  title={`${prospect?.first_name}'s Video`}
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
          </iframe>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={loomUrl}
            onChange={(e) => setLoomUrl(e.target.value)}
            placeholder="Enter Loom URL"
          />
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

// Helper function to extract video ID from Loom URL
const extractVideoId = (loomUrl) => {
  // Extract the video ID from the loomUrl
  // For example, if loomUrl is 'https://www.loom.com/embed/VIDEO_ID'
  // you need to return 'VIDEO_ID'
  const match = loomUrl.match(/embed\/(.+)$/);
  return match ? match[1] : '';
};

export default ProspectLandingPage;
