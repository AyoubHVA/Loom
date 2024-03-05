import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProspectList = ({ clientId }) => {
  const [prospects, setProspects] = useState([]);

  useEffect(() => {
    // Fetch prospects for the selected client
    const fetchProspects = async () => {
      try {
        const response = await axios.get(`https://api.jamairo.buzz/clients/${clientId}/prospects/`);
        setProspects(response.data); // Assuming the response is the array of prospects
      } catch (error) {
        console.error('Error fetching prospects:', error);
      }
    };

    if (clientId) {
      fetchProspects().then(r => console.log(r));
    }
  }, [clientId]); // This effect runs when clientId changes

  return (
    <ul>
      {prospects.map((prospect) => (
        <li key={prospect.id}>
          {prospect.first_name} - {prospect.company_name}
          {/* Display prospect details here */}
        </li>
      ))}
    </ul>
  );
};

export default ProspectList;
