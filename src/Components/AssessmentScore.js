import {React, useEffect} from 'react';
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import AOS from 'aos';


const AssessmentScore = () => {
    const percentage = 70;
    const percentage1 = 40;
    const percentage2 = 50;

    useEffect(() => {
        AOS.init({
            // Global settings
            duration: 800, // animation duration
            once: true, // whether animation should happen only once - while scrolling down
        });
    }, []); // run only once after initial render

    return (
        <>
            <div className="maincontent">
                <div className="container">
                    <div className="scorewrap  animate__animated animate__fadeIn animate__slower">
                        <div className="scorebox mb-4 assementscore">
                            <div className="scorenumb"  data-aos="zoom-in" data-aos-duration="3000">
                                <CircularProgressbar
                                    value={percentage}
                                    text={`${percentage}%`}
                                    strokeWidth={10}
                                    Clockwise
                                />
                            </div>
                            <div className="scoretext">
                                <h5>Great!!</h5>
                                <p>Your assessment have been submitted for evaluation successfully. </p>
                                <div className="dflexbtwn mt-3">
                                    <p className="scores">You Scored - <span>80.00%</span></p>
                                </div>
                                <div className="prflbtns mt-3">
                                    <a href="/" className="sitebtn comp_prfl">Sign Out</a>
                                </div>
                            </div>
                        </div>

                        <div className="scorebox mb-4 assementscore failed ">
                            <div className="scorenumb" data-aos="zoom-in" data-aos-duration="3000">
                                <CircularProgressbar
                                    value={percentage1}
                                    text={`${percentage1}%`}
                                    strokeWidth={10}
                                    Clockwise />
                            </div>
                            <div className="scoretext">
                                <h5>Alas!!</h5>
                                <p>Your assessment have been submitted for evaluation successfully. </p>
                                <div className="dflexbtwn mt-3">
                                    <p className="scores">You Scored - <span>40.00%</span></p>
                                </div>
                                <p>Since, you didn’t score as per our selection criteria. We cannot proceed further with your application right now.</p>
                            </div>
                        </div>

                        <div className="scorebox mb-4 ">
                            <div className="scorenumb" data-aos="zoom-in" data-aos-duration="3000">
                                <CircularProgressbar
                                    value={percentage2}
                                    text={`${percentage2}%`}
                                    strokeWidth={10}
                                    Clockwise
                                />
                            </div>
                            <div className="scoretext">
                                <h5>Complete Your Profile</h5>
                                <p>Review your application form and fill in the required information. </p>
                                <div className="prflbtns mt-3">
                                    <a href="/profile" className="sitebtn comp_prfl">Complete Your Profile</a>
                                    <button className="sitebtn resumebtn"><FileUploadOutlinedIcon /> I have the resume</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

// function Example(props) {
//     return (
//         <div>{props.children}</div>
//     );
// }
export default AssessmentScore;
