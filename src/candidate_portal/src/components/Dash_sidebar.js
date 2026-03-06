import React, { useState, useEffect } from "react";
import { IoDocumentAttachOutline } from "react-icons/io5";
import { GrUserExpert } from "react-icons/gr";
import { GrDocumentUpload } from "react-icons/gr";
import { Link, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { getCandidateById } from "../helper/Api_Helper";
import { getCandidateId } from "../helper/My_Helper";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { useSelector } from "react-redux";
import config from "../../../Config/Config";
import { MdOutlineSettingsApplications } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function Sidebars() {
    const [collapsed, setCollapsed] = useState(true);
    const [toggled, setToggled] = useState(false);
    const [Kycstep, setKycstep] = useState(false);
    const [pagelink, setPagelink] = useState([]);
    const [candidate, setCandidate] = useState({});
    const location = useLocation();
    const [logo, setLogo] = useState('');
    const navigate = useNavigate();

    console.log(candidate)

    const webSetting = useSelector(state => state.jobs.webSettingData);

    useEffect(() => {
        if (webSetting && webSetting?.data?.logo_image) {
            setLogo(webSetting?.data?.logo_image);
        }
    }, [webSetting]);


    useEffect(() => {
        const fetchCandidateData = async () => {
            try {
                const response = await getCandidateById({ _id: getCandidateId(), scope_fields: ["kyc_steps", "page_steps", 'assessment_apply_status', 'job_id', 'applied_jobs'] });
                if (response && response.data) {
                    setCandidate(response.data);
                    // assessment_apply_status === "disable"
                    setKycstep(response.data.kyc_steps)
                    setPagelink(response.data.page_steps || []); // Set pagelink with default empty array if data is not available
                }
            } catch (error) {
                console.error('Error fetching candidate data:', error);
            }
        };
        fetchCandidateData();
    }, [location]); // Depend on location to trigger effect on URL change

    const handleCollapsedChange = () => {
        setCollapsed(!collapsed);
    };

    const handleToggleSidebar = (value) => {
        setToggled(value);
    };

    // Create a utility function to get the status of a page
    const getPageStatus = (page) => {
        const pageData = pagelink.find(p => p.page === page);
        return pageData ? pageData.status : 'inactive'; // Default to 'inactive' if no data found
    };
    // console.log(pagelink)

    // Conditional rendering of MenuItems based on Kycstep
    const docsMenuItem = Kycstep === 'Complete' ? (
        <MenuItem
            className={`menu-item ${getPageStatus('docs') === 'complete' || location.pathname === '/your-document' ? 'active' : 'inactive'}`}
            icon={<GrDocumentUpload />}
        // disabled={getPageStatus('docs') === 'inactive' && candidate?.assessment_apply_status === 'enable'}
        >
            <Link to="/your-document" className={getPageStatus('docs') === 'inactive' ? 'inactive-link' : ''}>
                View Documents
            </Link>
        </MenuItem>
    ) : (
        <MenuItem
            className={`menu-item ${getPageStatus('docs') === 'complete' || location.pathname === '/upload-documents' ? 'active' : 'inactive'}`}
            icon={<GrDocumentUpload />}
        // disabled={(getPageStatus('docs') === 'inactive' && candidate?.assessment_apply_status === 'enable') || ((candidate?.assessment_apply_status === 'disable' && Kycstep !== 'Docs'))}
        >
            <Link to="/upload-documents" className={getPageStatus('docs') === 'inactive' ? 'inactive-link' : ''}>
                Upload Documents
            </Link>
        </MenuItem>
    );

    return (
        <>
            <Sidebar className={`sitesidebar app ${toggled ? "toggled" : ""}`} style={{ height: "100%", position: "fixed" }} collapsed={collapsed} toggled={toggled}
                handleToggleSidebar={handleToggleSidebar} handleCollapsedChange={handleCollapsedChange}>
                <main>
                    <Menu className="sidelogobox">
                        {collapsed ? (
                            <MenuItem icon={<MenuIcon />} onClick={handleCollapsedChange}></MenuItem>
                        ) : (
                            <MenuItem prefix={<MenuIcon />} onClick={handleCollapsedChange}>
                                <div className="dashlogo">
                                    <Link to="/dashboard">
                                        {logo && <img src={config.IMAGE_PATH + logo} alt="HRMS" />}
                                    </Link>
                                </div>
                            </MenuItem>
                        )}
                    </Menu>
                    <Menu className="sidemenus">
                        {/* {
                            candidate?.assessment_apply_status === 'enable' &&
                            <MenuItem
                                className={`menu-item ${getPageStatus('MCQ') === 'complete' || location.pathname === '/assessment' ? 'active' : 'inactive'}`}
                                icon={<GrDocumentTime />}
                                onClick={() => navigate('/assessment')}
                                disabled={(getPageStatus('MCQ') === 'complete' || getPageStatus('MCQ') === 'inactive') && candidate?.assessment_apply_status === 'enable'}
                            >
                                Begin the Quiz
                            </MenuItem>
                        } */}
 <MenuItem
                            className={`menu-item ${getPageStatus('profile') === 'complete' || location.pathname === '/dashboard' ? 'active' : 'inactive'}`}
                            icon={<IoDocumentAttachOutline />}
                            onClick={() => navigate('/dashboard')}
                        >
                            {/* <Link to="/approval-documents" className={getPageStatus('profile') === 'inactive' ? 'inactive-link' : ''}>Onboard Documents</Link> */}
                            Dashboard
                        </MenuItem>
                        <MenuItem
                            className={`menu-item ${getPageStatus('profile') === 'complete' || location.pathname === '/application-form' ? 'active' : 'inactive'}`}
                            icon={<MdOutlineSettingsApplications />}
                            onClick={() => navigate('/application-form')}
                        >
                            Application Form
                        </MenuItem>

                        <MenuItem
                            className={`menu-item ${getPageStatus('profile') === 'complete' || location.pathname === '/profile' ? 'active' : 'inactive'}`}
                            icon={<GrUserExpert />}
                            onClick={() => navigate('/profile')}
                        // disabled={((getPageStatus('profile') === 'complete' || getPageStatus('profile') === 'inactive') && candidate?.assessment_apply_status === 'enable') || (candidate?.assessment_apply_status === 'disable' && Kycstep !== 'Profile')}
                        >
                            {/* <Link to="/profile" className={getPageStatus('profile') === 'inactive' ? 'inactive-link' : ''}>Complete Profile</Link> */}
                            Complete Profile
                        </MenuItem>

                        {docsMenuItem}

                        <MenuItem
                            className={`menu-item ${getPageStatus('profile') === 'complete' || location.pathname === '/approval-documents' ? 'active' : 'inactive'}`}
                            icon={<IoDocumentAttachOutline />}
                            onClick={() => navigate('/approval-documents')}
                        >
                            {/* <Link to="/approval-documents" className={getPageStatus('profile') === 'inactive' ? 'inactive-link' : ''}>Onboard Documents</Link> */}
                            Onboard Documents
                        </MenuItem>

                    </Menu>
                </main>
            </Sidebar>
        </>
    );
}

export default Sidebars;