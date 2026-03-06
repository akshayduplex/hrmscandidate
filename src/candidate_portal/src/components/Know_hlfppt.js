import React, { useState, useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import { FaRegClock } from 'react-icons/fa'; // Clock icon
import { getSingleAssessment, getCandidateById } from "../helper/Api_Helper";
import { getCandidateId } from "../helper/My_Helper";
import KnowHlfpptAssessment from "./Know_hlfppt_assessment";
import { useNavigate } from 'react-router-dom';
const Knowhlfppt = () => {
    const [timeRemaining, setTimeRemaining] = useState(0); // Initialize with 0 seconds
    const [showModal, setShowModal] = useState(false); // State to manage modal visibility
    const [modalMessage, setModalMessage] = useState(""); // State to manage modal message
    const [assessmentData, setAssessmentData] = useState(null); // State to store assessment data
    const [showAssessment, setShowAssessment] = useState(false); // State to manage assessment visibility
    const navigate = useNavigate();
    useEffect(() => {
        const checkAndFetchData = async () => {
            try {
                const checkResult = await getCandidateById({ _id: getCandidateId(), scope_fields: ["comprehensive_attempts", "comprehensive_final_score", "comprehensive_score_final_result" , "job_id" , 'project_id' , 'assessment_apply_status'] });
                const myResult = checkResult.data;
                if (myResult.assessment_apply_status === "disable") {
                    navigate("/profile");
                }
                if (myResult.comprehensive_attempts === 'Complete') {
                    localStorage.removeItem('quizAssessmentData');
                    localStorage.removeItem('quiz_answer_list');

                    localStorage.removeItem('knowAssessmentData');
                    localStorage.removeItem('assessmentData');
                    localStorage.removeItem('assessmentStarted');
                    // Store the response data locally
                    localStorage.setItem('assessmentSubmitResponse', JSON.stringify({'percentage' : myResult.comprehensive_final_score, 'result' : myResult.comprehensive_score_final_result}));
                    navigate("/assessment-score");
                } else {
                    const fetchAssessmentData = async () => {
                        try {
                            localStorage.setItem('pageLoaded', '');
                            const id = await getCandidateId(); // Await to get the candidate ID
                            const now = Date.now();
                            const cachedData = JSON.parse(localStorage.getItem('assessmentData'));
                            const started = JSON.parse(localStorage.getItem('assessmentStarted'));
    
                            if (started) {
                                // If assessment has been started, directly show it
                                setShowAssessment(true);
                                setAssessmentData(cachedData ? cachedData.assessmentData : null);
                                setTimeRemaining(cachedData ? Math.max(Math.floor((cachedData.endTime - now) / 1000), 0) : 0);
                            } else {
                                // Fetch new data if not cached or expired
                                if (cachedData && cachedData.id === id && now < cachedData.endTime) {
                                    setAssessmentData(cachedData.assessmentData);
                                    setTimeRemaining(Math.max(Math.floor((cachedData.endTime - now) / 1000), 0));
                                } else {
                                    const response = await getSingleAssessment({ candidate_id: id, content_type: 'Comprehensive' , job_id:myResult?.job_id , project_id:myResult?.project_id });
                                    if (response.status && response.data.length > 0) {
                                        const newData = {
                                            id: id,
                                            assessmentData: response.data[0],
                                            endTime: now + parseInt(response.data[0].reading_duration, 10) * 60 * 1000 // duration in milliseconds
                                        };
                                        localStorage.setItem('assessmentData', JSON.stringify(newData));
                                        setAssessmentData(newData.assessmentData);
                                        setTimeRemaining(parseInt(response.data[0].reading_duration, 10) * 60); // duration in seconds
                                    }
                                }
                            }
                        } catch (error) {
                            console.error("Error fetching assessment data:", error);
                            // setError(error)
                        }
                    };
    
                    fetchAssessmentData();
                }
            } catch (error) {
                console.error('Error checking candidate data:', error);
            }
        };
    
        checkAndFetchData();
    }, []);
    

    useEffect(() => {
        let timer;
        if (timeRemaining > 0 && !showAssessment) {
            timer = setInterval(() => {
                setTimeRemaining(prevTime => {
                    if (prevTime <= 1) {
                        clearInterval(timer);
                        setShowModal(true); // Show modal when time runs out
                        setModalMessage("Time is up! Click below to start your assessment.");
                        localStorage.removeItem('assessmentData'); // Clear the cached assessment data
                        return 0;
                    }
                    return Math.floor(prevTime - 1); // Ensure integer value
                });
            }, 1000);
        } else {
            clearInterval(timer);
        }

        return () => clearInterval(timer); // Cleanup on component unmount or if timeRemaining changes
    }, [timeRemaining, showAssessment]);

    // Convert remaining time to minutes and seconds
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;

    const handleBeginAssessment = () => {
        setShowAssessment(true); // Show assessment content when button is clicked
        localStorage.setItem('assessmentStarted', JSON.stringify(true)); // Mark assessment as started
        setShowModal(false); // Hide modal when assessment starts
    };

    return (
        <>
            {!showAssessment && ( // Conditionally render main content
                <div className="maincontent animate__animated animate__fadeIn animate__slower">
                    <div className="container">
                        <div className="contentwrap">
                            <div className="contentbox">
                                <div className="contenthdr">
                                    <h4>All the best !!</h4>
                                    <div className="timebox">
                                        <p className="statictime">
                                            {`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`} min
                                        </p>
                                    </div>
                                </div>
                                <div className="contentbody">
                                    <h5>Read the following paragraph carefully and answer the questions accordingly.</h5>
                                    <h6>Know About Organization</h6>
                                    <p>{assessmentData ? assessmentData.content : 'Loading...'}</p>
                                    {/* More content here */}
                                </div>
                            </div>
                            <div className="contentbtnwrap">
                                <button onClick={handleBeginAssessment} className="sitebtn">
                                    Begin Assessment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showAssessment && <KnowHlfpptAssessment assessmentData={assessmentData} />} {/* Pass assessmentData as a prop */}
            <Modal
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={showModal} // Show modal based on state
                onHide={() => {}} // Prevent closing the modal
                backdrop="static" // Prevent closing the modal when clicking outside
                keyboard={false} // Prevent closing the modal with the keyboard
                className="attractive-modal" // Custom class for styling
            >
                <Modal.Body className="py-4 text-center">
                    <div className="modal-icon" style={{ marginBottom: '1rem' }}>
                        <FaRegClock style={{ fontSize: 60, color: '#007bff' }} />
                    </div>
                    <h4 className="modal-title">Time's Up!</h4>
                    <p className="modal-message">{modalMessage}</p>
                    <button className="sitebtn" onClick={handleBeginAssessment}>Begin Assessment</button>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Knowhlfppt;
