import React, {useState} from 'react';
import ClientSelection from './components/ClientSelection';
import ProspectList from './components/ProspectList';
import ProspectLandingPage from './components/ProspectLandingPage';

function App() {
    const [selectedClientId, setSelectedClientId] = useState('');
    const [selectedProspectId, setSelectedProspectId] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Handle client selection
    const handleClientSelect = (clientId) => {
        setSelectedClientId(clientId);
        setSelectedProspectId(''); // Reset prospect selection when a new client is selected
    };

    // Handle prospect selection
    const handleProspectSelect = (prospectId) => {
        setSelectedProspectId(prospectId);
        // Set the state to open the modal here or inside ProspectList
        setIsModalOpen(true);
    };

    return (
        <div className="App">
            <h1>Select a Client</h1>
            <ClientSelection onClientSelect={handleClientSelect}/>
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
