import React, { useState } from "react";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Table from 'react-bootstrap/Table';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import UploadModal from "./ReUpload";
import ViewDocModal from "./ViewDocument";

const YourDocument = () => {
    const [modalShow, setModalShow] = useState(false);
    const [viewmodalShow, setViewModalShow] = useState(false);

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
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td><span>JPG</span></td>
                                                    <td><span>Aadhar_front.jpg</span></td>
                                                    <td><span>17.2 kb</span></td>
                                                    <td><span>21/04/2024</span></td>
                                                    <td>
                                                        <div className="d-flex table_actionbtns">
                                                            <span className="correct"> <CheckOutlinedIcon /></span>
                                                            <button className="viewfile" onClick={() => setViewModalShow(true)}><RemoveRedEyeOutlinedIcon /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><span>JPG</span></td>
                                                    <td><span className="error">Aadhar_back.jpg</span></td>
                                                    <td><span>17.2 kb</span></td>
                                                    <td><span>21/04/2024</span></td>
                                                    <td>
                                                        <div className="d-flex table_actionbtns">
                                                            <span className="correct reupload" onClick={() => setModalShow(true)}> <FileUploadOutlinedIcon /></span>
                                                            <button className="viewfile" onClick={() => setViewModalShow(true)} ><RemoveRedEyeOutlinedIcon /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><span>JPG</span></td>
                                                    <td><span className="error">Pan.jpg</span></td>
                                                    <td><span>17.2 kb</span></td>
                                                    <td><span>21/04/2024</span></td>
                                                    <td>
                                                        <div className="d-flex table_actionbtns">
                                                            <span className="correct reupload" onClick={() => setModalShow(true)}> <FileUploadOutlinedIcon /></span>
                                                            <button className="viewfile" onClick={() => setViewModalShow(true)}><RemoveRedEyeOutlinedIcon /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><span>JPG</span></td>
                                                    <td><span>Passport_photo.jpg</span></td>
                                                    <td><span>17.2 kb</span></td>
                                                    <td><span>21/04/2024</span></td>
                                                    <td>
                                                        <div className="d-flex table_actionbtns">
                                                            <span className="correct"> <CheckOutlinedIcon /></span>
                                                            <button className="viewfile" onClick={() => setViewModalShow(true)}><RemoveRedEyeOutlinedIcon /></button>
                                                        </div>
                                                    </td>
                                                </tr>
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
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td><span>JPG</span></td>
                                                    <td><span>Aadhar_front.jpg</span></td>
                                                    <td><span>17.2 kb</span></td>
                                                    <td><span>21/04/2024</span></td>
                                                    <td>
                                                        <div className="d-flex table_actionbtns">
                                                            <span className="correct"> <CheckOutlinedIcon /></span>
                                                            <button className="viewfile" onClick={() => setViewModalShow(true)}><RemoveRedEyeOutlinedIcon /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><span>JPG</span></td>
                                                    <td><span className="error">Aadhar_back.jpg</span></td>
                                                    <td><span>17.2 kb</span></td>
                                                    <td><span>21/04/2024</span></td>
                                                    <td>
                                                        <div className="d-flex table_actionbtns">
                                                            <span className="correct reupload" onClick={() => setModalShow(true)}> <FileUploadOutlinedIcon /></span>
                                                            <button className="viewfile"><RemoveRedEyeOutlinedIcon /></button>
                                                        </div>
                                                    </td>
                                                </tr>
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
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                
                                                <tr>
                                                    <td><span>JPG</span></td>
                                                    <td><span className="error">Aadhar_back.jpg</span></td>
                                                    <td><span>17.2 kb</span></td>
                                                    <td><span>21/04/2024</span></td>
                                                    <td>
                                                        <div className="d-flex table_actionbtns">
                                                            <span className="correct reupload" onClick={() => setModalShow(true)}> <FileUploadOutlinedIcon /></span>
                                                            <button className="viewfile" onClick={() => setViewModalShow(true)}><RemoveRedEyeOutlinedIcon /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><span>JPG</span></td>
                                                    <td><span>Passport_photo.jpg</span></td>
                                                    <td><span>17.2 kb</span></td>
                                                    <td><span>21/04/2024</span></td>
                                                    <td>
                                                        <div className="d-flex table_actionbtns">
                                                            <span className="correct"> <CheckOutlinedIcon /></span>
                                                            <button className="viewfile" onClick={() => setViewModalShow(true)}><RemoveRedEyeOutlinedIcon /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </div>
                                </Tab>
                            </Tabs>
                        </div>
                        <div className="text-center mb-5">
                            <button type="button" class="sitebtn mt-4 btnblue btn btn-primary"> Sign Out </button>
                        </div>
                    </div>
                </div>
            </div>
            <UploadModal show={modalShow} onHide={() => setModalShow(false)} />
            <ViewDocModal show={viewmodalShow} onHide={() => setViewModalShow(false)} />

        </>
    )
}


export default YourDocument;