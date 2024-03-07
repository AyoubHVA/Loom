// ProspectList.js
import React, { useEffect, useState } from 'react';
import { fetchProspectsByClientId } from '../api/clientsApi';

const ProspectList = ({ clientId, onProspectSelect }) => {
    const [prospects, setProspects] = useState([]);

    useEffect(() => {
        if (clientId) {
            fetchProspectsByClientId(clientId).then(setProspects);
        }
    }, [clientId]);

    return (
        <ul>
            {prospects.map(prospect => (
                <li key={prospect.id} onClick={() => onProspectSelect(prospect.id)}>
                    {prospect.first_name} - {prospect.company_name}
                </li>
            ))}
        </ul>
    );
};

export default ProspectList;
