import React, { useState } from 'react';
import ClientSelection from './components/ClientSelection';
import ProspectList from './components/ProspectList';
import ProspectLandingPage from './components/ProspectLandingPage';

function App() {
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedProspectId, setSelectedProspectId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClientSelect = (clientId) => {
    setSelectedClientId(clientId);
  };

  const handleProspectSelect = (prospectId) => {
    setSelectedProspectId(prospectId);
    setIsModalOpen(true); // This line should trigger the modal to open
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
