import React, { useEffect, useState } from "react";
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { getSingleAssessment, checkAssessment, getCandidateById } from "../helper/Api_Helper";
import { getCandidateId } from "../helper/My_Helper";
// import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
  
const Assessment = () => {
    const [fileFields, setFileFields] = useState([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [timerActive, setTimerActive] = useState(true);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [flashMessage, setFlashMessage] = useState({ text: '', type: '' });
    const [showFlash, setShowFlash] = useState(false);
    const navigate = useNavigate();
    console.log(isSubmitting , flashMessage , showFlash);

    useEffect(() => {
        const checkAndFetchData = async () => {
            try {
                const checkResult = await getCandidateById({ _id: getCandidateId(), scope_fields: ["mcq_final_score", "mcq_score_final_result", "mcq_attempts" , "project_id" , "job_id" , 'assessment_apply_status'] });
                const myResult = checkResult.data;
                if (myResult.assessment_apply_status === "disable") {
                    navigate("/profile");
                }
                if (myResult.mcq_attempts === 'Complete') {
                    // Clear the local storage and navigate to the assessment score page
                    localStorage.removeItem('quizAssessmentData');
                    localStorage.removeItem('quiz_answer_list');

                    localStorage.removeItem('knowAssessmentData');
                    localStorage.removeItem('assessmentData');
                    localStorage.removeItem('assessmentStarted');
                    // Store the response data locally
                    localStorage.setItem('assessmentSubmitResponse', JSON.stringify({'percentage' : myResult.mcq_final_score, 'result' : myResult.mcq_score_final_result}));
                    navigate("/assessment-score");
                } else {
                    const fetchData = async () => {
                        localStorage.setItem('pageLoaded', '');
                        const now = Date.now();
                        const cachedData = JSON.parse(localStorage.getItem('quizAssessmentData'));
                        const cachedOptions = JSON.parse(localStorage.getItem('quiz_answer_list'));

                        if (cachedData && cachedData.endTime) {
                            const remainingTime = Math.max(0, Math.floor((cachedData.endTime - now) / 1000));
                            setTimeLeft(remainingTime);
                            setFileFields(cachedData.assessmentData);
                        } else {
                            try {
                                const response = await getSingleAssessment({ candidate_id: getCandidateId(), content_type: 'MCQ' , project_id:myResult?.project_id , job_id:myResult?.job_id });
                                const duration = parseInt(response.data[0].duration, 10) * 60 * 1000;
                                const endTime = Date.now() + duration;

                                const newData = {
                                    assessmentData: response.data[0],
                                    endTime: endTime,
                                };
                                localStorage.setItem('quizAssessmentData', JSON.stringify(newData));
                                setFileFields(response.data[0]);
                                setTimeLeft(duration / 1000);
                            } catch (error) {
                                console.error('Error fetching assessment data:', error);
                            }
                        }

                        if (Array.isArray(cachedOptions)) {
                            setSelectedOptions(cachedOptions);
                        }
                    };

                    fetchData();
                }
            } catch (error) {
                console.error('Error checking candidate data:', error);
            }
        };

        checkAndFetchData();
    }, []);


    useEffect(() => {
        if (fileFields) {
            const initialOptions = fileFields?.assessment_list?.map(question => ({
                _id: question._id,
                answer: ""
            })) || [];
            setSelectedOptions(initialOptions);
            localStorage.setItem('quiz_answer_list', JSON.stringify(initialOptions)); // Store initial empty options
        }
    }, [fileFields]);

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

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
    };

    const handleOptionChange = (questionId, selectedOption) => {
        setSelectedOptions(prevOptions => {
            const updatedOptions = prevOptions.map(option =>
                option._id === questionId ? { ...option, answer: selectedOption } : option
            );
            localStorage.setItem('quiz_answer_list', JSON.stringify(updatedOptions));
            return updatedOptions;
        });
    };

    const handleSubmit = async () => {
        try {
            const candidateId = await getCandidateId(); // Assuming this function returns the candidate ID
            const postData = { 'candidate_id' : candidateId, 'assessment_id' : fileFields._id, 'answer_list' : selectedOptions };
            const response = await checkAssessment(postData);

            if (response.status) {
                // Clear the local storage and navigate to the assessment score page
                localStorage.removeItem('quizAssessmentData');
                localStorage.removeItem('quiz_answer_list');

                localStorage.removeItem('knowAssessmentData');
                localStorage.removeItem('assessmentData');
                localStorage.removeItem('assessmentStarted');
                // Store the response data locally
                console.log(JSON.stringify(response.data))
                localStorage.setItem('assessmentSubmitResponse', JSON.stringify(response.data));
                // Update parent component state to show assessment score
                setFlashMessage({ text: response.message, type: 'success' });
                setShowFlash(true);
                setIsSubmitting(false);
                setTimeout(() => {
                  setShowFlash(false);
                  setFlashMessage({ text: '', type: '' });
                }, 5000);
               navigate("/assessment-score");
            } else {
                setFlashMessage({ text: response.message, type: 'error' });
                setShowFlash(true);
                setIsSubmitting(false);
                setTimeout(() => {
                  setShowFlash(false);
                  setFlashMessage({ text: '', type: '' });
                }, 5000);
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
        <div className="maincontent">
            <div className="container">
                <div className="contentwrap animate__animated animate__fadeIn animate__slower">
                    <div className="alertbox">
                        <p>Kindly complete your assessment since not much time left. Once your time is up it will be submitted automatically for evaluation.</p>
                    </div>
                    <div className="contentbox mob_margin">
                        <div className="contenthdr">
                            <h4>All the best !!</h4>
                            <div className="timebox">
                                <p className="statictime">
                                    Time Remaining: {formatTime(timeLeft)} min
                                </p>
                            </div>
                        </div>
                        <div className="contentbody">
                            <h5>MCQ</h5>
                            {fileFields?.assessment_list?.map((question, index) => (
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
                        <button className="qstnbtn sitebtn" onClick={handleSubmit} >Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Assessment;
