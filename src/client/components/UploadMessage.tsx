import React from 'react';

interface UploadMessageProps {
    msg: string;
    color: string;
}

const UploadMessage: React.FC<UploadMessageProps> = ({ msg, color }) => {
    
    return (
        <div className={color} role="alert">
            {msg}
        </div>
    );
}

export default UploadMessage;