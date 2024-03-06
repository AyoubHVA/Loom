import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {fetchProspectData, updateProspectLoomUrl} from '../data/data';
import LoomUrlModal from "../modals/LoomUrlModal";

const ProspectLandingPage = () => {
    const {prospectIdentifier} = useParams();
    const [prospect, setProspect] = useState(null);
    const [loomUrl, setLoomUrl] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch the prospect data when the component mounts
    useEffect(() => {
        if (prospectIdentifier) {
            fetchProspectData(prospectIdentifier)
                .then(data => {
                    setProspect(data);
                    setLoomUrl(data.loom_video_url);
                })
                .catch(error => console.error('Error fetching prospect data:', error));
        }
    }, [prospectIdentifier]);

    const handleLoomUrlSubmit = async () => {
        try {
            await updateProspectLoomUrl(prospectIdentifier, loomUrl);
            setProspect({...prospect, loom_video_url: loomUrl});
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
                    {prospect.loom_video_url ? (
                        <div style={{position: 'relative', paddingBottom: '56.25%', height: 0}}>
                            {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
                            <iframe
                                src={prospect.loom_video_url}
                                webkitallowfullscreen="true"
                                mozallowfullscreen="true"
                                allowFullScreen
                                style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}
                            ></iframe>
                        </div>
                    ) : (
                        <button onClick={() => setIsModalOpen(true)}>Add Loom Video</button>
                    )}
                    {isModalOpen && (
                        <LoomUrlModal
                            loomUrl={loomUrl}
                            setLoomUrl={setLoomUrl}
                            onSubmit={handleLoomUrlSubmit}
                            onClose={() => setIsModalOpen(false)}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default ProspectLandingPage;
