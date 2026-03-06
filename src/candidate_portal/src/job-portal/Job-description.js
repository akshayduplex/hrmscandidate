import React from 'react';
import { FiCalendar } from "react-icons/fi";
import { GiSandsOfTime } from "react-icons/gi";
import { IoShareSocialOutline } from "react-icons/io5";
import { MdOutlineCurrencyRupee } from "react-icons/md";

const Job_description = () => {
    return (
        <>
            <div className="detailsbox">
                <div className="dtlheadr">
                    <div className="job_postn">
                        <span className="work_loc">Onsite</span>
                        <h3>Junior Engineer </h3>
                        <span>Delhi, IN</span>
                    </div>
                    <div className="job_summry">
                        <div className="jbsum">
                            <span>Job Type</span>
                            <p><FiCalendar /> Full Time</p>
                        </div>
                        <div className="jbsum">
                            <span>Salary Range</span>
                            <p><MdOutlineCurrencyRupee /> 2 lpa - 5 lpa</p>
                        </div>
                        <div className="jbsum">
                            <span>Deadline</span>
                            <p><GiSandsOfTime /> 28 March 2024</p>
                        </div>
                        <div className="apply_share">
                            <div className="btn_date">
                                <a href="/applynow" type="submit" class="sitebtn jobsearch bgblue">Apply Now</a>
                                <span>21/03/2024, 11:35 am</span>
                            </div>
                            <button className="share"><IoShareSocialOutline /> </button>
                        </div>
                    </div>
                </div>
                <div className="dtl_body">
                    <div className="job_benfit">
                        <h5>Benefits</h5>
                        <ul className="benefits">
                            <li>Health Insurance</li>
                            <li>Travel Allowance</li>
                        </ul>
                    </div>
                    <div className="job_description">
                        <h4>Job Description</h4>
                        <p>We have urgent requirement for QA Engineer For Noida location. Minimum 1+ years of experience in testing mobile applications on iOS,
                            Android and Web platforms.</p>
                        <h6>Responsibilities:</h6>
                        <ul>
                            <li>Review requirements, specifications and technical design documents to provide timely and meaningful feedback</li>
                            <li>Create detailed, comprehensive and well-structured test plans and test cases</li>
                            <li>Estimate, prioritise, plan and coordinate testing activities</li>
                            <li>Design, develop and execute automation scripts using open source tools.</li>
                            <li>Identify, record, document thoroughly and track bugs</li>
                            <li>Perform thorough regression testing when bugs are resolved</li>
                            <li>Develop and apply testing processes for new and existing products to meet client needs</li>
                            <li>Liaise with internal teams (e.g. developers and product managers) to identify system requirements</li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Job_description;
