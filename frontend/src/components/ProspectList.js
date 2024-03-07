import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProspectList = ({ clientId, onProspectSelect, setIsModalOpen }) => {
  const [prospects, setProspects] = useState([]);

  useEffect(() => {
    if (clientId) {
      axios.get(`https://api.jamairo.buzz/clients/${clientId}/prospects/`)
        .then(response => setProspects(response.data))
        .catch(error => console.error('Error fetching prospects:', error));
    }
  }, [clientId]);

  const handleProspectClick = (prospectId) => {
    onProspectSelect(prospectId);
    setIsModalOpen(true); // This will open the modal when a prospect is clicked
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
