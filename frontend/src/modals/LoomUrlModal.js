// LoomUrlModal.js
import React, {useState} from 'react';

const LoomUrlModal = ({isOpen, onClose, onSubmit}) => {
    const [loomUrl, setLoomUrl] = useState('');

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Enter Loom Video URL</h2>
                <input
                    type="text"
                    value={loomUrl}
                    onChange={(e) => setLoomUrl(e.target.value)}
                    placeholder="https://www.loom.com/share/..."
                />
                <button onClick={() => onSubmit(loomUrl)}>Submit</button>
                <button onClick={onClose}>Close</button>
            </div>
            <style jsx>{`
              .modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgb(185, 28, 28);
                display: flex;
                justify-content: center;
                align-items: center;
              }

              .modal-content {
                background-color: #e8bd5a;
                padding: 20px;
                border-radius: 5px;
              }

              input {
                display: block;
                margin-bottom: 20px;
                width: 100%;
              }
            `}</style>
        </div>
    );
};

export default LoomUrlModal;
