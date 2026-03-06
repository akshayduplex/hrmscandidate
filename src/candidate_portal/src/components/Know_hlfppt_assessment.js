import React, { useState, useEffect } from "react";
import Form from 'react-bootstrap/Form';
// import { useHistory } from 'react-router-dom';
import { checkAssessment } from "../helper/Api_Helper";
import { getCandidateId } from "../helper/My_Helper";
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const Assessment = ({ assessmentData }) => {
    const [fileFields, setFileFields] = useState([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [timerActive, setTimerActive] = useState(true);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [flashMessage, setFlashMessage] = useState({ text: '', type: '' });
    const [showFlash, setShowFlash] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const now = Date.now();
        const cachedData = JSON.parse(localStorage.getItem('knowAssessmentData'));
        const cachedOptions = JSON.parse(localStorage.getItem('answer_list'));

        if (cachedData && cachedData.endTime) {
            const remainingTime = Math.max(0, Math.floor((cachedData.endTime - now) / 1000));
            setTimeLeft(remainingTime);
            setFileFields(cachedData.assessmentData);
        } else {
            if (assessmentData) {
                const duration = parseInt(assessmentData.duration, 10) * 60 * 1000;
                const endTime = Date.now() + duration;
                const newData = {
                    assessmentData: assessmentData,
                    endTime: endTime
                };
                localStorage.setItem('knowAssessmentData', JSON.stringify(newData));
                setFileFields(assessmentData);
                setTimeLeft(duration / 1000);
            }
        }

        if (Array.isArray(cachedOptions)) {
            setSelectedOptions(cachedOptions);
        } else {
            // Initialize selectedOptions with empty answers based on assessmentData
            const initialOptions = assessmentData?.assessment_list.map(question => ({
                _id: question._id,
                answer: ""
            })) || [];
            setSelectedOptions(initialOptions);
            localStorage.setItem('answer_list', JSON.stringify(initialOptions)); // Store initial empty options
        }
    }, [assessmentData]);

    useEffect(() => {
        let timer;
        if (timerActive && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime <= 1) {
                        clearInterval(timer);
                        setTimerActive(false);
                        handleSubmit(); // Auto-submit when time is over
                        return 0;
                    }
                    return Math.floor(prevTime - 1);
                });
            }, 1000);
        } else {
            clearInterval(timer);
        }

        return () => clearInterval(timer);
    }, [timeLeft, timerActive]);

    const handleOptionChange = (questionId, selectedOption) => {
        // Create or update the selected option object
        const updatedSelectedOptions = selectedOptions.map(opt =>
            opt._id === questionId ? { _id: questionId, answer: selectedOption } : opt
        );

        setSelectedOptions(updatedSelectedOptions);
        localStorage.setItem('answer_list', JSON.stringify(updatedSelectedOptions));
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const candidateId = await getCandidateId(); // Assuming this function returns the candidate ID
            const postData = { 'candidate_id': candidateId, 'assessment_id': assessmentData._id, 'answer_list': selectedOptions };
            const response = await checkAssessment(postData);
            if (response.status) {
                // Clear the local storage and navigate to the assessment score page
                localStorage.removeItem('knowAssessmentData');
                localStorage.removeItem('answer_list');
                localStorage.removeItem('assessmentData');
                localStorage.removeItem('assessmentStarted');

                // Store the response data locally
                localStorage.setItem('assessmentSubmitResponse', JSON.stringify(response.data));
                // Update parent component state to show assessment score
                // You might need to lift the state up to manage this properly

                setFlashMessage({ text: 'Your assessment has been successfully submitted', type: 'success' });
                setShowFlash(true);
                setIsSubmitting(false);
                setTimeout(() => {
                    setShowFlash(false);
                    setFlashMessage({ text: '', type: '' });
                }, 1000);
                navigate("/assessment-score");
            } else {
                setFlashMessage({ text: "Assessment submission failed!", type: 'error' });
                setShowFlash(true);
                setIsSubmitting(false);
                setTimeout(() => {
                    setShowFlash(false);
                    setFlashMessage({ text: '', type: '' });
                }, 5000);
                //   console.error("Assessment submission failed", response.message);
            }
        } catch (error) {
            setFlashMessage({ text: "Assessment submission failed!", type: 'error' });
            setShowFlash(true);
            setIsSubmitting(false);
            setTimeout(() => {
                setShowFlash(false);
                setFlashMessage({ text: '', type: '' });
            }, 5000);
        }
    };


    return (
        <>
            {showFlash && (
                <div className={`flash-message ${flashMessage.type}`}>
                    {flashMessage.type === 'success' && <FaCheckCircle className="icon" />}
                    {flashMessage.type === 'error' && <FaExclamationCircle className="icon" />}
                    <p>{flashMessage.text}</p>
                    <button className="close" onClick={() => setShowFlash(false)}>&times;</button>
                </div>
            )}
            <div className="maincontent">
                <div className="container">
                    <div className="contentwrap animate__animated animate__fadeIn animate__slower">
                        <div className="alertbox">
                            <p>Kindly complete your assessment since not much time left. Once your time is up, it will be submitted automatically for evaluation.</p>
                        </div>
                        <div className="contentbox">
                            <div className="contenthdr">
                                <h4>All the best !!</h4>
                                <div className="timebox">
                                    <p className="statictime">{formatTime(timeLeft)} min</p>
                                </div>
                            </div>
                            <div className="contentbody">
                                <h5>MCQ</h5>
                                {!fileFields && fileFields?.label < 0 ? <div className="questionwrap">
                                    <h4>Oh Sorry.. No Alignment Any Assessment</h4>
                                    {/* <div className="">
                                      
                                    </div> */}
                                </div> : fileFields?.assessment_list?.map((question, index) => (
                                    <div key={question._id} className="questionwrap">
                                        <h6>{index + 1}. {question.question}</h6>
                                        <p>{question.description}</p>
                                        <div className="answers">
                                            {question.options.map((option, i) => (
                                                <Form.Check
                                                    key={i}
                                                    type="radio"
                                                    label={`${String.fromCharCode(65 + i)}. ${option}`}
                                                    name={`group${index}`}
                                                    aria-label={`radio ${i + 1}`}
                                                    id={`ans${index}-${i}`}
                                                    checked={selectedOptions.find(opt => opt._id === question._id)?.answer === option}
                                                    onChange={() => handleOptionChange(question._id, option)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="contentbtnwrap">
                            <button className="qstnbtn sitebtn" disabled={isSubmitting} onClick={handleSubmit}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Assessment;
