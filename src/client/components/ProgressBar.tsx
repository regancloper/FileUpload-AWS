import React from 'react';

interface ProgressBarProps {
    percentage: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage }) => {
    return (
        <div className="progress" style={{height: '3px'}}>
            <div
                className="progress-bar bg-success"
                role="progressbar"
                style={{ width: `${percentage}%` }}
            >
              
            </div>
        </div>
    );
}

export default ProgressBar;