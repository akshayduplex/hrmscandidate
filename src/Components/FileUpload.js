
// import { useState } from 'react';
// import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
// import { setFiles } from '../Redux/Slices/ImagefileCollectSlice';
// import { useDispatch } from 'react-redux';
// import { toast } from 'react-toastify';

// const FileUpload = () => {
//     const [file, setFile] = useState(null);
//     const [preview, setPreview] = useState(null);
//     const dispatch = useDispatch();

//     const handleFileChange = (event) => {
//         const selectedFile = event.target.files[0];
//         const maxSizeInBytes = 2 * 1024 * 1024; // 2 MB

//         if (selectedFile) {
//             if (selectedFile.size > maxSizeInBytes) {
//                 event.target.value = null;
//                 setPreview(null);
//                 toast.warn('File size exceeds 2 MB.', {
//                     position: "top-right",
//                     theme:"dark"
//                 });
//                 return;
//             }

//             dispatch(setFiles(selectedFile));
//             setFile(selectedFile);

//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setPreview(reader.result);
//             };
//             reader.readAsDataURL(selectedFile);
//         } else {
//             setPreview(null);
//         }
//     };

//     return (
//         <>
//             <div className='dflexbtwn position-relative'>
//                 <div className='customup_btn'>
//                     <button onClick={() => document.querySelector('input[type="file"]').click()} type='button'>
//                         <span className='icon'><CloudUploadOutlinedIcon /></span>
//                         <span>Click to upload or drag and drop</span>
//                         <span>PDF File Only</span>
//                     </button>
//                 </div>
//                 <div className='fileup_btnhide'>
//                     <input type="file" onChange={handleFileChange} accept=".pdf" required/>
//                 </div>
//                 {preview && file.type === 'application/pdf' && (
//                     <div style={{ width: '300px', height: '300px' }}>
//                         <embed
//                             src={preview}
//                             type="application/pdf"
//                             width="100%"
//                             height="300px"
//                         />
//                     </div>
//                 )}
//                 {preview && file.type !== 'application/pdf' && (
//                     <p>This file type is not supported for preview.</p>
//                 )}
//             </div>
//         </>
//     );
// };

// export default FileUpload;










import { useState } from 'react';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { setFiles } from '../Redux/Slices/ImagefileCollectSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const FileUpload = () => {
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

            dispatch(setFiles(selectedFile));
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
                        <span>PDF File Only</span>
                    </button>
                </div>
                <div className='fileup_btnhide'>
                    <input type="file" onChange={handleFileChange} accept=".pdf"/>
                </div>
                {preview && file?.type === 'application/pdf' && (
                    <div style={{ width: '300px', height: '250px' }}>
                        <embed
                            src={preview}
                            type="application/pdf"
                            width="100%"
                            height="200px"
                        />
                    </div>
                )}
                {preview && file?.type !== 'application/pdf' && (
                    <p>This file type is not supported for preview.</p>
                )}
            </div>
        </>
    );
};

export default FileUpload;














