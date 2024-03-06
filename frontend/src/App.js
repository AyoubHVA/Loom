import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ClientSelection from './components/ClientSelection';
import ProspectList from './components/ProspectList';
import ProspectLandingPage from './components/ProspectLandingPage';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" exact>
            <ClientSelection />
          </Route>
          <Route path="/prospects/:clientId" exact render={({ match }) => (
            <ProspectList clientId={match.params.clientId} />
          )} />
          <Route path="/prospect/:prospectId" exact render={({ match }) => (
            <ProspectLandingPage prospectId={match.params.prospectId} />
          )} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
