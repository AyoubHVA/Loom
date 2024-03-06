import React, {useState, useEffect} from 'react';

const LoomUrlModal = ({isOpen, onClose, onSubmit}) => {
    const [url, setUrl] = useState('');

    if (!isOpen) {
        return null;
    }

    return (
        <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            zIndex: 1000
        }}>
            <h2>Enter Loom Video URL</h2>
            <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                style={{width: '100%'}}
            />
            <button onClick={() => onSubmit(url)}>Submit</button>
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default LoomUrlModal;