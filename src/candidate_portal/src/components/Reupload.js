import React, { useState, useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { uploadKycDocs } from "../helper/Api_Helper";
import { getCandidateId } from "../helper/My_Helper";

const Upload_modal = ({ document, handleUploadSuccess, ...props }) => {
    const [candidateId, setCandidateId] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [flashMessage, setFlashMessage] = useState({ text: '', type: '' });
    const [showFlash, setShowFlash] = useState(false);
    useEffect(() => {
        const fetchCandidateId = async () => {
            try {
                const id = await getCandidateId();
                setCandidateId(id);
            } catch (error) {
                console.error("Error fetching candidate ID:", error);
            }
        };

        fetchCandidateId();
    }, []);
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmit = async () => {
        if (!selectedFile) {
            setFlashMessage({ text: 'Please select a file.', type: 'error' });
            setShowFlash(true);
            setTimeout(() => setShowFlash(false), 5000);
            return;
        }

        setUploading(true);

        const formData = new FormData();
        formData.append('filename', selectedFile);
        formData.append('doc_name', document.doc_name);
        formData.append('doc_category', document.doc_category);
        formData.append('sub_doc_category', document.sub_doc_category);
        if (candidateId) {
            formData.append('_id', candidateId);
        }
        try {
            const response = await uploadKycDocs(formData);
            
            // Handle success
            setFlashMessage({ text: 'Document uploaded successfully!', type: 'success' });
            setShowFlash(true);
            setTimeout(() => {
                setShowFlash(false);
                handleUploadSuccess(response.data); 
                props.onHide();  // Close the modal on success
            }, 5000);
        } catch (err) {
            setFlashMessage({ text: 'Upload failed. Please try again.', type: 'error' });
            setShowFlash(true);
            setTimeout(() => setShowFlash(false), 5000);
        } finally {
            setUploading(false);
        }
    };

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            {showFlash && (
                <div className={`flash-message ${flashMessage.type}`}>
                    {flashMessage.type === 'success' && <FaCheckCircle className="icon" />}
                    {flashMessage.type === 'error' && <FaExclamationCircle className="icon" />}
                    <p>{flashMessage.text}</p>
                    <button className="close" onClick={() => setShowFlash(false)}>&times;</button>
                </div>
            )}
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Re-upload Correct Document
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-4">
                <div className="col-sm-12">
                    <div className="uploadrow my-4">
                        <div className="customfile_upload">
                            <input
                                type="file"
                                className="cstmfile"
                                onChange={handleFileChange}
                            />
                            <span className="filenames">{document ? document.doc_name : ""}</span>
                        </div>
                    </div>
                    <div className="text-center">
                        <button
                            type="button"
                            className="sitebtn mt-4 btn btn-primary"
                            onClick={handleSubmit}
                            disabled={uploading}
                        >
                            {uploading ? "Uploading..." : "Submit"}
                        </button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default Upload_modal;
