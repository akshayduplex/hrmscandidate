import React from "react";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { FiCalendar } from "react-icons/fi";

function Job_cards() {
    return (
        <>
           
                <div className="card jobcard">
                    <div className="card-body">
                        <div className="dflexbtwn">
                            <span className="date"><FiCalendar /> 23/03/2024</span>
                            <span className="type">Full time</span>
                        </div>
                        <h5 className="job_profile">Junior Engineer</h5>
                        <div className="d-flex compny_site">
                            <p>ABC Pvt. Ltd</p>
                            <span className="work_loc">Onsite</span>
                        </div>
                        <div className="dflexbtwn">
                            <div className="salry">
                                <span>Salary Range</span>
                                <p><MdOutlineCurrencyRupee /> 3 lpa - 5 lpa</p>
                            </div>
                            <div className="location">
                                <span>Location</span>
                                <p><IoLocationOutline /> Noida, Uttar Pradesh</p>
                            </div>
                        </div>
                    </div>
                </div>
        </>
    );
}
export default Job_cards;