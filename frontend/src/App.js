import React, { useState } from 'react';
import ClientSelection from './components/ClientSelection';
import ProspectList from './components/ProspectList';

function App() {
  const [selectedClientId, setSelectedClientId] = useState('');

  // Handle client selection
  const handleClientSelect = (clientId) => {
    setSelectedClientId(clientId);
    // You can also fetch the prospects for the selected client here
  };

  return (
    <div className="App">
      <h1>Select a Client</h1>
      <ClientSelection onClientSelect={handleClientSelect} />
      {selectedClientId && <ProspectList clientId={selectedClientId} />}
      {/* The ProspectList component will be responsible for fetching and displaying the prospects for the selected client */}
    </div>
  );
}

export default App;
