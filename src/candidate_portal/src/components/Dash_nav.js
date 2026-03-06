import React from "react";
import Sidebars from "./Dash_sidebar";
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';import user from "../images/profile.png";
import NavDropdown from 'react-bootstrap/NavDropdown';
import { clearSessionData } from "../helper/My_Helper";
import { useNavigate } from "react-router-dom";

function Dash_nav() {

    const navigate = useNavigate();

    const handleLogout = () => {
        clearSessionData();
        navigate('/login');
    };
    return (
        <>
            <Sidebars />
            <div className="wd80 tophdr d-flex justify-content-end">
                <div className="topdashhdr d-flex align-items-center"> 
                    <div className="notf_icn">
                        <NotificationsOutlinedIcon />
                    </div>
                    <div className="d-flex align-items-center hdrprof_menu">
                        <img src={user} alt="HRMS"/>
                        <NavDropdown title="" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/profile">
                                My Profile
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={handleLogout} >Logout</NavDropdown.Item>
                        </NavDropdown>
                    </div>

                </div>
            </div>
        </>
    );
}
export default Dash_nav;