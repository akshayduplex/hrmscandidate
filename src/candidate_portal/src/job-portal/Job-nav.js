import React from "react";
import logo from "../images/logo.png";
import './job.css';

function Job_nav() {
    return (
        <>
            <div className="fullhdr">
                <div className="container topdashhdr d-flex align-items-center">
                    <div className="dashlogo">
                        <img src={logo} />
                    </div>
                    <div className="pagename">
                       <p>Find Jobs</p>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Job_nav;