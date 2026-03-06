import React, { useState, useEffect } from "react";
import AssessmentAgree from "./AssessmentAgree";
import Button from 'react-bootstrap/Button';
import AOS from 'aos';

const Welcome = () => {
    const [firstDivVisible, setFirstDivVisible] = useState(true);
    const [secondDivVisible, setSecondDivVisible] = useState(false);

    useEffect(() => {
        AOS.init({
            // Global settings
            duration: 800, // animation duration
            once: true, // whether animation should happen only once - while scrolling down
        });
    }, []); // run only once after initial render

    const showSecondDiv = () => {
        setFirstDivVisible(false);
        setSecondDivVisible(true);
    };

    return (
        <>
            {firstDivVisible && (
                <div className="maincontent">
                    <div className="container">
                        <div className="welcomebox" data-aos="fade-in" data-aos-duration="3000">
                            <div className="welcometext">
                                <h2>Hello, Ashish Kumar</h2>
                                <p>Welcome to the candidate portal.</p>
                                <Button className="sitebtn mt-4" onClick={showSecondDiv}> Begin Quiz </Button>
                                {/* <a href="/assessment" className="sitebtn">Begin Quiz</a> */}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {secondDivVisible && (
                <div className="maincontent">
                    <div className="container"  data-aos="fade-in" data-aos-duration="3000">
                        <AssessmentAgree />
                    </div>
                </div>
            )}
        </>

    )
}


export default Welcome;
