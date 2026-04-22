import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import AOS from 'aos';
import { getCandidateId } from "../helper/My_Helper";
import { uploadKycDocs, getCandidateById, updateFinalDocumentStatus } from "../helper/Api_Helper";
import { FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa';
import { LiaFileUploadSolid } from "react-icons/lia";

/* ─── Drag-and-Drop Upload Box ─────────────────────────────────────────── */
const DropBox = ({ docCategory, subDocCategory, docName, onFileChange, existingFile }) => {
    const [dragOver, setDragOver] = useState(false);
    const [preview, setPreview] = useState(null);
    const [fileName, setFileName] = useState(existingFile || null);
    const inputRef = useRef(null);

    const processFile = useCallback((file) => {
        if (!file) return;
        setFileName(file.name);
        if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target.result);
            reader.readAsDataURL(file);
        } else {
            setPreview("file");
        }
        onFileChange(file, docCategory, subDocCategory, docName);
    }, [docCategory, subDocCategory, docName, onFileChange]);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        processFile(file);
    };

    const handleInputChange = (e) => {
        processFile(e.target.files[0]);
    };

    const handleClear = (e) => {
        e.stopPropagation();
        setPreview(null);
        setFileName(null);
        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <div className="dropbox-wrapper">
            <input
                ref={inputRef}
                type="file"
                style={{ display: "none" }}
                onChange={handleInputChange}
                accept="image/*, application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/msword"
            />

            {preview ? (
                <div className="dropbox-preview-container">
                    <div className="dropbox-preview">
                        {preview === "file" ? (
                            <div className="file-preview-icon">
                                <span className="file-preview-name">{fileName}</span>
                                <LiaFileUploadSolid size={40} />
                            </div>
                        ) : (
                            <img src={preview} alt="preview" className="img-preview" />
                        )}
                        <div className="preview-overlay">
                            <button className="clear-btn" onClick={handleClear} title="Remove">
                                <FaTimes />
                            </button>
                            <button
                                className="reupload-btn"
                                onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                                title="Re-upload"
                            >
                                <LiaFileUploadSolid size={18} /> Change
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div
                        className={`dropbox ${dragOver ? "dragover" : ""}`}
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        onClick={() => inputRef.current?.click()}
                    >
                        <div className="dropbox-placeholder single-upload">
                            <div className="dropbox-left">
                                <p className="drop-hint">
                                    {existingFile
                                        ? (
                                            <>
                                                <span className="existing-file">{existingFile}</span>
                                                <br />
                                                <small>Drop or click to replace</small>
                                            </>
                                        )
                                        : (
                                            <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
                                            <button
                                                className="upload-icon-btn"
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    inputRef.current?.click();
                                                }}
                                            >
                                                <LiaFileUploadSolid size={20} />
                                            </button>
                                        
                                            <span>
                                                <strong>Drag & drop</strong><br />
                                                <small>or click to upload</small>
                                            </span>
                                        </div>
                                        
                                        )
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

/* ─── Multi-file drop row ────────────────────────────────────────────────── */
const MultiDropRow = ({ label, docCategory, subDocCategory, docPrefix, onFileChange }) => {
    const [fields, setFields] = useState([{ id: 0 }]);

    const addField = () => setFields(f => [...f, { id: f.length }]);
    const removeField = (id) => setFields(f => f.filter(x => x.id !== id));

    return (
        <div className="uplaodrow">
            <label>{label}</label>
            <div className="multi-drop-wrap">
                {fields.map((field, index) => (
                    <div className="multi-drop-item" key={field.id}>
                        <DropBox
                            docCategory={docCategory}
                            subDocCategory={subDocCategory}
                            docName={`${docPrefix}-${index}`}
                            onFileChange={onFileChange}
                        />
                        {fields.length > 1 && (
                            <button className="subtbtn" onClick={() => removeField(field.id)}>−</button>
                        )}
                    </div>
                ))}
                <button className="addbtn-new" onClick={addField}>+ Add More</button>
            </div>
        </div>
    );
};

/* ─── Step Card ──────────────────────────────────────────────────────────── */
const StepCard = ({ number, title, active, done, onClick }) => (
    <div
        className={`step-card ${active ? "step-card--active" : ""} ${done ? "step-card--done" : ""}`}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
        <div className="step-card__number">{done ? <FaCheckCircle /> : number}</div>
        <div className="step-card__title">{title}</div>
        {active && <div className="step-card__indicator" />}
    </div>
);

/* ─── Main Component ─────────────────────────────────────────────────────── */
const Upload_document = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [existingFiles, setExistingFiles] = useState({});
    const [candidateId, setCandidateId] = useState(null);
    const [flashMessage, setFlashMessage] = useState({ text: '', type: '' });
    const [showFlash, setShowFlash] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const docType = searchParams.get('doc');
        if (docType === 'kyc') setCurrentStep(0);
        else if (docType === 'education certificates') setCurrentStep(1);
        else if (docType === 'education skills') setCurrentStep(2);
        else if (docType === 'experience') setCurrentStep(3);
    }, [location.search]);

    useEffect(() => {
        const fetchCandidateId = async () => {
            try {
                const id = await getCandidateId();
                setCandidateId(id);
                const response = await getCandidateById({ _id: id, scope_fields: ["docs"] });
                if (response.status && response.data.docs) {
                    const docs = response.data.docs.reduce((acc, doc) => {
                        if (doc.doc_name === '10th Marksheet') acc['tenthMarksheet'] = doc.file_name;
                        else if (doc.doc_name === '12th Marksheet') acc['twelfthMarksheet'] = doc.file_name;
                        else acc[doc.doc_name.replace(/[^a-zA-Z0-9]/g, '')] = doc.file_name;
                        return acc;
                    }, {});
                    setExistingFiles(docs);
                }
            } catch (_) {}
        };
        fetchCandidateId();
    }, []);

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    const flash = (text, type) => {
        setFlashMessage({ text, type });
        setShowFlash(true);
        setTimeout(() => { setShowFlash(false); setFlashMessage({ text: '', type: '' }); }, 5000);
    };

    const handleFileChange = useCallback(async (file, doc_category, sub_doc_category, doc_name) => {
        try {
            const formData = new FormData();
            formData.append('filename', file);
            formData.append('doc_category', doc_category);
            formData.append('sub_doc_category', sub_doc_category);
            formData.append('doc_name', doc_name);
            if (candidateId) formData.append('_id', candidateId);
            const response = await uploadKycDocs(formData);
            flash(response.message, response.status ? 'success' : 'error');
        } catch (error) {
            flash(error?.response?.data?.message || "An error occurred while uploading the doc.", 'error');
        }
    }, [candidateId]);

    const submitDocumentStatus = async () => {
        if (!candidateId) { flash("Candidate ID is missing.", 'error'); return; }
        try {
            const response = await updateFinalDocumentStatus({ 'candidate_id': candidateId });
            if (response.status) {
                flash(response.message, 'success');
                setTimeout(() => navigate('/your-document'), 2000);
            } else {
                flash(response.message || "Failed to update document status.", 'error');
            }
        } catch (error) {
            flash(error?.response?.data?.message || "An error occurred while updating document status.", 'error');
        }
    };

    const steps = [
        { title: "KYC Document" },
        { title: "Educational Certificates" },
        { title: "Educational Skills" },
        { title: "Experience Document" },
    ];

    return (
        <>
            <style>{`
                /* ── Flash ── */
                .flash-message {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 12px 18px;
                    border-radius: 8px;
                    margin-bottom: 16px;
                    font-size: 14px;
                }
                .flash-message.success {
                    background: #d1fae5;
                    color: #065f46;
                }
                .flash-message.error {
                    background: #fee2e2;
                    color: #991b1b;
                }
                .flash-message .close {
                    margin-left: auto;
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 18px;
                }

                /* ── Step Cards ── */
                .step-cards {
                    display: flex;
                    gap: 16px;
                    margin-bottom: 32px;
                    flex-wrap: wrap;
                }
                .step-card {
                    flex: 1;
                    min-width: 140px;
                    padding: 18px 16px 14px;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                    background: #fff;
                    transition: all .2s;
                    position: relative;
                    overflow: hidden;
                    user-select: none;
                }
                .step-card:hover {
                    border-color: #6366f1;
                    box-shadow: 0 4px 16px rgba(99,102,241,.15);
                    transform: translateY(-2px);
                }
                .step-card--active {
                    border-color: #6366f1;
                    background: linear-gradient(135deg,#eef2ff,#fff);
                    box-shadow: 0 4px 20px rgba(99,102,241,.2);
                }
                .step-card--done {
                    border-color: #10b981;
                    background: #f0fdf4;
                }
                .step-card__number {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #e0e7ff;
                    color: #6366f1;
                    font-weight: 700;
                    font-size: 15px;
                }
                .step-card--active .step-card__number {
                    background: #6366f1;
                    color: #fff;
                }
                .step-card--done .step-card__number {
                    background: #10b981;
                    color: #fff;
                }
                .step-card__title {
                    font-size: 13px;
                    font-weight: 600;
                    text-align: center;
                    color: #374151;
                }
                .step-card--active .step-card__title {
                    color: #6366f1;
                }
                .step-card--done .step-card__title {
                    color: #065f46;
                }
                .step-card__indicator {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: #6366f1;
                    border-radius: 0 0 10px 10px;
                }

                /* ── Drop Box Wrapper and Styles ── */
                .dropbox-wrapper {
                    position: relative;
                    width: 280px;
                    height: 180px;
                }
                
                .dropbox {
                    width: 100%;
                    height: 100%;
                    border: 2px dashed #c7d2fe;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    background: #fafbff;
                    transition: 0.2s;
                    text-align: center;
                    padding: 10px;
                }
                
                .dropbox.dragover {
                    border-color: #6366f1;
                    background: #eef2ff;
                }

                /* ICON INSIDE BOX */
.dropbox-icon-inside {
    position: absolute;
    right: 8px;
    bottom: 8px;
}    
                .dropbox-placeholder.single-upload {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    padding: 16px;
                    text-align: center;
                }

                .dropbox-left {
                    flex: 1;
                    text-align: center;
                }

                .drop-hint {
                    font-size: 12px;
                    color: #6b7280;
                    margin: 0;
                }

                .existing-file {
                    color: #6366f1;
                    font-weight: 600;
                    font-size: 12px;
                    word-break: break-all;
                }

                /* Icon outside dropbox at right corner */
                .dropbox-icon-right {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .upload-icon-btn {
                    background: #eef2ff;
                    border-radius: 8px; /* not circle */
                    padding: 8px 12px;
                    border: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px; /* space between icon & text */
                    cursor: pointer;
                    color: #6366f1;
                }
                
                .upload-icon-btn:hover {
                    background: #6366f1;
                    color: #fff;
                    transform: scale(1.08);
                }

                /* ── Preview Styles ── */
                .dropbox-preview-container {
                    flex: 1;
                }

                .dropbox-preview {
                    width: 100%;
                    height: 180px;
                    position: relative;
                    border: 2px solid #a5b4fc;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #fff;
                }

                .img-preview {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    padding: 8px;
                    background: #fff;
                    border-radius: 10px;
                }

                .file-preview-icon {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 6px;
                    padding: 20px;
                    color: #6366f1;
                }

                .file-preview-name {
                    font-size: 12px;
                    color: #374151;
                    word-break: break-all;
                    text-align: center;
                    max-width: 200px;
                }

                .preview-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.45);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    opacity: 0;
                    transition: 0.2s;
                    border-radius: 10px;
                }

                .dropbox-preview:hover .preview-overlay {
                    opacity: 1;
                }

                .clear-btn, .reupload-btn {
                    background: rgba(255, 255, 255, 0.9);
                    border: none;
                    border-radius: 8px;
                    padding: 6px 12px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 13px;
                    font-weight: 600;
                    transition: 0.15s;
                }

                .clear-btn {
                    color: #ef4444;
                }

                .reupload-btn {
                    color: #6366f1;
                }

                .clear-btn:hover {
                    background: #fee2e2;
                }

                .reupload-btn:hover {
                    background: #eef2ff;
                }

                /* ── Upload Row ── */
                .uplaodrow {
                    margin-bottom: 24px;
                }
                .uplaodrow label {
                    display: block;
                    font-weight: 600;
                    color: #374151;
                    margin-bottom: 8px;
                    font-size: 14px;
                }

                /* ── Multi Drop ── */
                .multi-drop-wrap {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 14px;
                    align-items: flex-start;
                }
                .multi-drop-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                }
                .multi-drop-item .dropbox {
                    width: 280px;
                    min-height: 100px;
                }
                .multi-drop-item .dropbox-wrapper {
                    width: 100%;
                }
                .subtbtn {
                    background: #fee2e2;
                    color: #ef4444;
                    border: none;
                    border-radius: 6px;
                    padding: 4px 12px;
                    cursor: pointer;
                    font-weight: 700;
                    font-size: 16px;
                }
                .addbtn-new {
                    background: #eef2ff;
                    color: #6366f1;
                    border: 2px dashed #a5b4fc;
                    border-radius: 10px;
                    padding: 8px 16px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 13px;
                    align-self: center;
                    transition: .2s;
                }
                .addbtn-new:hover {
                    background: #6366f1;
                    color: #fff;
                    border-style: solid;
                }

                /* ── Section visibility ── */
                .docuplods {
                    display: none;
                }
                .docuplods.active {
                    display: block;
                }

                /* ── Nav buttons ── */
                .btndocuplods {
                    display: flex;
                    gap: 12px;
                    margin-top: 24px;
                }
                .docnextbtns, .docprevbtns {
                    padding: 10px 28px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    border: none;
                    font-size: 14px;
                }
                .docnextbtns {
                    background: #6366f1;
                    color: #fff;
                }
                .docnextbtns:hover {
                    background: #4f46e5;
                }
                .docprevbtns {
                    background: #f3f4f6;
                    color: #374151;
                }
                .docprevbtns:hover {
                    background: #e5e7eb;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .dropbox {
                        min-width: 200px;
                    }
                    .dropbox-wrapper {
                        flex-direction: column;
                    }
                    .dropbox-icon-right {
                        margin-top: 8px;
                    }
                }
            `}</style>

            {showFlash && (
                <div className={`flash-message ${flashMessage.type}`}>
                    {flashMessage.type === 'success' && <FaCheckCircle className="icon" />}
                    {flashMessage.type === 'error' && <FaExclamationCircle className="icon" />}
                    <p style={{ margin: 0 }}>{flashMessage.text}</p>
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

                            {/* ── Step Cards ── */}
                            <div className="step-cards" data-aos="fade-in">
                                {steps.map((step, i) => (
                                    <StepCard
                                        key={i}
                                        number={i + 1}
                                        title={step.title}
                                        active={currentStep === i}
                                        done={currentStep > i}
                                        onClick={() => setCurrentStep(i)}
                                    />
                                ))}
                            </div>

                            <div className="steps_wrapper">

                                {/* ── Step 0: KYC ── */}
                                <div className={`animate__animated animate__fadeIn animate__slower docuplods row ${currentStep === 0 ? "active" : ""}`}>
                                    <div className="col-sm-12">
                                        {[
                                            { label: "1. Aadhar Front", cat: "KYC", sub: "Document", name: "Aadhar Front", key: "AadharFront" },
                                            { label: "2. Aadhar Back", cat: "KYC", sub: "Document", name: "Aadhar Back", key: "AadharBack" },
                                            { label: "3. Upload Pancard", cat: "KYC", sub: "Document", name: "Pancard", key: "Pancard" },
                                            { label: "4. Upload Passport Size Photo", cat: "KYC", sub: "Document", name: "Photo", key: "Photo" },
                                        ].map(({ label, cat, sub, name, key }) => (
                                            <div className="uplaodrow" key={key}>
                                                <label>{label}</label>
                                                <DropBox
                                                    docCategory={cat}
                                                    subDocCategory={sub}
                                                    docName={name}
                                                    onFileChange={handleFileChange}
                                                    existingFile={existingFiles[key] || null}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="btndocuplods">
                                        <button onClick={() => setCurrentStep(s => s + 1)} className="docnextbtns sitebtn">Next</button>
                                    </div>
                                </div>

                                {/* ── Step 2: Education Certificates ── */}
                                <div className={`animate__animated animate__fadeIn animate__slower edu_docs docuplods row ${currentStep === 1 ? "active" : ""}`}>
                                    <div className="uplaodrow">
                                                <div className="col-sm-12">
                                                    {[
                                                        { label: "1. 10th Marksheet", cat: "Educational", sub: "Marksheet", name: "10th Marksheet", key: "tenthMarksheet" },
                                                        { label: "2. 12th Marksheet", cat: "Educational", sub: "Marksheet", name: "12th Marksheet", key: "twelfthMarksheet" },
                                                        { label: "3. Graduation Marksheet", cat: "Educational", sub: "Marksheet", name: "Graduation Marksheet", key: "GraduationCertificate" },
                                                        { label: "4. Post Graduation Marksheet", cat: "Educational", sub: "Marksheet", name: "Post Graduation Marksheet", key: "PostGraduationCertificate" },
                                                    ].map(({ label, cat, sub, name, key }) => (
                                                        <div className="uplaodrow" key={key}>
                                                            <label>{label}</label>
                                                            <DropBox
                                                                docCategory={cat}
                                                                subDocCategory={sub}
                                                                docName={name}
                                                                onFileChange={handleFileChange}
                                                                existingFile={existingFiles[key] || null}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                        <div className="btndocuplods">
                                            <button onClick={() => setCurrentStep(s => s + 1)} className="docnextbtns sitebtn">Next</button>
                                            <button onClick={() => setCurrentStep(s => s - 1)} className="docprevbtns sitebtn">Previous</button>
                                        </div>
                                    </div>
                                </div>
                                {/* ── Step 3: Education Skills ── */}
                                <div className={`animate__animated animate__fadeIn animate__slower edu_docs docuplods row ${currentStep === 2 ? "active" : ""}`}>
                                    <div className="uplaodrow">
                                                <div className="col-sm-12">
                                                    <MultiDropRow
                                                        label="Upload Certificate(s)"
                                                        docCategory="Educational"
                                                        subDocCategory="Skills"
                                                        docPrefix="Skills"
                                                        onFileChange={handleFileChange}
                                                    />
                                                </div>
                                        <div className="btndocuplods">
                                            <button onClick={() => setCurrentStep(s => s + 1)} className="docnextbtns sitebtn">Next</button>
                                            <button onClick={() => setCurrentStep(s => s - 1)} className="docprevbtns sitebtn">Previous</button>
                                        </div>
                                    </div>
                                </div>

                                {/* ── Step 4: Experience ── */}
                                <div className={`animate__animated animate__fadeIn animate__slower docuplods row ${currentStep === 3 ? "active" : ""}`}>
                                    <div className="col-sm-12">
                                        <MultiDropRow
                                            label="1. Experience Letter / Relieving Letter"
                                            docCategory="Experience"
                                            subDocCategory="Letter"
                                            docPrefix="Experience Letter"
                                            onFileChange={handleFileChange}
                                        />
                                        <MultiDropRow
                                            label="2. Bank Statement (Last 3 months)"
                                            docCategory="Experience"
                                            subDocCategory="Letter"
                                            docPrefix="Bank Statement"
                                            onFileChange={handleFileChange}
                                        />
                                         <MultiDropRow
                                            label="3. Cancel Cheque / Passbook Photo"
                                            docCategory="Experience"
                                            subDocCategory="Letter"
                                            docPrefix="Bank Details"
                                            onFileChange={handleFileChange}
                                        />
                                        <MultiDropRow
                                            label="4. Salary Slip"
                                            docCategory="Experience"
                                            subDocCategory="Letter"
                                            docPrefix="Salary Slip"
                                            onFileChange={handleFileChange}
                                        />
                                    </div>
                                    <div className="btndocuplods">
                                        <button onClick={submitDocumentStatus} className="docnextbtns sitebtn">Final Submit</button>
                                        <button onClick={() => setCurrentStep(s => s - 1)} className="docprevbtns sitebtn">Previous</button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Upload_document;