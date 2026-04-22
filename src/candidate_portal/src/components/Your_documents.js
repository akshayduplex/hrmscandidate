import React, { useState, useEffect } from "react";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Table from 'react-bootstrap/Table';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import UploadModal from "./Reupload"; // Assuming UploadModal is properly imported
import ViewdocModal from "./View_document"; // Assuming ViewdocModal is properly imported
import { getCandidateById } from "../helper/Api_Helper";
import { getCandidateId } from "../helper/My_Helper";
import { clearSessionData } from "../helper/My_Helper";
import { useNavigate } from "react-router-dom";
const Your_document = () => {
    const [modalShow, setModalShow] = useState(false);
    const [viewmodalShow, setViewModalShow] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null); // State for selected document
    const [uploadsDocument, setUploadsDocument] = useState(null); // State for selected document
    const [kycDocs, setKycDocs] = useState([]);
    const [educationalDocs, setEducationalDocs] = useState([]);
    const [experienceDocs, setExperienceDocs] = useState([]);
    const [rejectDocReason, setrejectDocReason] = useState(null);
    // Function to fetch candidate data
    const fetchCandidateData = async () => {
        try {
            const response = await getCandidateById({ _id: getCandidateId(), scope_fields: ["reject_doc_reason", "docs"] });
            const data = response.data.docs;
            setrejectDocReason(response.data.reject_doc_reason)
            const kycDefaults = [
                { doc_name: "Aadhar Front", mime_type: "N/A", file_size: "N/A", add_date: null, file_name: "", doc_category: "KYC", sub_doc_category: 'Document', status: "" },
                { doc_name: "Aadhar Back", mime_type: "N/A", file_size: "N/A", add_date: null, file_name: "", doc_category: "KYC", sub_doc_category: 'Document', status: "" },
                { doc_name: "Pancard", mime_type: "N/A", file_size: "N/A", add_date: null, file_name: "", doc_category: "KYC", sub_doc_category: 'Document', status: "" },
                { doc_name: "Photo", mime_type: "N/A", file_size: "N/A", add_date: null, file_name: "", doc_category: "KYC", sub_doc_category: 'Document', status: "" },
            ];

            const marksheetDefaults = [
                { doc_name: "10th Marksheet", mime_type: "N/A", file_size: "N/A", add_date: null, file_name: "", doc_category: "Educational", sub_doc_category: 'Marksheet', status: "" },
                { doc_name: "12th Marksheet", mime_type: "N/A", file_size: "N/A", add_date: null, file_name: "", doc_category: "Educational", sub_doc_category: 'Marksheet', status: "" },
                { doc_name: "Graduation Marksheet", mime_type: "N/A", file_size: "N/A", add_date: null, file_name: "", doc_category: "Educational", sub_doc_category: 'Marksheet', status: "" },
                { doc_name: "Post Graduation Marksheet", mime_type: "N/A", file_size: "N/A", add_date: null, file_name: "", doc_category: "Educational", sub_doc_category: 'Marksheet', status: "" },
            ];

            const experienceDefaults = [
                { doc_name: "Experience Letter", mime_type: "N/A", file_size: "N/A", add_date: null, file_name: "", doc_category: "Experience", sub_doc_category: 'Letter', status: "" },
                { doc_name: "Bank Statement", mime_type: "N/A", file_size: "N/A", add_date: null, file_name: "", doc_category: "Experience", sub_doc_category: 'Letter', status: "" },
                { doc_name: "Bank Details", mime_type: "N/A", file_size: "N/A", add_date: null, file_name: "", doc_category: "Experience", sub_doc_category: 'Letter', status: "" },
                { doc_name: "Salary Slip", mime_type: "N/A", file_size: "N/A", add_date: null, file_name: "", doc_category: "Experience", sub_doc_category: 'Letter', status: "" },
            ];

            const kyc = kycDefaults.map(defaultDoc => {
                const doc = data.find(doc => doc.doc_name === defaultDoc.doc_name && doc.doc_category === "KYC");
                return doc || defaultDoc;
            });

            const marksheet = marksheetDefaults.map(defaultDoc => {
                const doc = data.find(doc => doc.doc_name === defaultDoc.doc_name && doc.doc_category === "Educational" && doc.sub_doc_category === "Marksheet");
                return doc || defaultDoc;
            });

            const skills = data.filter(doc => doc.doc_category === "Educational" && doc.sub_doc_category === "Skills");

            const educational = [...marksheet, ...skills];

            // const experience = experienceDefaults.map(defaultDoc => {
            //     const doc = data.find(doc => doc.doc_category === "Experience");
            //     return doc || defaultDoc;
            // });

            // Step 1: Map defaults → If matching documents exist, replace them
            const mappedRequiredDocs = experienceDefaults.map(defaultDoc => {
                const found = data.find(
                    d =>
                        d.doc_category === "Experience" &&
                        d.doc_name === defaultDoc.doc_name
                );

                return found || defaultDoc;
            });

            // Step 2: Get ALL additional Experience documents
            const extraDocs = data.filter(d => {
                return (
                    d.doc_category === "Experience" &&
                    !experienceDefaults.some(def => def.doc_name === d.doc_name)
                );
            });

            // Step 3: Merge results
            const experience = [...mappedRequiredDocs, ...extraDocs];


            // console.log(experience, data, 'this is expiriance letter and others')

            // console.log(experienceDefaults, 'this is expiriance letter and others')

            setKycDocs(kyc);
            setEducationalDocs(educational);
            setExperienceDocs(experience);

        } catch (error) {
            //  console.error('Error fetching candidate data', error);
        }
    };

    useEffect(() => {
        fetchCandidateData();
    }, []);

    const handleViewDocument = (doc) => {
        setSelectedDocument(doc);
        setViewModalShow(true);
    };

    const uploadDocument = (doc) => {
        setUploadsDocument(doc);
        setModalShow(true);
    };

    // Function to handle successful upload
    const handleUploadSuccess = async (uploadedDoc) => {
        try {
            console.log(uploadedDoc, 'this is Document');
            // Fetch updated candidate data
            await fetchCandidateData();

            // Hide the modal after successful upload
            setModalShow(false);
        } catch (error) {
            //  console.error('Error refreshing document data after upload', error);
        }
    };

    const renderTableRows = (docs) => {
        return docs?.map(doc => (
            <tr key={doc._id || doc.doc_name}>
                <td><span>{doc.mime_type.toUpperCase()}</span></td>
                <td><span>{doc.doc_name}</span></td>
                <td><span>{doc.file_size}</span></td>
                <td><span>{doc.add_date ? new Date(doc.add_date).toLocaleDateString() : "N/A"}</span></td>
                <td>
                    <div className="d-flex table_actionbtns">
                        {doc.status === 'reject' ? (
                            <span
                                className="correct reupload rejected"
                                onClick={() => uploadDocument(doc)}
                            >
                                <FileUploadOutlinedIcon />
                            </span>
                        ) : doc.file_name ? (
                            <span className="correct"><CheckOutlinedIcon /></span>
                        ) : (
                            <span
                                className="correct reupload"
                                onClick={() => uploadDocument(doc)}
                            >
                                <FileUploadOutlinedIcon />
                            </span>
                        )}
                        {doc.file_name && (
                            <button className="viewfile" onClick={() => handleViewDocument(doc)}>
                                <RemoveRedEyeOutlinedIcon />
                            </button>
                        )}
                    </div>
                </td>
            </tr>
        ));
    };
    const navigate = useNavigate();

    const handleLogout = () => {
        clearSessionData();
        navigate('/');
    };
    return (
        <>
            <div className="maincontent">
                <div className="contentwrap">
                    <div className="contentbox">
                        <div className="contenthdr">
                            <h4>Your Documents</h4>
                        </div>
                        <div className="contents ur_docwraps px-4">
                            <Tabs defaultActiveKey="kyc" id="justify-tab-example" className="mb-3 alldoctabs">
                                <Tab eventKey="kyc" title="KYC Documents">
                                    <div className="filewrp animate__animated animate__fadeIn animate__slower">
                                        <div className="tab_hdng">
                                            <h5>Files</h5>
                                        </div>
                                        <Table>
                                            <thead>
                                                <tr>
                                                    <th>Type</th>
                                                    <th>Name</th>
                                                    <th>Size</th>
                                                    <th>Date</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {renderTableRows(kycDocs)}
                                            </tbody>
                                        </Table>
                                    </div>
                                </Tab>
                                <Tab eventKey="educational" title="Educational Documents">
                                    <div className="filewrp animate__animated animate__fadeIn animate__slower">
                                        <div className="tab_hdng">
                                            <h5>Files</h5>
                                        </div>
                                        <Table>
                                            <thead>
                                                <tr>
                                                    <th>Type</th>
                                                    <th>Name</th>
                                                    <th>Size</th>
                                                    <th>Date</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {renderTableRows(educationalDocs)}
                                            </tbody>
                                        </Table>
                                    </div>
                                </Tab>
                                <Tab eventKey="experience" title="Experience Documents">
                                    <div className="filewrp animate__animated animate__fadeIn animate__slower">
                                        <div className="tab_hdng">
                                            <h5>Files</h5>
                                        </div>
                                        <Table>
                                            <thead>
                                                <tr>
                                                    <th>Type</th>
                                                    <th>Name</th>
                                                    <th>Size</th>
                                                    <th>Date</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {renderTableRows(experienceDocs)}
                                            </tbody>
                                        </Table>
                                    </div>
                                </Tab>
                            </Tabs>
                            {rejectDocReason && (
                                <div className="text-center mb-5" style={{ color: 'red' }}>
                                    {rejectDocReason}.*
                                </div>
                            )}
                        </div>
                        <div className="text-center mb-5">
                            <button type="button" onClick={handleLogout} className="sitebtn mt-4 btnblue btn btn-primary"> Sign Out </button>
                        </div>
                    </div>
                </div>
            </div>
            <UploadModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                document={uploadsDocument}
                handleUploadSuccess={handleUploadSuccess}
            />
            <ViewdocModal
                show={viewmodalShow}
                onHide={() => setViewModalShow(false)}
                document={selectedDocument}
            />
        </>
    );
}

export default Your_document;
