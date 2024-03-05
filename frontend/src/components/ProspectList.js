import React, { useState, useEffect } from 'react';
import axios from 'axios';



const ProspectList = ({ clientId, onProspectSelect }) => {
  const [prospects, setProspects] = useState([]);


  useEffect(() => {
    // Fetch prospects for the selected client
    const fetchProspects = async () => {
      try {
        const response = await axios.get(`https://api.jamairo.buzz/clients/${clientId}/prospects/`);
        setProspects(response.data);
      } catch (error) {
        console.error('Error fetching prospects:', error);
      }
    };
    if (clientId) {
      fetchProspects().then(r => console.log(r));
    }
  }, [clientId]); // This effect runs when clientId changes

    const handleProspectClick = (prospectId) => {
    onProspectSelect(prospectId);
    }

  return (
      <div>
        {prospects.map(prospect => (
          <div key={prospect.id} onClick={() => handleProspectClick(prospect.id)}>
            {prospect.first_name}
          </div>
        ))}
      </div>
  );
};

export default ProspectList;
