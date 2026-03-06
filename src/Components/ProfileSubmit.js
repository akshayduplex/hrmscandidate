import React from "react";
import Button from 'react-bootstrap/Button';

const ProfileSubmit = () => {


    return (
        <>
            <div className="welcomebox">
                <div className="welcometext">
                    <h2>Great !!</h2>
                    <p>Your updated profile have been submitted for evaluation. <br /> You will soon be notified for the second round quiz.</p>
                    <Button className="sitebtn mt-4 btnblue"> Sign Out </Button>
                </div>
            </div>

        </>

    )
}


export default ProfileSubmit;
