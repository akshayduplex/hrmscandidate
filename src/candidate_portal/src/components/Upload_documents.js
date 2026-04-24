import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import AOS from 'aos';
import { deleteKycDoc, getCandidateId } from "../helper/My_Helper";
import { uploadKycDocs, getCandidateById, updateFinalDocumentStatus } from "../helper/Api_Helper";
import { FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa';
import { LiaFileUploadSolid } from "react-icons/lia";
import config from "../config/Config";

/* ─── Drag-and-Drop Upload Box ─────────────────────────────────────────── */
const DropBox = ({ docCategory, subDocCategory, docName, onFileChange, existingFile, onUploaded, onRemove, docId }) => {
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
        if (onUploaded) onUploaded();
    }, [docCategory, subDocCategory, docName, onFileChange, onUploaded]);
    
    useEffect(() => {
        if (existingFile) {
            setFileName(existingFile.split('/').pop());
    
            // Check if it's an image
            if (existingFile.match(/\.(jpeg|jpg|png|gif|webp)$/i)) {
                setPreview(existingFile);
            } else {
                setPreview("file");
            }
        } else {
            setPreview(null);
            setFileName(null);
        }
    }, [existingFile]);
    
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
        if (inputRef.current) inputRef.current.value = "";
        setPreview(null);
        setFileName(null);
        // Call onRemove if provided (for multi-drop)
        if (onRemove) onRemove(docId);
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
                                {existingFile ? (
                                    <>
                                        <span className="existing-file">
                                            {typeof existingFile === "string" ? existingFile.split('/').pop() : ""}
                                        </span>
                                        <br />
                                        <small>Drop or click to replace</small>
                                    </>
                                ) : (
                                    <div className="upload-inner">
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
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

/* ─── Multi-file drop row ────────────────────────────────────────────────── */
const MultiDropRow = ({ label, docCategory, subDocCategory, docPrefix, onFileChange, existingDocs = [], onDeleteDoc }) => {
    const [fields, setFields] = useState([]);
    
    useEffect(() => {
        if (existingDocs.length > 0) {
            const mapped = existingDocs.map((doc, index) => ({
                id: doc._id || index,
                filled: true,
                file: doc,
                docId: doc._id
            }));

            // add one empty box at end
            setFields([...mapped, { id: Date.now(), filled: false }]);
        } else {
            setFields([{ id: Date.now(), filled: false }]);
        }
    }, [existingDocs]);
    
    const handleRemoveField = async (fieldId, docId) => {
        let canDelete = true;
    
        if (docId && onDeleteDoc) {
            canDelete = await onDeleteDoc(docId);
        }
    
        if (!canDelete) return;
    
        setFields(prev => {
            const updated = prev.filter(f => f.id !== fieldId);
    
            return updated.length ? updated : [{ id: Date.now(), filled: false }];
        });
    };
    
    const handleFieldFileChange = useCallback((file, docCat, subDocCat, docName, fieldId) => {
        // Mark this field as filled and auto-add a new empty slot if it's the last one
        setFields(prev => {
            const updated = prev.map(f => f.id === fieldId ? { ...f, filled: true } : f);
            const isLast = updated[updated.length - 1].id === fieldId;
            if (isLast) {
                return [...updated, { id: Date.now(), filled: false }];
            }
            return updated;
        });
        onFileChange(file, docCat, subDocCat, docName);
    }, [onFileChange]);

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
                            onFileChange={(file, cat, sub, name) =>
                                handleFieldFileChange(file, cat, sub, name, field.id)
                            }
                            existingFile={field.file?.file_name ? config.IMAGE_PATH + field.file.file_name : null}
                            onRemove={(docId) => handleRemoveField(field.id, docId)}
                            showRemove={fields.length > 1 || (field.filled && fields.length === 1)}
                            docId={field.docId}
                        />
                    </div>
                ))}
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
        else if (docType === 'education_certificates') setCurrentStep(1);
        else if (docType === 'skill_certificates') setCurrentStep(2);
        else if (docType === 'experience') setCurrentStep(3);
    }, [location.search]);

    const fetchCandidateData = useCallback(async () => {
        try {
            const id = await getCandidateId();
            setCandidateId(id);
            const response = await getCandidateById({ _id: id, scope_fields: ["docs"] });
            if (response.status && response.data.docs) {
                const docs = response.data.docs;

                const formatted = docs.reduce((acc, doc) => {
                    const key = doc.doc_name.replace(/[^a-zA-Z0-9]/g, '');
                
                    acc[key] = {
                        file_name: doc.file_name,
                        docId: doc._id
                    };

                    if (doc.sub_doc_category === "Skills") {
                        acc.skills = acc.skills || [];
                        acc.skills.push(doc);
                    }
                
                    if (doc.doc_category === "Experience") {
                        acc.experience = acc.experience || [];
                        acc.experience.push(doc);
                    }
                    
                    if (doc.doc_name === '10th Marksheet') {
                        acc['tenthMarksheet'] = acc[key];
                    } else if (doc.doc_name === '12th Marksheet') {
                        acc['twelfthMarksheet'] = acc[key];
                    }
                    else if (doc.doc_name === 'Graduation Marksheet') {
                        acc['GraduationCertificate'] = acc[key];
                    }
                    else if (doc.doc_name === 'Post Graduation Marksheet') {
                        acc['PostGraduationCertificate'] = acc[key];
                    } 
                    return acc;
                }, {});                                      
                setExistingFiles(formatted);
            }
        } catch (_) {}
    }, []);

    useEffect(() => {
        fetchCandidateData();
    }, [fetchCandidateData]);

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);
    
    const handleDelete = async (docId, key) => {
        if (!docId) {
            flash("No document ID found", "error");
            return false;
        }
    
        try {
            const res = await deleteKycDoc(docId, candidateId);
    
            if (res.status) {
                flash("Document deleted successfully", "success");
    
                setExistingFiles(prev => {
                    const updated = { ...prev };
                    if (key) {
                        delete updated[key];
                    } else {
                        // For multi-document deletion, we need to refresh from server
                        fetchCandidateData();
                    }
                    return updated;
                });
                
                return true;
            } else {
                flash(res.message || "Delete failed", "error");
                return false;
            }
    
        } catch (err) {
            flash(err?.response?.data?.message || err?.message || "Error deleting document", "error");
            return false;
        }
    };
    
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
            
            // Refresh the data to show newly uploaded document
            if (response.status) {
                setTimeout(() => fetchCandidateData(), 1000);
            }
        } catch (error) {
            flash(error?.response?.data?.message || "An error occurred while uploading the doc.", 'error');
        }
    }, [candidateId, fetchCandidateData]);

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
        { title: "Skill Certificates" },
        { title: "Experience Document" },
    ];

    return (
        <>
            <style>{`
                /* ── Reset box-sizing ── */
                *, *::before, *::after {
                    box-sizing: border-box;
                }

                /* ── Flash ── */
                .flash-message {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    padding: 12px 14px;
                    border-radius: 8px;
                    margin-bottom: 16px;
                    font-size: 14px;
                    flex-wrap: wrap;
                }
                .flash-message.success {
                    background: #d1fae5;
                    color: #065f46;
                }
                .flash-message.error {
                    background: #fee2e2;
                    color: #991b1b;
                }
                .flash-message p {
                    flex: 1;
                    margin: 0;
                    word-break: break-word;
                }
                .flash-message .close {
                    margin-left: auto;
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 18px;
                    flex-shrink: 0;
                }

                /* ── Step Cards ── */
                .step-cards {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 28px;
                    flex-wrap: wrap;
                }
                .step-card {
                    flex: 1 1 120px;
                    min-width: 80px;
                    padding: 14px 10px 12px;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 6px;
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
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #e0e7ff;
                    color: #6366f1;
                    font-weight: 700;
                    font-size: 14px;
                    flex-shrink: 0;
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
                    font-size: 11px;
                    font-weight: 600;
                    text-align: center;
                    color: #374151;
                    line-height: 1.3;
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

                /* ── Drop Box ── */
                .dropbox-wrapper {
                    position: relative;
                    width: 100%;
                    max-width: 320px;
                    min-height: 130px;
                }

                .dropbox {
                    width: 100%;
                    min-height: 159px;
                    border: 2px dashed #c7d2fe;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    background: #fafbff;
                    transition: 0.2s;
                    text-align: center;
                    padding: 12px;
                }

                .dropbox.dragover {
                    border-color: #6366f1;
                    background: #eef2ff;
                }

                .dropbox-placeholder.single-upload {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
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

                .upload-inner {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 16px;
                    flex-wrap: wrap;
                }

                .existing-file {
                    color: #6366f1;
                    font-weight: 600;
                    font-size: 12px;
                    word-break: break-all;
                }

                .upload-icon-btn {
                    background: #eef2ff;
                    border-radius: 8px;
                    padding: 8px 12px;
                    border: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    color: #6366f1;
                    flex-shrink: 0;
                }

                .upload-icon-btn:hover {
                    background: #6366f1;
                    color: #fff;
                    transform: scale(1.05);
                }

                /* ── Preview ── */
                .dropbox-preview-container {
                    width: 100%;
                    max-width: 320px;
                }

                .dropbox-preview {
                    width: 100%;
                    height: 160px;
                    position: relative;
                    border: 2px solid #a5b4fc;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #fff;
                    overflow: hidden;
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
                    padding: 16px;
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
                    gap: 10px;
                    opacity: 0;
                    transition: 0.2s;
                    border-radius: 10px;
                }

                .dropbox-preview:hover .preview-overlay {
                    opacity: 1;
                }

                /* Show overlay on touch devices always */
                @media (hover: none) {
                    .preview-overlay {
                        opacity: 1;
                        background: rgba(0, 0, 0, 0.3);
                    }
                }

                .clear-btn, .reupload-btn {
                    background: rgba(255, 255, 255, 0.92);
                    border: none;
                    border-radius: 8px;
                    padding: 6px 10px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 12px;
                    font-weight: 600;
                    transition: 0.15s;
                    white-space: nowrap;
                }

                .clear-btn { color: #ef4444; }
                .reupload-btn { color: #6366f1; }
                .clear-btn:hover { background: #fee2e2; }
                .reupload-btn:hover { background: #eef2ff; }

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
                .multi-drop-wrap {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 14px;
                }
                
                /* Desktop: 3 per row */
                .multi-drop-item {
                    width: calc(33.33% - 10px);
                    max-width: unset; /* ❌ remove 320px restriction */
                }
                
                /* Tablet: 2 per row */
                @media (max-width: 768px) {
                    .multi-drop-item {
                        width: calc(50% - 10px);
                    }
                }
                
                /* Mobile: 1 per row */
                @media (max-width: 480px) {
                    .multi-drop-item {
                        width: 100%;
                    }
                }
                
                .subtbtn {
                    background: #fee2e2;
                    color: #ef4444;
                    border: none;
                    border-radius: 6px;
                    padding: 5px 14px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 13px;
                }
                .addbtn-new {
                    background: #eef2ff;
                    color: #6366f1;
                    border: 2px dashed #a5b4fc;
                    border-radius: 10px;
                    padding: 10px 18px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 13px;
                    align-self: center;
                    transition: .2s;
                    width: 100%;
                    max-width: 200px;
                    text-align: center;
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
                    flex-wrap: wrap;
                }
                .docnextbtns, .docbackbtns {
                    padding: 6px 16px;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                    border: none;
                    font-size: 12px;
                    flex: unset;
                    min-width: auto;
                    width: auto;
                }
                
                .docnextbtns {
                    background: #6366f1;
                    color: #fff;
                }
                .docnextbtns:hover { background: #4f46e5; }
                .docbackbtns {
                    background: #f3f4f6;
                    color: #374151;
                }
                .docbackbtns:hover { background: #e5e7eb; }

                /* ── Mobile breakpoints ── */
                @media (max-width: 576px) {
                    .step-cards {
                        gap: 8px;
                    }
                    .step-card {
                        flex: 1 1 calc(50% - 8px);
                        min-width: 0;
                        padding: 12px 8px 10px;
                    }
                    .step-card__title {
                        font-size: 10px;
                    }
                    .step-card__number {
                        width: 28px;
                        height: 28px;
                        font-size: 12px;
                    }

                    .dropbox-wrapper,
                    .dropbox-preview-container {
                        max-width: 100%;
                    }

                    .multi-drop-item {
                        max-width: 100%;
                    }

                    .addbtn-new {
                        max-width: 100%;
                    }

                    .btndocuplods {
                        display: flex;
                        gap: 8px;
                        margin-top: 20px;
                        flex-wrap: wrap;
                        justify-content: flex-end;
                    }
                    
                    .docnextbtns, .docbackbtns {
                        width: 100%;
                        flex: unset;
                    }

                    .upload-inner {
                        gap: 10px;
                    }

                    .flash-message {
                        font-size: 13px;
                        padding: 10px 12px;
                    }
                }

                @media (min-width: 577px) and (max-width: 768px) {
                    .dropbox-wrapper,
                    .dropbox-preview-container {
                        max-width: 100%;
                    }
                    .multi-drop-item {
                        max-width: calc(50% - 7px);
                    }
                    .addbtn-new {
                        max-width: 160px;
                    }
                    .step-card {
                        flex: 1 1 calc(50% - 10px);
                    }
                    .step-card__title {
                        font-size: 11px;
                    }
                }
                .remove-box-btn {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: #ef4444;
                    color: #fff;
                    border: none;
                    border-radius: 50%;
                    width: 24px;
                    height: 24px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    z-index: 10;
                }
                
                .remove-box-btn:hover {
                    background: #dc2626;
                }
                
            `}</style>

            {showFlash && (
                <div className={`flash-message ${flashMessage.type}`}>
                    {flashMessage.type === 'success' && <FaCheckCircle className="icon" />}
                    {flashMessage.type === 'error' && <FaExclamationCircle className="icon" />}
                    <p>{flashMessage.text}</p>
                    <button className="close" onClick={() => setShowFlash(false)}>&times;</button>
                </div>
            )}

            <div className="maincontent">
                <div className="contentwrap p-2">
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
                                                    existingFile={
                                                        existingFiles[key]?.file_name
                                                          ? config.IMAGE_PATH + existingFiles[key].file_name
                                                          : null
                                                    }      
                                                    onRemove={() => handleDelete(existingFiles[key]?.docId, key)}
                                                    showRemove={!!existingFiles[key]}
                                                    docId={existingFiles[key]?.docId}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="btndocuplods">
                                        <button onClick={() => setCurrentStep(s => s + 1)} className="docnextbtns sitebtn">Next</button>
                                    </div>
                                </div>

                                {/* ── Step 1: Education Certificates ── */}
                                <div className={`animate__animated animate__fadeIn animate__slower edu_docs docuplods row ${currentStep === 1 ? "active" : ""}`}>
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
                                                    existingFile={
                                                        existingFiles[key]?.file_name
                                                          ? config.IMAGE_PATH + existingFiles[key].file_name
                                                          : null
                                                    }
                                                    onRemove={() => handleDelete(existingFiles[key]?.docId, key)}
                                                    showRemove={!!existingFiles[key]}
                                                    docId={existingFiles[key]?.docId}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="btndocuplods">
                                        <button onClick={() => setCurrentStep(s => s + 1)} className="docnextbtns sitebtn">Next</button>
                                        <button onClick={() => setCurrentStep(s => s - 1)} className="docbackbtns sitebtn">Back</button>
                                    </div>
                                </div>

                                {/* ── Step 2: Education Skills ── */}
                                <div className={`animate__animated animate__fadeIn animate__slower edu_docs docuplods row ${currentStep === 2 ? "active" : ""}`}>
                                    <div className="col-sm-12">
                                        <MultiDropRow
                                            label="Upload Certificate(s)"
                                            docCategory="Educational"
                                            subDocCategory="Skills"
                                            docPrefix="Skills"
                                            onFileChange={handleFileChange}
                                            existingDocs={existingFiles.skills || []}
                                            onDeleteDoc={(docId) => handleDelete(docId)}
                                        />
                                    </div>
                                    <div className="btndocuplods">
                                        <button onClick={() => setCurrentStep(s => s + 1)} className="docnextbtns sitebtn">Next</button>
                                        <button onClick={() => setCurrentStep(s => s - 1)} className="docbackbtns sitebtn">Back</button>
                                    </div>
                                </div>

                                {/* ── Step 3: Experience ── */}
                                <div className={`animate__animated animate__fadeIn animate__slower docuplods row ${currentStep === 3 ? "active" : ""}`}>
                                    <div className="col-sm-12">
                                        <MultiDropRow
                                            label="1. Experience Letter / Relieving Letter"
                                            docCategory="Experience"
                                            subDocCategory="Letter"
                                            docPrefix="Experience Letter"
                                            onFileChange={handleFileChange}
                                            existingDocs={existingFiles.experience?.filter(d => d.doc_name && d.doc_name.includes("Experience Letter")) || []}
                                            onDeleteDoc={(docId) => handleDelete(docId)}
                                        />
                                        <MultiDropRow
                                            label="2. Bank Statement (Last 3 months)"
                                            docCategory="Experience"
                                            subDocCategory="Letter"
                                            docPrefix="Bank Statement"
                                            onFileChange={handleFileChange}
                                            existingDocs={existingFiles.experience?.filter(d => d.doc_name && d.doc_name.includes("Bank Statement")) || []}
                                            onDeleteDoc={(docId) => handleDelete(docId)}
                                        />
                                        <MultiDropRow
                                            label="3. Cancel Cheque / Passbook Photo"
                                            docCategory="Experience"
                                            subDocCategory="Letter"
                                            docPrefix="Bank Details"
                                            onFileChange={handleFileChange}
                                            existingDocs={existingFiles.experience?.filter(d => d.doc_name && d.doc_name.includes("Bank Details")) || []}
                                            onDeleteDoc={(docId) => handleDelete(docId)}
                                        />
                                        <MultiDropRow
                                            label="4. Salary Slip"
                                            docCategory="Experience"
                                            subDocCategory="Letter"
                                            docPrefix="Salary Slip"
                                            onFileChange={handleFileChange}
                                            existingDocs={existingFiles.experience?.filter(d => d.doc_name && d.doc_name.includes("Salary Slip")) || []}
                                            onDeleteDoc={(docId) => handleDelete(docId)}
                                        />
                                    </div>
                                    <div className="btndocuplods">
                                        <button onClick={submitDocumentStatus} className="docnextbtns sitebtn">Final Submit</button>
                                        <button onClick={() => setCurrentStep(s => s - 1)} className="docbackbtns sitebtn">Back</button>
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