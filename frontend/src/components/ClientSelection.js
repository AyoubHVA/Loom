import React, {useEffect, useState} from 'react';
import axios from 'axios';

const ClientSelection = ({onClientSelect}) => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios.get('https://api.jamairo.buzz/clients/')
            .then((response) => {
                setClients(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching clients:', error);
                setLoading(false);
            });
    }, []);

    const handleClientChange = (e) => {
        const selectedId = e.target.value;
        onClientSelect(selectedId);
    };

    return (
        <div>
            <label htmlFor="client-select">Select a Client:</label>
            <select id="client-select" onChange={handleClientChange} disabled={loading}>
                <option value="">--Please choose an option--</option>
                {clients.map(client => (
                    <option key={client.id} value={client.id}>
                        {client.first_name} {client.last_name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ClientSelection;
