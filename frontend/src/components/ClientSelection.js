import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClientSelection = ({ onClientSelect }) => {
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState('');

  useEffect(() => {
    // Fetch clients from backend
    const fetchClients = async () => {
      try {
        // Adjust the URL to match your API endpoint for fetching clients
        const response = await axios.get('https://api.jamairo.buzz/clients/');
        setClients(response.data); // Assuming the response is the array of clients
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    fetchClients().then(r => console.log(r));
  }, []);

  const handleClientChange = (e) => {
    const clientId = e.target.value;
    setSelectedClientId(clientId);
    onClientSelect(clientId);
  };

  return (
    <select value={selectedClientId} onChange={handleClientChange}>
      <option value="">Select a Client</option>
      {clients.map((client) => (
        <option key={client.id} value={client.id}>
          {client.first_name} {client.last_name}
        </option>
      ))}
    </select>
  );
};

export default ClientSelection;
