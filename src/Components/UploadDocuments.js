import React, { useState, useEffect } from "react";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import SkillDocs from "./SkillsDocs";
import { Link } from 'react-router-dom';
import AOS from 'aos';

const UploadDocument = () => {

    const [currentStep, setCurrentStep] = useState(0);

    const handleNextStep = () => {
        setCurrentStep((prevStep) => prevStep + 1);
    };

    const handlePrevStep = () => {
        setCurrentStep((prevStep) => prevStep - 1);
    };
    useEffect(() => {
        AOS.init({
            // Global settings
            duration: 800, // animation duration
            once: true, // whether animation should happen only once - while scrolling down
        });
    }, []);


    return (
        <>
            <div className="maincontent">

                <div className="contentwrap">
                    <div className="contentbox">
                        <div className="contenthdr">
                            <h4>Upload Documents</h4>
                        </div>
                        <div className="contents">
                            <div class="doc_steps" data-aos="fade-in" data-aos-duration="3000">
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
                                                <input type="file" className="cstmfile" />
                                                <span className="filenames">10th Marksheet.jpg</span>
                                            </div>

                                        </div>
                                        <div className="uplaodrow">
                                            <label>2. Aadhar Back</label>
                                            <div className="customfile_upload">
                                                <input type="file" className="cstmfile" />
                                                <span className="filenames">10th Marksheet.jpg</span>
                                            </div>
                                        </div>
                                        <div className="uplaodrow">
                                            <label>3. Upload Pancard</label>
                                            <div className="customfile_upload">
                                                <input type="file" className="cstmfile" />
                                                <span className="filenames">10th Marksheet.jpg</span>
                                            </div>

                                        </div>
                                        <div className="uplaodrow">
                                            <label>4. Upload Passport Size Photo</label>
                                            <div className="customfile_upload">
                                                <input type="file" className="cstmfile" />
                                                <span className="filenames">10th Marksheet.jpg</span>
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
                                                            <input type="file" className="cstmfile" />
                                                            <span className="filenames">10th Marksheet.jpg</span>
                                                        </div>
                                                    </div>
                                                    <div className="uplaodrow">
                                                        <label>2. 12th Marksheet</label>
                                                        <div className="customfile_upload">
                                                            <input type="file" className="cstmfile" />
                                                            <span className="filenames">10th Marksheet.jpg</span>
                                                        </div>
                                                    </div>
                                                    <div className="uplaodrow">
                                                        <label>3. Graduation Certificate</label>
                                                        <div className="customfile_upload">
                                                            <input type="file" className="cstmfile" />
                                                            <span className="filenames">10th Marksheet.jpg</span>
                                                        </div>
                                                    </div>
                                                    <div className="uplaodrow">
                                                        <label>4. Post Graduation Certificate</label>
                                                        <div className="customfile_upload">
                                                            <input type="file" className="cstmfile" />
                                                            <span className="filenames">10th Marksheet.jpg</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Tab>
                                            <Tab eventKey="skills" title="Skills">
                                                <div className="col-sm-12">
                                                    <div className="uplaodrow">
                                                        <label>Upload Certificate(s)</label>
                                                        <SkillDocs />
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
                                            <div className="customfile_upload">
                                                <input type="file" className="cstmfile" />
                                                <span className="filenames">Experience.jpg</span>
                                            </div>

                                        </div>
                                        <div className="uplaodrow">
                                            <label>2. Relieving Letter</label>
                                            <div className="customfile_upload">
                                                <input type="file" className="cstmfile" />
                                                <span className="filenames">Relieving Letter.jpg</span>
                                            </div>
                                        </div>
                                        <div className="uplaodrow">
                                            <label>3. Salary Slip</label>
                                            <div className="customfile_upload">
                                                <input type="file" className="cstmfile" />
                                                <span className="filenames">Salary Slip.jpg</span>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="mt-5 btndocuplods">
                                        <Link to="/your-document">
                                            <button className="docnextbtns sitebtn">Submit</button>
                                        </Link>
                                        <button onClick={handlePrevStep} className="docprevbtns sitebtn">Previous</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}


export default UploadDocument;
