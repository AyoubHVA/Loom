import React, { useState, useEffect } from 'react';

function ClientDropdown() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');

  useEffect(() => {
    fetchClients().then(r => console.log(r));
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('https://api.jamairo.buzz/clients');
      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleChange = (event) => {
    setSelectedClient(event.target.value);
  };

  return (
    <div>
      <label htmlFor="clientSelect">Select a client:</label>
      <select id="clientSelect" value={selectedClient} onChange={handleChange}>
        <option value="">Select a client</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.first_name} {client.last_name} - {client.company}
          </option>
        ))}
      </select>
      {selectedClient && <p>Selected Client ID: {selectedClient}</p>}
    </div>
  );
}

export default ClientDropdown;
