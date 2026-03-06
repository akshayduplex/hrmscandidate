import { useState } from 'react';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { setProfileImage } from '../../Redux/Slices/ImagefileCollectSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const ProfileImageUpload = () => {
    // eslint-disable-next-line no-unused-vars
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const dispatch = useDispatch();

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        const maxSizeInBytes = 2 * 1024 * 1024; // 2 MB

        if (selectedFile) {
            if (selectedFile.size > maxSizeInBytes) {
                event.target.value = null;
                setPreview(null);
                toast.warn('File size exceeds 2 MB.', {
                    position: "top-right",
                    theme: "dark"
                });
                return;
            }

            dispatch(setProfileImage(selectedFile));
            setFile(selectedFile);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setPreview(null);
        }
    };

    const handleButtonClick = () => {
        document.querySelector('input[type="file"]').click();
    };

    return (
        <>
            <div className='dflexbtwn position-relative'>
                <div className='customup_btn'>
                    <button onClick={handleButtonClick} type='button'>
                        <span className='icon'><CloudUploadOutlinedIcon /></span>
                        <span>Click to upload or drag and drop</span>
                        <span>Allow Image Only</span>
                    </button>
                </div>
                <div className='fileup_btnhide'>
                    <input type="file" onChange={handleFileChange} accept=".jpeg , jpg , .png"/>
                </div>
                {preview && (
                <div style={{ width: '200px', height: '200px', marginTop: '10px' }}>
                    <img
                        src={preview}
                        alt="Uploaded Preview"
                        width="100%"
                        height="100%"
                        style={{ objectFit: 'cover' }}
                    />
                </div>
            )}
            </div>
        </>
    );
};

export default ProfileImageUpload;
