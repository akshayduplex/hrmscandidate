import React, { useState, useEffect } from "react";
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';import user from "../images/profile.png";
import NavDropdown from 'react-bootstrap/NavDropdown';
import { clearSessionData } from "../helper/My_Helper";
import { useNavigate } from "react-router-dom";
import config from "../config/Config";
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux"; 
function Dash_nav() {

    const navigate = useNavigate();
  const [logo, setLogo] = useState('');
    const handleLogout = () => {
        clearSessionData();
        navigate('/login');
    };

    const webSetting = useSelector(state => state.jobs.webSettingData);

    useEffect(() => {
        if (webSetting && webSetting?.data?.logo_image) {
            setLogo(webSetting?.data?.logo_image);
        }
    }, [webSetting]);
    console.log("websetting", webSetting)
    return (
        <>
          <div className="w-100 pt-2 d-flex justify-content-between align-items-center" style={{borderBottom:"1px solid #cccccc", paddingBottom:"20px"}}>
    
    {/* LEFT: Logo */}
    <div className="dashlogo" style={{ paddingLeft: "10px" }}>
        <Link to="/dashboard">
        {user &&  <img src={user} alt="HRMS"/> || <img src={config.IMAGE_PATH + logo} alt="HRMS" />}
        </Link>
        <Link to="/dashboard">
            <strong style={{paddingLeft:"60px"}}>Dashboard</strong>
        </Link>
    </div>

    {/* RIGHT: Icons + profile */}
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
                <NavDropdown.Item onClick={handleLogout}>
                    Logout
                </NavDropdown.Item>
            </NavDropdown>
        </div>
    </div>

</div>

        </>
    );
}
export default Dash_nav;