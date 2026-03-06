import React from "react";
import { useLocation } from "react-router-dom";
import DashNavbar from "./DashNav";
// import Job_nav from "../job-portal/Job-nav";

function MyComponent() {
    const location = useLocation();
    const pageName = location.pathname;

    return (
        <>
            {pageName === "/login" ? " " : <DashNavbar />}  
            {/* {pageName === "/job-listing" ? <Job_nav/> : " "}
            {pageName === "/job-details" ? <Job_nav/> : " "}
            {pageName === "/applynow" ? <Job_nav/> : " "} */}
        </>
    );
}

export default MyComponent;
