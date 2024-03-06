import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

function ProspectList({ clientId }) {
  const [prospects, setProspects] = useState([]);
  const history = useHistory();

  useEffect(() => {
    fetchProspects();
  }, [clientId]);

  const fetchProspects = async () => {
    try {
      const response = await fetch(`https://api.jamairo.buzz/clients/${clientId}/prospects`);
      if (!response.ok) {
        throw new Error('Failed to fetch prospects');
      }
      const data = await response.json();
      setProspects(data);
    } catch (error) {
      console.error('Error fetching prospects:', error);
    }
  };

  const handleProspectClick = (prospectId) => {
    history.push(`/prospect/${prospectId}`);
  };

  return (
    <div>
      <h2>Prospects</h2>
      <ul>
        {prospects.map((prospect) => (
          <li key={prospect.id} onClick={() => handleProspectClick(prospect.id)} style={{ cursor: 'pointer' }}>
            {prospect.first_name} - {prospect.company_name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProspectList;
