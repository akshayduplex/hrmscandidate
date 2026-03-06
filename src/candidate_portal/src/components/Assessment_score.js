import React, { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import AOS from "aos";
import { clearSessionData, getCandidateId } from "../helper/My_Helper";
import { useNavigate } from "react-router-dom";
import { uploadResume, getCandidateById } from "../helper/Api_Helper";

const Assessment_score = () => {
  // const [assessmentData, setAssessmentData] = useState(null);
  const [percentage, setPercentage] = useState(null);
  const [percentage2, setPercentage2] = useState(0);
  const [result, setResult] = useState(null);
  const [candidateId, setCandidateId] = useState(null);
  const [flashMessage, setFlashMessage] = useState({ text: '', type: '' });
  const [showFlash, setShowFlash] = useState(false);
  const [resume_file, setresume_file] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Check if it's the first time loading the page
    const isFirstLoad = !localStorage.getItem("pageLoaded");
    if (isFirstLoad) {
      // Set flag indicating the page has been loaded
      localStorage.setItem("pageLoaded", "true");
      // Reload the page
      window.location.reload();
    }
    const fetchData = async () => {
      try {
        // Fetch candidateId asynchronously
        const id = await getCandidateId();
        setCandidateId(id);
        
        // Fetch candidate details
        // const response = await getCandidateById({ _id: id, scope_fields: ["complete_profile_status", "resume_file"] });
        const response = await getCandidateById({ _id: id, scope_fields: [] });
        const data = response.data;
        setresume_file(data.resume_file || "")
        setPercentage2(data.complete_profile_status)
        // Initialize AOS animations
        AOS.init({
          duration: 800,
          once: true,
        });

        

        const storedData = localStorage.getItem("assessmentSubmitResponse");
        if (storedData) {
          try {
            const data = JSON.parse(storedData);
          
            
            setResult(data.result);
            // For a number with two decimal places, truncated to 5 characters
            const formattedResult = Number(data.percentage).toFixed(2).slice(0, 5);
            setPercentage(formattedResult);
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        } else {
          console.warn("No assessment data found in localStorage");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const handleLogout = () => {
    clearSessionData();
    navigate("/");
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('filename', file);
      formData.append('old_resume_file', resume_file); // Adjust based on your needs
      if (candidateId) {
        formData.append('candidate_id', candidateId);
      }

      try {
        const response = await uploadResume(formData);
        setFlashMessage({ text: response.message, type: response.status ? 'success' : 'error' });
        setShowFlash(true);
        setTimeout(() => {
          setShowFlash(false);
          setFlashMessage({ text: '', type: '' });
          window.location.reload();
        }, 5000); 
      } catch (error) {
        setFlashMessage({
          text: error.response?.data?.message || "An error occurred while uploading the document.",
          type: 'error'
        });
        setShowFlash(true);
        setTimeout(() => {
          setShowFlash(false);
          setFlashMessage({ text: '', type: '' });
        }, 5000);
      }
    }
  };
  const renderScoreBox = () => {
    if (result === "Pass") {
      return (
        <>
          <div className="scorebox mb-4 assementscore">
            <div className="scorenumb" data-aos="zoom-in" data-aos-duration="3000">
              <CircularProgressbar
                value={percentage}
                text={`${percentage}%`}
                strokeWidth={10}
              />
            </div>
            <div className="scoretext">
              <h5>Great!!</h5>
              <p>Your assessment has been submitted for evaluation successfully.</p>
              <div className="dflexbtwn mt-3">
                <p className="scores">
                  You Scored - <span>{percentage}%</span>
                </p>
              </div>
              <div className="prflbtns mt-3">
                <a href="#" onClick={handleLogout} className="sitebtn comp_prfl">Sign Out</a>
              </div>
            </div>
          </div>

          <div className="scorebox mb-4">
            <div className="scorenumb" data-aos="zoom-in" data-aos-duration="3000">
              <CircularProgressbar
                value={percentage2}
                text={`${percentage2}%`}
                strokeWidth={10}
              />
            </div>
            <div className="scoretext">
              <h5>Complete Your Profile</h5>
              <p>Review your application form and fill in the required information.</p>
              <div className="prflbtns mt-3">
                <a href="/profile" className="sitebtn comp_prfl">Complete Your Profile</a>
                <div className="position-relative">
                  <button
                    className="sitebtn resumebtn"
                    type="button"
                    onClick={() => document.querySelector('input[type="file"]').click()}
                  >
                    <FileUploadOutlinedIcon /> I have the resume
                  </button>
                
                <div className="fileup_btnhide">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="application/pdf, image/*" // Adjust accepted file types
                  />
                </div>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    } else if (result === "Fail") {
      return (
        <div className="scorebox mb-4 assementscore failed">
          <div className="scorenumb" data-aos="zoom-in" data-aos-duration="3000">
            <CircularProgressbar
              value={percentage}
              text={`${percentage}%`}
              strokeWidth={10}
            />
          </div>
          <div className="scoretext">
            <h5>Alas!!</h5>
            <p>Your assessment has been submitted for evaluation successfully.</p>
            <div className="dflexbtwn mt-3">
              <p className="scores">
                You Scored - <span>{percentage}%</span>
              </p>
            </div>
            <p>Since you didn’t score as per our selection criteria, we cannot proceed further with your application right now.</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="maincontent">
      <div className="container">
        <div className="scorewrap animate__animated animate__fadeIn animate__slower">
          {renderScoreBox()}
          {showFlash && (
            <div className={`flash-message ${flashMessage.type}`}>
              {flashMessage.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Assessment_score;
