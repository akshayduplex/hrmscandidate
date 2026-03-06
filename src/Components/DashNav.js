import React from "react";
import Sidebars from "./DashSidebar";
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';import user from "../images/profile.png";
import NavDropdown from 'react-bootstrap/NavDropdown';

function DashNavbar() {
    return (
        <>
            <Sidebars />
            <div className="wd80 tophdr d-flex justify-content-end">
                <div className="topdashhdr d-flex align-items-center"> 
                    <div className="notf_icn">
                        <NotificationsOutlinedIcon />
                    </div>
                    <div className="d-flex align-items-center hdrprof_menu">
                        <img src={user} alt="user-logo"/>
                        <NavDropdown title="" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#">
                                My Profile
                            </NavDropdown.Item>
                            <NavDropdown.Item href="">Logout</NavDropdown.Item>
                        </NavDropdown>
                    </div>
                </div>
            </div>
        </>
    );
}
export default DashNavbar;