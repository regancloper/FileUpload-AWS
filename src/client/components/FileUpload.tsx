import React, { useState } from 'react';
import UploadMessage from './UploadMessage';
import ProgressBar from './ProgressBar';
import axios from 'axios';
import { CSSTransition } from 'react-transition-group';
import { saveAs } from 'file-saver';

interface FileUploadProps { }


const FileUpload: React.FC<FileUploadProps> = ({ }) => {
    const [file, setFile] = useState<File>(null);
    const [fileName, setFileName] = useState('Choose File');
    const [uploadedFile, setUploadedFile] = useState<UploadedFile>({
        fileName: null,
        filePath: null
    });
    const [message, setMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertColor, setAlertColor] = useState('');
    const [uploadPercentage, setUploadPercentage] = useState(0);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setFileName(e.target.files[0].name);
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) {
            setMessage('No file chosen!');
            setAlertColor('alert alert-danger');
            setShowAlert(true);
        } else {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('title', 'Test file');

            try {

                // await fetch('/api/upload', {
                //     method: 'POST',
                //     body: formData
                // });

                const res = await axios.post('/api/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    onUploadProgress: (progressEvent: any) => {
                        setUploadPercentage(Math.round((progressEvent.loaded * 100) / progressEvent.total));
                        // Clear percentage
                        setTimeout(() => setUploadPercentage(0), 3000);
                    }
                });

                const { fileName, filePath } = res.data;
                setUploadedFile({ fileName, filePath });
                setMessage('File Uploaded!');
                setAlertColor('alert alert-success');
                setShowAlert(true);
            } catch (err) {
                setUploadPercentage(0);
                if (err.response.status === 500) {
                    setMessage('There was a problem with the server.');
                } else {
                    setMessage(err.response.data.msg);
                }
                setAlertColor('alert alert-danger');
                setShowAlert(true);
            }
        }
        setTimeout(() => {
            setShowAlert(false);
            setMessage('');
        }, 3000);
    }

    const handleDownload = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setMessage('Downloading....');
        setAlertColor('alert alert-info');
        setShowAlert(true);

        try {
            const res = await axios.get('/api/upload', { responseType: 'blob' });
            const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
            saveAs(pdfBlob, 'Petition.pdf');
            setShowAlert(false);
        } catch (err) {
            setMessage('There was a problem with the server.');
            setAlertColor('alert alert-danger');
            setShowAlert(true);
        } finally {
            setTimeout(() => {
                setShowAlert(false);
                setMessage('');
            }, 3000);
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="custom-file mb-1">
                    <input
                        type="file"
                        className="custom-file-input"
                        id="customFile"
                        onChange={handleFileSelect}
                    />
                    <label className="custom-file-label" htmlFor="customFile">{fileName}</label>
                </div>

                <ProgressBar percentage={uploadPercentage} />
                <div className="d-flex mt-4 justify-content-between">
                    <input type="submit" value="Upload" className="btn btn-outline-primary w-50" id="upload-button" />
                    <button
                        className="align-self-center btn btn-outline-success w-50"
                        id="current-upload"
                        onClick={handleDownload}
                    >
                        Download
                    </button>
                </div>

            </form>

            <CSSTransition
                in={showAlert}
                timeout={300}
                classNames="transition"
                unmountOnExit
            >
                <UploadMessage msg={message} color={alertColor} />
            </CSSTransition>


        </>
    );
}


interface UploadedFile {
    fileName: string;
    filePath: string;
}

export default FileUpload;