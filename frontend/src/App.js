import React, { useState } from 'react';
import ClientSelection from './components/ClientSelection';
import ProspectList from './components/ProspectList';
import ProspectLandingPage from './components/ProspectLandingPage';

function App() {
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedProspectId, setSelectedProspectId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log(`Selected Client ID: ${selectedClientId}`);
  console.log(`Selected Prospect ID: ${selectedProspectId}`);
  console.log(`Is Modal Open: ${isModalOpen}`);

  const handleClientSelect = (clientId) => {
    console.log(`Client selected: ${clientId}`);
    setSelectedClientId(clientId);
  };

  const handleProspectSelect = (prospectId) => {
    console.log(`Prospect selected: ${prospectId}`);
    setSelectedProspectId(prospectId);
    setIsModalOpen(true);
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
      {selectedProspectId && (
        <ProspectLandingPage
          prospectId={selectedProspectId}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  );
}

export default App;

