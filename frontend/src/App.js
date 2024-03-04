import React, { useState } from 'react';
import ClientSelection from "./components/ClientSelection";

function App() {
  const [selectedClientId, setSelectedClientId] = useState('');

  const handleClientSelect = (clientId) => {
    setSelectedClientId(clientId);
    console.log(`Selected client ID: ${clientId}`);
    // Here you can make further API calls to fetch the client's details or prospects
  };

  return (
    <div className="App">
      <h1>Select a Client</h1>
      <ClientSelection onClientSelect={handleClientSelect} />
      {/* You can add more components here that will use the selectedClientId */}
    </div>
  );
}

export default App;
