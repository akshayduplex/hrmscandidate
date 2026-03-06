import React, { useState } from 'react';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';

function FileUpload() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setPreview(null);
        }
    };

    return (
        <div className='dflexbtwn position-relative'>
            <div className='customup_btn'>
                <button onClick={() => document.querySelector('input[type="file"]').click()}>
                    <span className='icon'><CloudUploadOutlinedIcon /></span>
                    <span>Click to upload or drag and drop</span>
                    <span>PNG, JPG (max 200px X 200 px)</span>
                </button>
            </div>
            <div className='fileup_btnhide'>
                <input type="file" onChange={handleFileChange} accept="image/*" />
            </div>
            {preview && (
                <img src={preview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px', marginLeft: '10px' }} />
            )}
        </div>
    );
}

export default FileUpload;
