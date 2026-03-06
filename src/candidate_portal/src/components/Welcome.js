import React, { useState, useEffect } from "react";
import AOS from 'aos';
import { getCandidateById } from "../helper/Api_Helper";
import { getCandidateId, getSessionData } from "../helper/My_Helper";
import { useLocation, useNavigate } from 'react-router-dom';

const Verifiedd = () => {
    const [candidateName, setCandidateName] = useState('');
    const [pagelink, setPagelink] = useState([]);
    const location = useLocation();
    const navigate = useNavigate()


    useEffect(() => {
        const fetchCandidateData = async () => {
            try {
                const response = await getCandidateById({ _id: getCandidateId(), scope_fields: ["page_steps", 'assessment_apply_status'] });
                if (response && response.data) {
                    setPagelink(response.data.page_steps || []);
                    if (response.data.assessment_apply_status === "disable") {
                        navigate('/profile')
                    }
                }
            } catch (error) {
                console.error('Error fetching candidate data:', error);
            }
        };

        fetchCandidateData();
        const loginData = getSessionData('loginData') || 'Guest';
        setCandidateName(loginData.name);
        AOS.init({
            duration: 800,
            once: true,
        });

    }, [location, navigate]);
    // Filter and sort to get the first pending page
    const pendingPages = pagelink.filter(({ status }) => status.toLowerCase() === 'pending');
    const sortedPendingPages = pendingPages.sort((a, b) => a.step - b.step);
    const uniquePendingPage = sortedPendingPages[0];
    // assessment_status
    let linkText = '';
    let linkHref = '';
    console.log("Steps", uniquePendingPage)
    if (uniquePendingPage) {
        switch (uniquePendingPage.page) {
            case 'MCQ':
                linkText = 'Complete Your Profile';
                linkHref = '/profile';
                break;
            case 'profile':
                linkText = 'Complete Profile';
                linkHref = '/profile';
                break;
            case 'docs':
                linkText = 'Upload Documents';
                linkHref = '/upload-documents';
                break;
            default:
                break;
        }
    }


    return (
        <div className="maincontent">
            <div className="container">
                <div className="welcomebox" data-aos="fade-in" data-aos-duration="3000">
                    <div className="welcometext">
                        <h2>Hello, {candidateName}</h2>
                        <p>Welcome to the candidate portal.</p>
                        {uniquePendingPage && (
                            <a href={linkHref} className="sitebtn">{linkText}</a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Verifiedd;
