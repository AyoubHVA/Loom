import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ClientSelection from './components/ClientSelection';
import ProspectList from './components/ProspectList';
import ProspectLandingPage from './components/ProspectLandingPage';

function App() {
  const [selectedClientId, setSelectedClientId] = useState('');

  // Handle client selection
  const handleClientSelect = (clientId) => {
    setSelectedClientId(clientId);
  };

  return (
    <Router>
      <div className="App">
        <h1>Select a Client</h1>
        <ClientSelection onClientSelect={handleClientSelect} />
        {selectedClientId && (
          <ProspectList clientId={selectedClientId} />
        )}
        <Routes>
          <Route path="/prospects/:prospectId">
            <ProspectLandingPage />
          </Route>
          {/* Include other routes here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
