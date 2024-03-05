import React, { useState } from 'react';
import ClientSelection from './components/ClientSelection';
import ProspectList from './components/ProspectList';
import ProspectLandingPage from './components/ProspectLandingPage';

function App() {
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedProspectIdentifier, setSelectedProspectIdentifier] = useState('');

  // Handle client selection
  const handleClientSelect = (clientId) => {
    setSelectedClientId(clientId);
    // Reset the selected prospect when a new client is selected
    setSelectedProspectIdentifier('');
  };

  // Handle prospect selection
  const handleProspectSelect = (prospectIdentifier) => {
    setSelectedProspectIdentifier(prospectIdentifier);
  };

  return (
    <div className="App">
      <h1>Select a Client</h1>
      <ClientSelection onClientSelect={handleClientSelect} />
      {selectedClientId && (
        <ProspectList
          clientId={selectedClientId}
          onProspectSelect={handleProspectSelect}
        />
      )}
      {selectedProspectIdentifier && (
        <ProspectLandingPage prospectIdentifier={selectedProspectIdentifier} />
      )}
    </div>
  );
}

export default App;
