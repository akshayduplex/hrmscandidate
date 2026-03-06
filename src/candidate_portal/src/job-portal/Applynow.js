import React from "react";
import Applyform from "./Applyform";
import { FiCalendar } from "react-icons/fi";
import { GiSandsOfTime } from "react-icons/gi";
// import { IoShareSocialOutline } from "react-icons/io5";
import { MdOutlineCurrencyRupee } from "react-icons/md";

function Applynow() {
    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-sm-4">
                        <div className="applyhdr">
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
                            </div>
                            <div className="job_benfit">
                                <h5>Benefits</h5>
                                <ul className="benefits">
                                    <li>Health Insurance</li>
                                    <li>Travel Allowance</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-8">
                        <Applyform />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Applynow;