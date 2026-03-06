import React, { useState } from "react";
import { GrDocumentTime } from "react-icons/gr";
import { IoDocumentAttachOutline } from "react-icons/io5";
import { GrUserExpert } from "react-icons/gr";
import { GrDocumentUpload } from "react-icons/gr";
import { Link } from 'react-router-dom';

import logo from "../images/logo.png";

// import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi/";
import MenuIcon from '@mui/icons-material/Menu';

import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";

function Sidebars() {
    //const { collapseSidebar } = useProSidebar();
    const [collapsed, setCollapsed] = useState(false);

    const [toggled, setToggled] = useState(false);

    const handleCollapsedChange = () => {
        setCollapsed(!collapsed);
    };
    const handleToggleSidebar = (value) => {
        setToggled(value);
    };

    return (
        <>
            <Sidebar className={`sitesidebar app ${toggled ? "toggled" : ""}`} style={{ height: "100%", position: "fixed" }} collapsed={collapsed} toggled={toggled}
                handleToggleSidebar={handleToggleSidebar} handleCollapsedChange={handleCollapsedChange}>
                <main>
                    <Menu className="sidelogobox">
                        {collapsed ? (<MenuItem icon={<MenuIcon />} onClick={handleCollapsedChange}></MenuItem>) : (
                            <MenuItem prefix={<MenuIcon />} onClick={handleCollapsedChange} >
                                <div className="dashlogo">
                                    <Link to="/">
                                        <img src={logo} alt="logo"/>
                                    </Link>
                                </div>
                            </MenuItem>
                        )}
                    </Menu>
                    <Menu className="sidemenus">
                        <MenuItem className="active" icon={<GrDocumentTime />} > <a href="/assessment"> Begin the Quiz</a></MenuItem>
                        <MenuItem icon={<GrUserExpert />} > <a href="/profile"> Complete Profile</a></MenuItem>
                        <MenuItem icon={<IoDocumentAttachOutline />} > <a href="/knowhlfppt"> Know HLFPPT</a></MenuItem>
                        <MenuItem icon={<GrDocumentUpload />} > <a href="/upload-documents"> Upload Documents</a></MenuItem>
                    </Menu>
                </main>
            </Sidebar>
        </>
    );
}
export default Sidebars;
