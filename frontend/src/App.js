import { BrowserRouter as Router, Route } from 'react-router-dom';
import ProspectListPage from './components/ProspectListPage';
import ProspectLandingPage from './components/ProspectLandingPage';

function App() {
  return (
    <Router>
      <Route path="/prospects" component={ProspectListPage} />
      <Route path="/video/:prospectId" component={ProspectLandingPage} />
    </Router>
  );
}

export default App;