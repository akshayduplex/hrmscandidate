import React, { useEffect, useState } from "react";
import './job.css';
import { Link } from "react-router-dom";
import config from "../Config/Config";
import { useDispatch, useSelector } from "react-redux";
import { ConfigrationSetting } from "../Redux/Slices/JobListApi";

function JobNavbar() {
    const [logo, setLogo] = useState('');

    const dispatch = useDispatch()
    const webSetting = useSelector(state => state.jobs.webSettingData);

    useEffect(() => {
        dispatch(ConfigrationSetting({ domain: config.FRONT_URL }))
    }, [dispatch])

    useEffect(() => {
        if (webSetting && webSetting?.data?.logo_image) {
            setLogo(webSetting?.data?.logo_image);
        }
    }, [webSetting]);

    return (
        <>
            <div className="fullhdr">
                <div className="container dflexbtwn">
                <div className=" topdashhdr d-flex align-items-center">
                    <div className="dashlogo">
                        <Link to={'/'}> { logo &&  <img src={config.IMAGE_PATH + logo} alt="logo" /> } </Link>
                    </div>
                    <div className="pagename">
                        <p>Find Jobs</p>
                    </div>
                </div>
                <div className="">
                    <Link to={'/login'} className="sitebtn jobsearch bgblue" type="submit">
                        Login
                    </Link> 
                </div>
                </div>
            </div>
        </>
    );
}
export default JobNavbar;