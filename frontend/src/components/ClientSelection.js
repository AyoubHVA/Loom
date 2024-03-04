import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClientSelection = ({ onClientSelect }) => {
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState('');

 useEffect(() => {
  const fetchClients = async () => {
    try {
      const response = await axios.get('http://35.87.3.64:8000/clients/');
      console.log('Clients fetched:', response.data); // Log the response data
      setClients(response.data);
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
