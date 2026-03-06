import React, { useEffect } from "react";
import Button from 'react-bootstrap/Button';
import { clearSessionData } from "../helper/My_Helper";
import { useNavigate } from "react-router-dom";

const Profile_submit = () => {

    const navigate = useNavigate();

    useEffect(() => {
       setTimeout(() => {
        navigate('/know-organization')
       } , 1000)
    } , [])

    const handleLogout = () => {
        clearSessionData();
        navigate('/login');
    };
    return (
        <>
            <div className="welcomebox">
                <div className="welcometext">
                    <h2>Great !!</h2>
                    <p>Your updated profile have been submitted for evaluation. <br /> You will soon be notified for the second round quiz.</p>
                    <Button onClick={handleLogout} className="sitebtn mt-4 btnblue"> Sign Out </Button>
                </div>
            </div> 
        </>

    )
}


export default Profile_submit;
