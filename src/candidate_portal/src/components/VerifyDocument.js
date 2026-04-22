import React, { useRef, useState, useCallback, useEffect } from "react";
import { Row } from "react-bootstrap";
import { FaEye, FaUpload, FaDownload } from "react-icons/fa";
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from "axios";
import config from "../config/Config";
import { apiHeaderToken, apiHeaderTokenMultiPart } from "../helper/My_Helper";
import moment from "moment/moment";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Paper, Step, StepLabel, Stepper, Tab, Tabs, Tooltip, Typography } from "@mui/material";
import { getCandidateById } from "../helper/Api_Helper";
import JoiningReportForm from "./JoiningReportForm";
import DatePicker from "react-datepicker";
import { useSelector } from "react-redux";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import JoiningReportFormView from "./AnnuxureElevenJoiningFormView";
import DeclarationForm from "./DeclarationForm";
import { useLocation } from 'react-router-dom';
const actionButtons = [
    { icon: <FaEye />, label: 'View', onClickKey: 'onView', color: '#1E88E5' },
    { icon: <FaDownload />, label: 'Download', onClickKey: 'onDownload', color: '#1E88E5' },
    { icon: <FaUpload />, label: 'Upload', onClickKey: 'onUpload', color: '#43A047' },
];

const DocumentTabs = ({ documents, handlers, candidateData, eventKeySteps, referenceCandidate ,initialTabValue = 0,onTabChange}) => {
    // const [value, setValue] = useState(0);
    const webSetting = useSelector(state => state.jobs.webSettingData);
    const [value, setValue] = useState(initialTabValue);
    const [formData, setFormData] = useState({
        inductiveJoiningDate: '',
        loading: ''
    })

    const jsonData = sessionStorage.getItem('loginData');
    const dataObject = jsonData ? JSON.parse(jsonData) : null;
console.log("candiate data", candidateData)
    useEffect(() => {
        setValue(initialTabValue);
    }, [initialTabValue]);

    const MakeFinalUploadsJoiningKits = async () => {

        setFormData((prev) => (
            {
                ...prev,
                loading: true
            }
        ))

        try {

            const response = await axios.post(
                `${config.API_URL}updateOnboardStatusOfApprovalTimeLine`,
                {
                    candidate_id: dataObject?._id,
                    // applied_job_id: candidateData?.applied_jobs?.find((item) => item?.job_id === candidateData?.job_id)?._id,
                    approval_note_id: candidateData?.applied_jobs?.find((item) => item?.job_id === candidateData?.job_id)?.approval_note_data?.doc_id,
                    form_step: 'Joining Kit',
                    add_by_name: dataObject?.name,
                    add_by_mobile: dataObject?.mobile_no,
                    add_by_designation: dataObject?.designation,
                    add_by_email: dataObject?.email
                },
                apiHeaderToken()
            );

            if (response.status === 200) {
                toast.success(response.data.message);
                // GetCandidateUploadsDocument();

                // const lastStepKey = steps.length > 0 ? steps[steps.length - 1].eventKey.toLowerCase() : '';
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || error?.message || "Something went wrong");
        } finally {
            setFormData((prev) => (
                {
                    ...prev,
                    loading: false
                }
            ))
        }
    }

    const handleStateChange = (obj) => {
        setFormData((prev) => ({
            ...prev,
            ...obj
        }));
    };
    const handleChange = (event, newValue) => {
        setValue(newValue);
        onTabChange?.(newValue);   // optional — if parent wants to know
    };
    const handleApprovedOrReject = async (status) => {
        try {

            if (!formData?.inductiveJoiningDate) {
                return toast.warn("Please Select the Tentative Date")
            }

            let payloads = {
                candidate_id: candidateData._id,
                applied_job_id: candidateData?.applied_jobs?.find(item => item?.job_id === candidateData?.job_id)?._id,
                action: status,
                tentative_date: formData?.inductiveJoiningDate
            }

            setFormData((pre) => (
                {
                    ...pre,
                    loading: status
                }
            ))

            let response = await axios.post(`${config.API_URL}acceptRejectOffer`, payloads, apiHeaderToken())

            if (response.status === 200) {
                toast.success(response.data?.message)
                referenceCandidate(candidateData._id)
            } else {
                toast.error(response.data?.message)
            }

        } catch (error) {
            toast.error(error?.response.data?.message || error?.message || "something went wrong")
        } finally {
            setFormData((pre) => (
                {
                    ...pre,
                    loading: ''
                }
            ))
        }
    }

    if (eventKeySteps === 'offerLetter') {
        const appliedJob = candidateData?.applied_jobs?.find(item => item?.job_id === candidateData?.job_id);
        const offerStatus = appliedJob?.offer_status;

        if (offerStatus === 'Accepted') {
            return (
                <Box
                    sx={{
                        display: 'flex',
                        gap: 3,
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        mt: 3,
                    }}
                >
                    <div className="acceptcase" style={{ textAlign: 'center' }}>
                        <img src={config.IMAGE_PATH + webSetting?.data?.logo_image} alt="Accepted" />
                        <p style={{ fontSize: "22px", fontWeight: 500, marginBottom: "20px", marginTop: 10 }}>
                            Thank you for accepting the offer. Welcome to {webSetting?.data?.organization_name || "HLFPPT"}!
                        </p>
                        <p style={{ fontSize: "19px", fontWeight: 400 }}>
                            You can expect the Joining Kit from us shortly.
                        </p>
                    </div>
                </Box>
            );
        }

        if (offerStatus === 'Rejected') {
            return (
                <Box
                    sx={{
                        display: 'flex',
                        gap: 3,
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        mt: 3,
                    }}
                >
                    <div className="rejectcase" style={{ textAlign: 'center' }}>
                        <img src={config.IMAGE_PATH + webSetting?.data?.logo_image} alt="Rejected" />
                        <p style={{ fontSize: "22px", fontWeight: 500, marginBottom: "20px", marginTop: 10 }}>
                            Thank you for letting us know your decision.
                        </p>
                        <p style={{ fontSize: "19px", fontWeight: 400 }}>
                            We appreciate your interest in {webSetting?.data?.organization_name || "HLFPPT"} and wish you the best in your future endeavors.
                        </p>
                    </div>
                </Box>
            );
        }

        return (
            <Box sx={{ display: 'grid', width: '100%', height: '100%' }}>
                <Row className="text-center w-100 mt-3">
                    <div className="col-sm-4 manpwr_data_colm">
                        <h6>Name</h6>
                        <p>{candidateData?.name}</p>
                    </div>
                    <div className="col-sm-4 manpwr_data_colm">
                        <h6>Date Of Joining</h6>
                        <p>{appliedJob?.onboard_date ? moment(appliedJob.onboard_date).format('DD/MM/YYYY') : ''}</p>
                    </div>
                    <div className="col-sm-4 manpwr_data_colm">
                        <h6>Designation</h6>
                        <p>{candidateData?.designation}</p>
                    </div>
                    <div className="col-sm-4 manpwr_data_colm">
                        <h6>Offered CTC</h6>
                        <p>{appliedJob?.offer_ctc}</p>
                    </div>
                    <div className="col-sm-4 manpwr_data_colm">
                        <h6>Tentative Joining Date</h6>
                        <div className="position-relative">
                            <DatePicker
                                selected={formData.inductiveJoiningDate ? new Date(formData.inductiveJoiningDate) : null}
                                onChange={date =>
                                    handleStateChange({
                                        inductiveJoiningDate: moment(date).format('YYYY-MM-DD'),
                                    })
                                }
                                placeholderText="Select Date"
                                dateFormat="dd/MM/yyyy"
                                className="form-control"
                            />
                        </div>
                    </div>
                </Row>

                <Box
                    sx={{
                        display: 'flex',
                        gap: 3,
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        mt: 3,
                    }}
                >
                    <Button variant="contained" color="success" disabled={formData?.loading === 'accept'} onClick={() => handleApprovedOrReject("accept")}>
                        {formData?.loading === 'accept' ? "Loading...." : 'Accept'}
                    </Button>
                    <Button variant="contained" color="error" disabled={formData?.loading === 'reject'} onClick={() => handleApprovedOrReject("reject")}>
                        {formData?.loading === 'reject' ? "Loading...." : 'Reject'}
                    </Button>
                </Box>
            </Box>
        );
    }

    if (eventKeySteps === 'joiningkit') {

        const tabCount = documents?.length;
        const tabMinWidth = tabCount <= 5 ? `${100 / tabCount}%` : "20%";
        const htmlDocs = documents.filter(doc => doc.is_html === 'Yes');
        const pdfDocs = documents.filter(doc => doc.is_html === 'No');
        const htmlDocsWithStatus = [];
        if (htmlDocs?.length >= 1) {
            htmlDocsWithStatus.push({
                ...htmlDocs[0],
                completeStatus:
                    candidateData?.annexure_eleven_form_status === 'Complete'
            });
        }
        if (htmlDocs.length >= 2) {
            htmlDocsWithStatus.push({
                ...htmlDocs[1],
                completeStatus:
                    candidateData?.applied_jobs
                        ?.find(item => item.job_id === candidateData?.job_id)
                        ?.declaration_form_status === 'agree'
            });
        }
        htmlDocsWithStatus.push(...pdfDocs);

        return (
            <Box sx={{ width: '100%', height: '100%' }}>

                <Tabs
                value={value}
                onChange={handleChange}
                    orientation="horizontal"
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        "& .MuiTabs-indicator": {
                            backgroundColor: "#34209b",
                        },
                    }}
                >

                    {htmlDocsWithStatus?.map((doc) => (
                        <Tab
                            key={doc._id}
                            label={
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    {((doc.uploaded_file_data?.added_by_data?.name === 'Candidate') || (doc?.is_html === 'Yes' && doc?.completeStatus)) && (
                                        <CheckCircleIcon
                                            sx={{ color: "green", fontSize: 20, mr: 0.5 }}
                                        />
                                    )}
                                    <Typography
                                        sx={{
                                            textAlign: "center",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            px: 1,
                                        }}
                                    >
                                        {doc.doc_name}
                                    </Typography>
                                </Box>
                            }
                            sx={{
                                minWidth: tabMinWidth,
                                "&.Mui-selected": {
                                    color: "#34209b !important",
                                },
                            }}
                        />
                    ))}
                </Tabs>

                {/* Tab Content */}
                <Box sx={{ flexGrow: 1, p: 2, overflow: 'auto' }}>
                    {htmlDocsWithStatus.map((doc, index) => {
                        // Determine this doc's position among HTML docs
                        const htmlIndex = htmlDocs.findIndex(d => d._id === doc._id);
                        return (
                            <div
                                key={doc._id}
                                role="tabpanel"
                                hidden={value !== index}
                                style={{ width: '100%' }}
                            >
                                {value === index && (
                                    <Box
                                        sx={{
                                            p: 3,
                                            // border: '1px solid #e0e0e0',
                                            // borderRadius: 2,
                                            // boxShadow: 3,
                                            backgroundColor: 'background.paper',
                                            width: '100%',
                                            maxWidth: '1200px',
                                            mx: 'auto',
                                            my: 2,
                                        }}
                                    >
                                        {/* Header Section */}
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                mb: 3,
                                                pb: 2,
                                                // borderBottom: '1px solid #f5f5f5',
                                            }}
                                        >
                                            {/* Document Details */}
                                            <Box sx={{ mb: { xs: 2, sm: 0 } }}>
                                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                                    Document Details
                                                </Typography>
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                                    <Chip
                                                        label={
                                                            <Typography variant="body1">
                                                                <Box component="span" sx={{ fontWeight: 500 }}>
                                                                    Uploaded By:
                                                                </Box>{' '}
                                                                {doc.uploaded_file_data?.added_by_data?.name ||
                                                                    doc.send_file_data?.added_by_data?.name ||
                                                                    'N/A'}
                                                            </Typography>
                                                        }
                                                        variant="outlined"
                                                    />
                                                    <Chip
                                                        label={
                                                            <Typography variant="body1">
                                                                <Box component="span" sx={{ fontWeight: 500 }}>
                                                                    Added Date:
                                                                </Box>{' '}
                                                                {moment(doc.send_file_data?.add_date).format('DD/MM/YYYY')}
                                                            </Typography>
                                                        }
                                                        variant="outlined"
                                                    />
                                                </Box>
                                            </Box>

                                            {/* Action Buttons for non-HTML docs */}
                                            {htmlIndex === -1 && (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                    {actionButtons.map(btn => (
                                                        <Tooltip
                                                            key={btn.label}
                                                            title={btn.label}
                                                            componentsProps={{
                                                                tooltip: {
                                                                    sx: {
                                                                        backgroundColor: btn.color,
                                                                        color: 'white',
                                                                        fontSize: '0.8rem',
                                                                    },
                                                                },
                                                            }}
                                                        >
                                                            <IconButton
                                                                onClick={() => handlers[btn.onClickKey](doc)}
                                                                sx={{
                                                                    backgroundColor: `${btn.color}10`,
                                                                    color: btn.color,
                                                                    border: `1px solid ${btn.color}30`,
                                                                    '&:hover': {
                                                                        backgroundColor: `${btn.color}20`,
                                                                    },
                                                                }}
                                                            >
                                                                {btn.icon}
                                                            </IconButton>
                                                        </Tooltip>
                                                    ))}
                                                </Box>
                                            )}
                                        </Box>

                                        {/* Render based on HTML-doc order */}
                                        {htmlIndex >= 0 ? (
                                            htmlIndex === 0 ? (
                                                // First HTML doc: view or edit form
                                                candidateData && candidateData?.annexure_eleven_form_status === 'Complete' ? (
                                                    <Box sx={{ mt: 4, p: 3, border: '1px solid #eee', backgroundColor: '#fafafa' }}>
                                                        <JoiningReportFormView candidateData={candidateData} />
                                                    </Box>
                                                ) : (
                                                    <Box sx={{ mt: 4, p: 3, border: '1px solid #eee', backgroundColor: '#fafafa' }}>
                                                        <JoiningReportForm candidateData={candidateData} referenceCandidate={referenceCandidate} />
                                                    </Box>
                                                )
                                            ) : htmlIndex === 1 ? (
                                                // Second HTML doc: Declaration form
                                                <Box sx={{ mt: 4, p: 3, border: '1px solid #eee', backgroundColor: '#fafafa' }}>
                                                    <DeclarationForm candidateData={candidateData} referenceCandidate={referenceCandidate} />
                                                    {/* <Typography sx={{ mt: 2, color: 'text.secondary' }}>
                                                        This is Declaration Form Open here.
                                                    </Typography> */}
                                                </Box>
                                            ) : (
                                                // Any further HTML docs
                                                <Typography sx={{ mt: 2, color: 'text.secondary' }}>
                                                    Inline editing not supported for this document.
                                                </Typography>
                                            )
                                        ) : null}
                                    </Box>
                                )}
                            </div>
                        );
                    })}

                    {
                        htmlDocsWithStatus?.every((item) =>
                            (item.is_html === 'Yes' && item?.completeStatus === true) ||
                            (item.is_html === 'No' && item?.status === 'complete')
                        ) && (
                            <div className="d-flex justify-content-center align-items-center">
                                <Button
                                    className="text-center"
                                    variant="contained"
                                    color="success"
                                    onClick={MakeFinalUploadsJoiningKits}
                                    disabled={formData.loading}
                                >
                                    {formData.loading ? "Loading..." : "Make the Final Submit"}
                                </Button>
                            </div>
                        )
                    }





                </Box>

            </Box>
        );
    }

    if (eventKeySteps === 'appointmentletter') {
        return (
            <Box sx={{ width: '100%', height: '100%' }}>
                <Typography sx={{ textAlign: 'center' }}>No Preview available</Typography>
            </Box>
        )
    }
};


const VerifiedDocument = () => {
    // const [key, setKey] = useState('offerLetter');
    const [documents, setDocuments] = useState(null);

    const uploadInputRef = useRef(null);
    const [pendingUploadDoc, setPendingUploadDoc] = useState(null);

    const jsonData = sessionStorage.getItem('loginData');
    const dataObject = jsonData ? JSON.parse(jsonData) : null;
    const [candidateData, setCandidateData] = useState(null);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const selectedDocName = queryParams.get('doc_name');   // e.g. "SB_FORMAT"
    const GetCandidateUploadsDocument = useCallback(async () => {
        try {

            const response = await axios.post(
                `${config.API_URL}getOnboardDocuments`,
                { candidate_id: dataObject?._id },
                apiHeaderToken()
            );

            if (response.status === 200) {
                setDocuments(response.data?.data);
            } else {
                setDocuments(null);
            }
        } catch (error) {
            console.error(error);
            setDocuments(null);
        }
    }, [dataObject?._id]);
    // ────────────────────────────────────────────────
    // New logic: compute initial tab index based on doc_name
    // ────────────────────────────────────────────────
    const getInitialTabValue = () => {
        if (!documents || !selectedDocName) return 0;

        // For joiningkit stage — most likely what you want
        if (documents.onboarding_docs_stage === 'joiningkit' || documents.onboarding_docs_stage === 'complete') {
            const allDocs = documents.onboarding_docs?.filter(
                item => item?.doc_category === 'Joining Kit'
            ) || [];

            // We use the same filtered + ordered list as in DocumentTabs
            const htmlDocs = allDocs.filter(doc => doc.is_html === 'Yes');
            const pdfDocs = allDocs.filter(doc => doc.is_html === 'No');

            let orderedDocs = [];
            if (htmlDocs.length >= 1) orderedDocs.push(htmlDocs[0]);
            if (htmlDocs.length >= 2) orderedDocs.push(htmlDocs[1]);
            orderedDocs.push(...pdfDocs);

            const targetIndex = orderedDocs.findIndex(
                doc => doc.doc_name?.trim().toUpperCase() === selectedDocName.trim().toUpperCase()
            );

            if (targetIndex !== -1) {
                return targetIndex;
            }
        }

        // Fallback — first tab
        return 0;
    };

    // Use it only when documents are loaded
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (documents) {
            const initial = getInitialTabValue();
            setValue(initial);
        }
    }, [documents, selectedDocName]);


    const GetCandidateRecordsBaseOnEvent = async (id = '') => {
        const response = await getCandidateById({ _id: id, scope_fields: [] });
        setCandidateData(response.data ?? {});
    }

    useEffect(() => {
        if (dataObject?._id) {
            GetCandidateRecordsBaseOnEvent(dataObject?._id)
        }
    }, [dataObject?._id])

    const handleFilesSelected = async (files, doc) => {
        if (!files || !files.length) return;
        const formData = new FormData();
        Array.from(files).forEach((file, idx) => {
            formData.append(`attachments[${idx}][doc_name]`, file?.name);
            formData.append(`attachments[${idx}][file_name]`, file);
        });

        formData.append('onboard_doc_id', doc._id);
        formData.append('approval_note_id', doc?.approval_note_doc_id);
        formData.append('candidate_id', dataObject?._id);
        formData.append("add_by_name", "Candidate")
        formData.append("add_by_mobile", "")
        formData.append("add_by_designation", '')
        formData.append("add_by_email", '')

        // https://hrmsapis.dtsmis.in/v1/admin/uploadOnboardingDocuments

        try {
            let response = await axios.post(
                `${config.API_URL}uploadOnboardingDocuments`,
                formData,
                apiHeaderTokenMultiPart()
            );

            if (response.status === 200) {
                toast.success(response?.data?.message);
                GetCandidateUploadsDocument();
            } else {
                toast.error(response?.data?.message);
            }
        } catch (err) {
            console.error('Upload failed:', err);
            toast.error(err?.response?.data?.message || err?.message || "Something went wrong");
        }
    };

    const handlers = {
        onView: doc => {
            const fileUrl = doc?.uploaded_file_data?.file_name ? config.IMAGE_PATH + doc?.uploaded_file_data?.file_name : config.IMAGE_PATH + doc?.send_file_data?.file_name;
            window.open(fileUrl, '_blank', 'noopener,noreferrer');
        },
        onDownload: async doc => {
            const fileUrl = doc?.uploaded_file_data?.file_name ? config.IMAGE_PATH + doc?.uploaded_file_data?.file_name : config.IMAGE_PATH + doc?.send_file_data?.file_name;;
            const fileName = doc?.uploaded_file_data?.file_name ? config.IMAGE_PATH + doc?.uploaded_file_data?.file_name : config.IMAGE_PATH + doc?.send_file_data?.file_name || 'download';
            try {
                const response = await fetch(fileUrl, { mode: 'cors' });
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } catch (err) {
                console.error('Download failed:', err);
                toast.error('Download failed.');
            }
        },
        onUpload: doc => {
            setPendingUploadDoc(doc);
            uploadInputRef.current?.click();
        }
    };

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
        GetCandidateUploadsDocument();
    }, [GetCandidateUploadsDocument]);

    const steps = [
        documents?.onboarding_docs_stage === 'offerletter' && {
            eventKey: 'offerLetter',
            title: 'Offer Letter',
            docs: documents?.onboarding_docs?.filter(item => item?.doc_category === 'Offer Letter') || [],
            editMode: documents?.onboarding_docs_stage === 'offerletter'
        },
        documents?.onboarding_docs_stage === 'joiningkit' &&
        {
            eventKey: 'joiningkit',
            title: 'Joining Kit',
            docs: documents?.onboarding_docs?.filter(item => item?.doc_category === 'Joining Kit') || [],
            editMode: documents?.onboarding_docs_stage === 'joiningkit'
        },
        documents?.onboarding_docs_stage === 'appointmentletter' &&
        {
            eventKey: 'appointmentLetter',
            title: 'Appointment Letter',
            docs: documents?.onboarding_docs?.filter(item => item?.doc_category === 'Appointment Letter') || [],
            editMode: documents?.onboarding_docs_stage === 'appointmentletter'
        },
    ]?.filter(step => step)

    const [activeStep, setActiveStep] = useState(0);
    const [previewMode, setPreviewMode] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);

    console.log(previewMode)
    console.log(documents)

    useEffect(() => {
        if (documents?.onboarding_docs_stage === 'offerletter') {
            setActiveStep(0);
        } else if (documents?.onboarding_docs_stage === 'joiningkit') {
            setActiveStep(1);
        } else if (documents?.onboarding_docs_stage === 'appointmentletter') {
            setActiveStep(2);
        } else if (documents?.onboarding_docs_stage === 'complete') {
            setPreviewMode(true);
        }
    }, [documents?.onboarding_docs_stage, steps.length])

    const updateOnboardingStage = async (stage) => {

        try {
            const response = await axios.post(
                `${config.API_URL}update_candidate_onboard_mail_steps`,
                { candidate_doc_id: dataObject?._id, applied_job_id: candidateData?.applied_jobs?.find((item) => item?.job_id === candidateData?.job_id)?._id, action: stage },
                apiHeaderToken()
            );

            if (response.status === 200) {
                toast.success(response.data.message);
                GetCandidateUploadsDocument();
                const lastStepKey = steps.length > 0 ? steps[steps.length - 1].eventKey.toLowerCase() : '';

                if (stage === lastStepKey) {
                    setPreviewMode(true);
                } else {
                    setActiveStep(step => Math.min(step + 1, steps.length - 1));
                }
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || error?.message || "Something went wrong");
        } finally {
            setOpenAlert(false);
        }
    }

    useEffect(() => {
        if (activeStep >= steps.length) {
            setActiveStep(steps.length > 0 ? steps.length - 1 : 0);
        }
    }, [activeStep, steps.length]);

    return (
        <>
            <div className="maincontent">
                <div className="container animate__animated animate__fadeIn animate__slower">

                    <div className="contentwrap" style={{
                        width: '100%'
                    }}>
                        <div className="contentbox" style={{
                            width: '100%'
                        }}>
                            <div className="contenthdr">
                                <h4>Onboard Documents</h4>
                            </div>
                            <Box>
                                <Stepper activeStep={activeStep} alternativeLabel>
                                    {steps.map((step, index) => (
                                        <Step key={index}>
                                            <StepLabel>{step.title}</StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>

                                <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
                                    {steps.length > 0 && steps[activeStep] ? (
                                        <DocumentTabs documents={steps[activeStep]?.docs} handlers={handlers} candidateData={candidateData} eventKeySteps={steps[activeStep]?.eventKey} referenceCandidate={GetCandidateRecordsBaseOnEvent} initialTabValue={value}
                                        onTabChange={setValue}/>
                                    ) : (
                                        <Typography textAlign={'center'}>No Action available.</Typography>
                                    )}
                                </Paper>
                            </Box>
                        </div>
                    </div>
                </div>

            </div>

            <ToastContainer
                position="top-right"
                autoClose={5000}
                theme="dark"
                limit={1}
            />


            {/* Hidden multiple-file input */}
            <input
                type="file"
                ref={uploadInputRef}
                style={{ display: 'none' }}
                onChange={e => {
                    handleFilesSelected(e.target.files, pendingUploadDoc);
                    e.target.value = null;
                }}
            />


            <Dialog
                open={openAlert}
                onClose={() => setOpenAlert(false)}
                aria-describedby="confirm-dialog-description"
                aria-labelledby="confirm-dialog-title"
            >
                <DialogTitle
                    id="confirm-dialog-title"
                    sx={{
                        color: theme => theme.palette.warning.main,
                    }}
                >
                    Alert
                </DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        Please verify that you have reviewed all documents for “{steps[activeStep]?.title}”.
                        <br /><br />
                        <strong>This action cannot be undone.</strong><br />
                        Are you sure you want to submit this step?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAlert(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={() => {
                        const stageMap = ['offerletter', 'joiningkit', 'appointmentletter'];
                        updateOnboardingStage(stageMap[activeStep]);
                    }} variant="contained" color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default VerifiedDocument;
