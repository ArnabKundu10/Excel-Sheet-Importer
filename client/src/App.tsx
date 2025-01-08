import React, { useState } from 'react';
import axios from 'axios';

const App: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setFile(e.target.files[0]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            setMessage('Please select a file!');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:5000/api/candidates/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setMessage(response.data.message);
        } catch (error: any) {
            setMessage(error.response?.data?.error || 'Something went wrong');
        }
    };

    return (
        <div>
            <h1>Upload Candidate Data</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" accept=".xlsx" onChange={handleFileChange} />
                <button type="submit">Upload</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default App;
