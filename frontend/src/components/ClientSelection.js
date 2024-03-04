import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ClientSelection() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get('/clients');
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleClientChange = (event) => {
    setSelectedClient(event.target.value);
  };

  return (
    <div>
      <h2>Client Selection</h2>
      <select value={selectedClient} onChange={handleClientChange}>
        <option value="">Select a client</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name}
          </option>
        ))}
      </select>
      {selectedClient && (
        <div>
          <p>Selected Client: {selectedClient}</p>
        </div>
      )}
    </div>
  );
}

export default ClientSelection;
