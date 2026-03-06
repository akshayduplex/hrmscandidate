import React from "react";
import Job_cards from "./Job-cards";
import Top_banner from "./Top-banner";
import { Link } from "react-router-dom";

function Job_listing() {
    return (
        <>
            <Top_banner />

            <div className="container">
                <div className="joblist_display mt-4">
                    <div className="jobcounts">
                        <h5><span>20</span> jobs openings in Engineering</h5>
                    </div>
                    <div className="row">
                        <div className="col-sm-4">
                            <Link to="/job-details">
                                <Job_cards />
                            </Link>
                        </div>
                        <div className="col-sm-4">
                            <Link to="/job-details">
                                <Job_cards />
                            </Link>
                        </div>
                        <div className="col-sm-4">
                            <Link to="/job-details">
                                <Job_cards />
                            </Link>
                        </div>
                        <div className="col-sm-4">
                            <Link to="/job-details">
                                <Job_cards />
                            </Link>
                        </div>
                        <div className="col-sm-4">
                            <Link to="/job-details">
                                <Job_cards />
                            </Link>
                        </div>
                        <div className="col-sm-4">
                            <Link to="/job-details">
                                <Job_cards />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Job_listing;