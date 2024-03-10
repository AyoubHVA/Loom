import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProspectList = ({ clientId, onProspectSelect }) => {
  const [prospects, setProspects] = useState([]);

  console.log(`Fetching prospects for client ID: ${clientId}`);

  useEffect(() => {
    if (clientId) {
      axios.get(`https://api.jamairo.buzz/clients/${clientId}/prospects/`)
        .then(response => {
          console.log('Prospects fetched:', response.data);
          setProspects(response.data);
        })
        .catch(error => console.error('Error fetching prospects:', error));
    }
  }, [clientId]);

  const handleProspectClick = (prospectId) => {
    console.log(`Prospect clicked: ${prospectId}`);
    onProspectSelect(prospectId);
  };

  return (
    <ul>
      {prospects.map(prospect => (
        <li key={prospect.id} onClick={() => handleProspectClick(prospect.id)}>
          {prospect.first_name} - {prospect.company_name}
        </li>
      ))}
    </ul>
  );
};

export default ProspectList;
