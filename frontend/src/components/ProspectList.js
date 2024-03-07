// ProspectList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Use `useHistory` hook for navigation

const ProspectList = ({ clientId }) => {
  const [prospects, setProspects] = useState([]);
  const navigate = useNavigate(); // Get the history object

  useEffect(() => {
    if (clientId) {
      axios.get(`https://api.jamairo.buzz/clients/${clientId}/prospects/`)
        .then(response => setProspects(response.data))
        .catch(error => console.error('Error fetching prospects:', error));
    }
  }, [clientId]);

  const handleProspectClick = (prospectId) => {
    // Navigate to the ProspectLandingPage for the selected prospect
    navigate(`/prospects/${prospectId}`);
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
