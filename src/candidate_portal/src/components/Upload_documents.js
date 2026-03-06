import React, { useState, useEffect } from "react";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
// import SkillDocs from "./Skills_docs";
import { useNavigate, useLocation } from 'react-router-dom';

import AOS from 'aos';
import { getCandidateId } from "../helper/My_Helper";
import { uploadKycDocs, getCandidateById, updateFinalDocumentStatus } from "../helper/Api_Helper";
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
const Upload_document = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [files, setFiles] = useState({
        AadharFront: null,
        AadharBack: null,
        Pancard: null,
        Photo: null,
        tenthMarksheet: null,
        twelfthMarksheet: null,
        GraduationCertificate: null,
        PostGraduationCertificate: null,
        ExperienceLetter: null,
        RelievingLetter: null,
        SalarySlip: null
    });
    const [existingFiles, setExistingFiles] = useState({});
    const [candidateId, setCandidateId] = useState(null);
    const [flashMessage, setFlashMessage] = useState({ text: '', type: '' });
    const [showFlash, setShowFlash] = useState(false);
    const [fileFields, setFileFields] = useState([{ id: 0, file: null }]);
    const [expiriaceLetterFields, setExpiriaceLetterFields] = useState([{ id: 0, file: null }]);
    const [relievingLetterFields, setRelievingLetterFields] = useState([{ id: 0, file: null }]);
    const [salarySlipFields, setSalarySlipFields] = useState([{ id: 0, file: null }]);
    const navigate = useNavigate(); // Move useNavigate inside the component
    const location = useLocation();
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const docType = searchParams.get('doc');

        if (docType === 'kyc') {
            setCurrentStep(0);
        } else if (docType === 'education') {
            setCurrentStep(1);
        } else if (docType === 'experience') {
            setCurrentStep(2);
        }
    }, [location.search]);

    useEffect(() => {
        const fetchCandidateId = async () => {
            try {
                const id = await getCandidateId();
                setCandidateId(id);
                const response = await getCandidateById({ _id: id, scope_fields: ["docs"] });
                if (response.status && response.data.docs) {
                    const docs = response.data.docs.reduce((acc, doc) => {
                        if (doc.doc_name === '10th Marksheet') {
                            acc['tenthMarksheet'] = doc.file_name;
                        } else if (doc.doc_name === '12th Marksheet') {
                            acc['twelfthMarksheet'] = doc.file_name;
                        } else {
                            acc[doc.doc_name.replace(/[^a-zA-Z0-9]/g, '')] = doc.file_name;
                        }
                        return acc;
                    }, {});
                    setExistingFiles(docs);
                }
            } catch (error) {
                //  console.error("Error fetching candidate ID:", error);
            }
        };
        fetchCandidateId();
    }, []);

    const handleFileChange = async (e, doc_category, sub_doc_category, doc_name) => {
        const file = e.target.files[0];
        if (file) {
            let sanitizedDocName = '';
            if (doc_name === '10th Marksheet') {
                sanitizedDocName = 'tenthMarksheet'
            } else if (doc_name === '12th Marksheet') {
                sanitizedDocName = 'twelfthMarksheet'
            } else {
                sanitizedDocName = doc_name.replace(/[^a-zA-Z0-9]/g, '');
            }

            setFiles({
                ...files,
                [sanitizedDocName]: file
            });

            // Upload the file
            try {
                const formData = new FormData();
                formData.append('filename', file);
                formData.append('doc_category', doc_category);
                formData.append('sub_doc_category', sub_doc_category);
                formData.append('doc_name', doc_name);
                if (candidateId) {
                    // console.log(candidateId)
                    formData.append('_id', candidateId);
                }
                const response = await uploadKycDocs(formData);
                if (response.status) {
                    setFlashMessage({ text: response.message, type: 'success' });
                    setShowFlash(true);
                    setTimeout(() => {
                        setShowFlash(false);
                        setFlashMessage({ text: '', type: '' });
                    }, 5000);
                } else {
                    setFlashMessage({ text: response.message, type: 'error' });
                    setShowFlash(true);
                    setTimeout(() => {
                        setShowFlash(false);
                        setFlashMessage({ text: '', type: '' });
                    }, 5000);
                }
                //  console.log(`File ${doc_name} uploaded successfully`);
            } catch (error) {
                if (error.response && error.response.status === 403) {
                    // Handle the 403 error specifically
                    setFlashMessage({ text: error.response.message, type: 'error' });
                } else {
                    // Handle other errors
                    setFlashMessage({ text: "An error occurred while uploading the doc.", type: 'error' });
                }
                setShowFlash(true);
                setTimeout(() => {
                    setShowFlash(false);
                    setFlashMessage({ text: '', type: '' });
                }, 5000);
            }
        }
    };

    const handleNextStep = () => {
        setCurrentStep((prevStep) => prevStep + 1);
    };

    const handlePrevStep = () => {
        setCurrentStep((prevStep) => prevStep - 1);
    };

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });
    }, []);
    // Function to handle adding a new file input field
    const handleAddFileField = () => {
        setFileFields([...fileFields, { id: fileFields.length, file: null }]);
    };

    const handleAddExpiriaceLetterField = () => {
        setExpiriaceLetterFields([...expiriaceLetterFields, { id: expiriaceLetterFields.length, file: null }]);
    }
    const handleAddRelievingLetterField = () => {
        setRelievingLetterFields([...relievingLetterFields, { id: relievingLetterFields.length, file: null }]);
    }
    const handleAddSalarySlipField = () => {
        setSalarySlipFields([...salarySlipFields, { id: salarySlipFields.length, file: null }]);
    }

    const handleRemoveExpiriaceLetterField = (id) => {
        setExpiriaceLetterFields(expiriaceLetterFields.filter((field) => field.id !== id));
    };

    const handleRemoveRelievingLetterField = (id) => {
        setRelievingLetterFields(relievingLetterFields.filter((field) => field.id !== id));
    };

    const handleRemoveSalarySlipField = (id) => {
        setSalarySlipFields(salarySlipFields.filter((field) => field.id !== id));
    };

    // Function to handle removing a file input field
    const handleRemoveFileField = (id) => {
        setFileFields(fileFields.filter((field) => field.id !== id));
    };



    const submitDocumentStatus = async () => {
        if (!candidateId) {
            setFlashMessage({ text: "Candidate ID is missing.", type: 'error' });
            setShowFlash(true);
            setTimeout(() => {
                setShowFlash(false);
                setFlashMessage({ text: '', type: '' });
            }, 5000);
            return;
        }

        try {
            const response = await updateFinalDocumentStatus({ 'candidate_id': candidateId });
            if (response.status) {
                setFlashMessage({ text: response.message, type: 'success' });
                setShowFlash(true);
                setTimeout(() => {
                    setShowFlash(false);
                    setFlashMessage({ text: '', type: '' });
                    navigate('/your-document'); // Redirect to your-document page
                }, 2000);
            } else {
                setFlashMessage({ text: response.message || "Failed to update document status.", type: 'error' });
                setShowFlash(true);
                setTimeout(() => {
                    setShowFlash(false);
                    setFlashMessage({ text: '', type: '' });
                }, 2000);
            }
        } catch (error) {
            let errorMessage = "An error occurred while updating document status.";

            if (error.response) {
                if (error.response.status === 403) {
                    errorMessage = error.response.data.message || "Access forbidden.";
                } else {
                    errorMessage = error.response.data.message || errorMessage;
                }
            }

            setFlashMessage({ text: errorMessage, type: 'error' });
            setShowFlash(true);
            setTimeout(() => {
                setShowFlash(false);
                setFlashMessage({ text: '', type: '' });
            }, 5000);
        }
    };
    return (
        <>
            {showFlash && (
                <div className={`flash-message ${flashMessage.type}`}>
                    {flashMessage.type === 'success' && <FaCheckCircle className="icon" />}
                    {flashMessage.type === 'error' && <FaExclamationCircle className="icon" />}
                    <p>{flashMessage.text}</p>
                    <button className="close" onClick={() => setShowFlash(false)}>&times;</button>
                </div>
            )}
            <div className="maincontent">
                <div className="contentwrap">
                    <div className="contentbox">
                        <div className="contenthdr">
                            <h4>Upload Documents</h4>
                        </div>
                        <div className="contents">
                            <div className="doc_steps" data-aos="fade-in" data-aos-duration="3000">
                                <ul className="steps">
                                    <li className="ongoing">
                                        <span>1</span>
                                        <p>KYC Document</p>
                                    </li>
                                    <li className={`${(currentStep === 1 || currentStep === 2) ? "ongoing" : ""}`}>
                                        <span>2</span>
                                        <p>Educational Document</p>
                                    </li>
                                    <li className={`${currentStep === 2 ? "ongoing" : ""}`}>
                                        <span>3</span>
                                        <p>Experience Document</p>
                                    </li>
                                </ul>
                            </div>
                            <div className="steps_wrapper">
                                <div className={`animate__animated animate__fadeIn animate__slower docuplods row ${currentStep === 0 ? "active" : ""}`}>
                                    <div className="col-sm-12">
                                        <div className="uplaodrow">
                                            <label>1. Aadhar Front</label>
                                            <div className="customfile_upload">
                                                <input
                                                    type="file"
                                                    className="cstmfile"
                                                    onChange={(e) => handleFileChange(e, 'KYC', 'Document', 'Aadhar Front')}
                                                />
                                                <span className="filenames">{files.AadharFront?.name || existingFiles.AadharFront || "Choose file"}</span>
                                            </div>
                                        </div>
                                        <div className="uplaodrow">
                                            <label>2. Aadhar Back</label>
                                            <div className="customfile_upload">
                                                <input
                                                    type="file"
                                                    className="cstmfile"
                                                    onChange={(e) => handleFileChange(e, 'KYC', 'Document', 'Aadhar Back')}
                                                />
                                                <span className="filenames">{files.AadharBack?.name || existingFiles.AadharBack || "Choose file"}</span>
                                            </div>
                                        </div>
                                        <div className="uplaodrow">
                                            <label>3. Upload Pancard</label>
                                            <div className="customfile_upload">
                                                <input
                                                    type="file"
                                                    className="cstmfile"
                                                    onChange={(e) => handleFileChange(e, 'KYC', 'Document', 'Pancard')}
                                                />
                                                <span className="filenames">{files.Pancard?.name || existingFiles.Pancard || "Choose file"}</span>
                                            </div>
                                        </div>
                                        <div className="uplaodrow">
                                            <label>4. Upload Passport Size Photo</label>
                                            <div className="customfile_upload">
                                                <input
                                                    type="file"
                                                    className="cstmfile"
                                                    onChange={(e) => handleFileChange(e, 'KYC', 'Document', 'Photo')}
                                                />
                                                <span className="filenames">{files.Photo?.name || existingFiles.Photo || "Choose file"}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-5 btndocuplods">
                                        <button onClick={handleNextStep} className="docnextbtns sitebtn">Next</button>
                                    </div>
                                </div>

                                <div className={`animate__animated animate__fadeIn animate__slower edu_docs docuplods row ${currentStep === 1 ? "active" : ""}`}>
                                    <div className="uplaodrow">
                                        <Tabs defaultActiveKey="certificate" id="justify-tab-example" className="mb-3 doctabs">
                                            <Tab eventKey="certificate" title="Certificate">
                                                <div className="col-sm-12">
                                                    <div className="uplaodrow">
                                                        <label>1. 10th Marksheet</label>
                                                        <div className="customfile_upload">
                                                            <input
                                                                type="file"
                                                                className="cstmfile"
                                                                onChange={(e) => handleFileChange(e, 'Educational', 'Marksheet', '10th Marksheet')}
                                                            />
                                                            <span className="filenames">{files.tenthMarksheet?.name || existingFiles.tenthMarksheet || "Choose file"}</span>
                                                        </div>
                                                    </div>
                                                    <div className="uplaodrow">
                                                        <label>2. 12th Marksheet</label>
                                                        <div className="customfile_upload">
                                                            <input
                                                                type="file"
                                                                className="cstmfile"
                                                                onChange={(e) => handleFileChange(e, 'Educational', 'Marksheet', '12th Marksheet')}
                                                            />
                                                            <span className="filenames">{files.twelfthMarksheet?.name || existingFiles.twelfthMarksheet || "Choose file"}</span>
                                                        </div>
                                                    </div>
                                                    <div className="uplaodrow">
                                                        <label>3. Graduation Marksheet</label>
                                                        <div className="customfile_upload">
                                                            <input
                                                                type="file"
                                                                className="cstmfile"
                                                                onChange={(e) => handleFileChange(e, 'Educational', 'Marksheet', 'Graduation Marksheet')}
                                                            />
                                                            <span className="filenames">{files.GraduationCertificate?.name || existingFiles.GraduationCertificate || "Choose file"}</span>
                                                        </div>
                                                    </div>
                                                    <div className="uplaodrow">
                                                        <label>4. Post Graduation Marksheet</label>
                                                        <div className="customfile_upload">
                                                            <input
                                                                type="file"
                                                                className="cstmfile"
                                                                onChange={(e) => handleFileChange(e, 'Educational', 'Marksheet', 'Post Graduation Marksheet')}
                                                            />
                                                            <span className="filenames">{files.PostGraduationCertificate?.name || existingFiles.PostGraduationCertificate || "Choose file"}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Tab>
                                            <Tab eventKey="skills" title="Skills">
                                                <div className="col-sm-12">
                                                    <div className="uplaodrow">
                                                        <label>Upload Certificate(s)</label>
                                                        {/* <SkillDocs /> */}
                                                        <div className='d-flex align-items-center gap-4 flex-wrap'>
                                                            {fileFields.map((field, index) => (
                                                                <div className='d-flex align-items-center gap-4 certify_btn' key={field.id}>
                                                                    <input className='cstmfile' type="file" onChange={(e) => handleFileChange(e, 'Educational', 'Skills', `Skills-${index}`)} />
                                                                    <button className="subtbtn" onClick={() => handleRemoveFileField(field.id)}>-</button>
                                                                </div>
                                                            ))}
                                                            <button className='addbtn' onClick={handleAddFileField}>+</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Tab>
                                        </Tabs>
                                        <div className="mt-5 btndocuplods">
                                            <button onClick={handleNextStep} className="docnextbtns sitebtn">Next</button>
                                            <button onClick={handlePrevStep} className="docprevbtns sitebtn">Previous</button>
                                        </div>
                                    </div>
                                </div>
                                <div className={`animate__animated animate__fadeIn animate__slower docuplods row ${currentStep === 2 ? "active" : ""}`}>
                                    <div className="col-sm-12">
                                        <div className="uplaodrow">
                                            <label>1. Experience Letter</label>
                                            {/* <div className='d-flex align-items-center gap-4 flex-wrap'>
                                                        {fileFields.map((field, index) => (
                                                            <div className='d-flex align-items-center gap-4 certify_btn' key={field.id}>
                                                                <input className='cstmfile' type="file" onChange={(e) => handleFileChange(e, 'Educational', 'Skills', `Skills-${index}`)} />
                                                                <button className="subtbtn" onClick={() => handleRemoveFileField(field.id)}>-</button>
                                                            </div>
                                                        ))}
                                                        <button className='addbtn' onClick={handleAddFileField}>+</button> */}
                                            {
                                                expiriaceLetterFields.map((field, index) => (
                                                    <div className='d-flex align-items-center flex-nowrap gap-4 certify_btn mt-2' key={field.id} style={{ flexWrap: 'nowrap !important' }}>
                                                        <input className='cstmfile' type="file" accept="image/*, application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/msword"
                                                            onChange={(e) => handleFileChange(e, 'Experience', 'Letter', `Experience Letter-${index}`)} />
                                                        {/* <button className="subtbtn" onClick={() => handleRemoveExpiriaceLetterField(field.id)}>-</button> */}
                                                        {
                                                            expiriaceLetterFields.length > 1 && (
                                                                <button className="subtbtn" onClick={() => handleRemoveExpiriaceLetterField(field.id)}>-</button>
                                                            )
                                                        }
                                                    </div>
                                                ))
                                            }
                                            <button className='addbtn mt-2' style={{ backgroundColor: "black", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px" }} onClick={handleAddExpiriaceLetterField}>+</button>
                                            {/* <div className="customfile_upload">
                                                <input 
                                                    type="file" 
                                                    className="cstmfile" 
                                                    onChange={(e) => handleFileChange(e, 'Experience', 'Letter', 'Experience Letter')}
                                                />
                                                <span className="filenames">{files.ExperienceLetter?.name || existingFiles.ExperienceLetter || "Choose file"}</span>
                                            </div> */}
                                        </div>
                                        <div className="uplaodrow">
                                            <label>2. Relieving Letter</label>
                                            {
                                                relievingLetterFields.map((field, index) => (
                                                    <div className='d-flex align-items-center flex-nowrap gap-4 certify_btn mt-2' key={field.id} style={{ flexWrap: 'nowrap !important' }}>
                                                        <input className='cstmfile' type="file" accept="image/*, application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/msword"
                                                            onChange={(e) => handleFileChange(e, 'Experience', 'Letter', `Relieving Letter-${index}`)} />
                                                        {
                                                            relievingLetterFields.length > 1 && (
                                                                <button className="subtbtn" onClick={() => handleRemoveRelievingLetterField(field.id)}>-</button>
                                                            )
                                                        }
                                                    </div>
                                                ))
                                            }
                                            <button className='addbtn mt-2' style={{ backgroundColor: "black", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px" }} onClick={handleAddRelievingLetterField}>+</button>


                                            {/* <div className="customfile_upload">
                                                <input 
                                                    type="file" 
                                                    className="cstmfile" 
                                                    onChange={(e) => handleFileChange(e, 'Experience', 'Letter', 'Relieving Letter')}
                                                />
                                                <span className="filenames">{files.RelievingLetter?.name || existingFiles.RelievingLetter || "Choose file"}</span>
                                            </div> */}
                                        </div>
                                        <div className="uplaodrow">
                                            <label>3. Salary Slip</label>
                                            {
                                                salarySlipFields.map((field, index) => (
                                                    <div className='d-flex align-items-center flex-nowrap gap-4 certify_btn mt-2' key={field.id} style={{ flexWrap: 'nowrap !important' }}>
                                                        <input className='cstmfile' type="file" accept="image/*, application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/msword"
                                                            onChange={(e) => handleFileChange(e, 'Experience', 'Letter', `Salary Slip-${index}`)} />
                                                        {
                                                            salarySlipFields.length > 1 && (
                                                                <button className="subtbtn" onClick={() => handleRemoveSalarySlipField(field.id)}>-</button>
                                                            )
                                                        }
                                                    </div>
                                                ))
                                            }
                                            <button className='addbtn mt-2' style={{ backgroundColor: "black", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px" }} onClick={handleAddSalarySlipField}>+</button>

                                            {/* <div className="customfile_upload">
                                                <input 
                                                    type="file" 
                                                    className="cstmfile" 
                                                    onChange={(e) => handleFileChange(e, 'Experience', 'Letter', 'Salary Slip')}
                                                />
                                                <span className="filenames">{files.SalarySlip?.name || existingFiles.SalarySlip || "Choose file"}</span>
                                            </div> */}
                                        </div>
                                    </div>
                                    <div className="mt-5 btndocuplods">
                                        <button onClick={submitDocumentStatus} className="docnextbtns sitebtn">Final Submit</button>
                                        {/* <Link to="/your-document">
                                           
                                        </Link> */}
                                        <button onClick={handlePrevStep} className="docprevbtns sitebtn">Previous</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Upload_document;
