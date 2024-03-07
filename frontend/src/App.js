import React, { useState } from 'react';
import ClientSelection from './components/ClientSelection';
import ProspectList from './components/ProspectList';
import ProspectLandingPage from './components/ProspectLandingPage';

function App() {
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedProspectId, setSelectedProspectId] = useState('');

  const handleClientSelect = (clientId) => {
    setSelectedClientId(clientId);
    // Reset selected prospect when changing clients
    setSelectedProspectId('');
  };

  const handleProspectSelect = (prospectId) => {
    setSelectedProspectId(prospectId);
  };

  return (
    <div className="App">
      <h1>Select a Client</h1>
      <ClientSelection onClientSelect={handleClientSelect} />

      {selectedClientId && (
        <ProspectList clientId={selectedClientId} onProspectSelect={handleProspectSelect} />
      )}

      {selectedProspectId && (
        <ProspectLandingPage prospectId={selectedProspectId} />
      )}
    </div>
  );
}

export default App;
