import React, { useState, useEffect } from 'react';

const ProspectList = ({ clientId }) => {
  const [prospects, setProspects] = useState([]);

  useEffect(() => {
    if (clientId) {
      const fetchProspects = async () => {
        const response = await fetch(`/clients/${clientId}/prospects/`);
        const data = await response.json();
        setProspects(data);
      };

      fetchProspects();
    }
  }, [clientId]);

  if (!clientId) {
    return <p>Please select a client to view their prospects.</p>;
  }

  return (
    <ul>
      {prospects.map((prospect) => (
        <li key={prospect.id}>
          {prospect.first_name} from {prospect.company_name}
          {/* Implement navigation to prospect's page or additional functionality here */}
        </li>
      ))}
    </ul>
  );
};

export default ProspectList;
