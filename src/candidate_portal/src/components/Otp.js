import React, { useState, useEffect } from "react";
import ReplayIcon from '@mui/icons-material/Replay';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { setSessiontData } from "../helper/My_Helper"; 
import { loginWithEmail, verifyLoginOtp } from "../helper/Api_Helper";
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const OTPBox = () => {
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [verified, setVerified] = useState(false);
  const [text, setText] = useState('Verify');
  const [flashMessage, setFlashMessage] = useState({ text: '', type: '' });
  const [showFlash, setShowFlash] = useState(false);
  const newpage = useNavigate();
  const [timer, setTimer] = useState(30);
  const [showReplay, setShowReplay] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let intervalId;
    if (timer > 0) {
      intervalId = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else {
      setShowReplay(true); // Show ReplayIcon when timer reaches 0
    }

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [timer]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.nextSibling) {
      element.nextSibling.focus();
    }

    setVerified(newOtp.every((digit) => digit !== ""));
  };
 
  const handleClick = async () => {
    setIsSubmitting(true);
    if (verified) {
      const otpCode = otp.join('');
      const emailId = sessionStorage.getItem('emailId');
      try {
        const res = await verifyLoginOtp({ email_id: emailId, otp: otpCode, login_device: 'web' });
        if (res.status) {
          let pendingActivity = res.data;
          const pendingStep = pendingActivity.page_steps.find(step => step.status === 'pending');
            if (pendingStep) {
                // Store the pendingStep data in localStorage
                setSessiontData('pendingActivity', pendingStep);
            }
          setSessiontData('loginData', res.data);
          setText('Verified');
          setFlashMessage({ text: 'OTP verified successfully!', type: 'success' });
          setShowFlash(true);
          setIsSubmitting(false);
          setTimeout(() => {
            newpage("/application-form");
          }, 1000);
        } else {
          setFlashMessage({ text: res.message, type: 'error' });
          setShowFlash(true);
          setIsSubmitting(false);
        }
      } catch (error) {
        setFlashMessage({ text: "OTP verification failed. Please try again.", type: 'error' });
        setShowFlash(true);
        setIsSubmitting(false);
      }
      setTimeout(() => {
        setShowFlash(false);
        setFlashMessage({ text: '', type: '' });
      }, 5000);
    }
  };
  const handleResend = async () => {
    const emailId = sessionStorage.getItem('emailId');
    try {
      // Assuming there's an endpoint for resending OTP
      const res = await loginWithEmail({ email_id: emailId });
      if (res.status) {
            // Reset the timer and hide the ReplayIcon
            setTimer(60);
            setShowReplay(false);
            // Set a flash message
            setFlashMessage({ text: res.message, type: 'success' });
            setShowFlash(true);
            // Hide the flash message after 5 seconds
            setTimeout(() => {
                setShowFlash(false);
                setFlashMessage({ text: '', type: '' });
            }, 5000);
      }else{
            // Reset the timer and hide the ReplayIcon
            setTimer(60);
            setShowReplay(false);
            // Set a flash message
            setFlashMessage({ text: res.message, type: 'success' });
            setShowFlash(true);
            // Hide the flash message after 5 seconds
            setTimeout(() => {
                setShowFlash(false);
                setFlashMessage({ text: '', type: '' });
            }, 5000);
      }
    } catch (error) {
      setFlashMessage({ text: "Failed to resend OTP. Please try again.", type: 'error' });
      setShowFlash(true);
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
      <Form className="logform">
        <Form.Label>Enter OTP sent to your email ID</Form.Label> <br />
        {otp.map((data, index) => (
          <input
            className="otp-field"
            type="text"
            name="otp"
            maxLength="1"
            key={index}
            value={data}
            onChange={e => handleChange(e.target, index)}
            onFocus={e => e.target.select()}
          />
        ))}
         <p className="resend mt-3">
          Resend in <span className="timer">{timer} sec {showReplay && <ReplayIcon onClick={handleResend} style={{ cursor: 'pointer' }} />}</span>
        </p>
        <div className="btnright btnicon mt-4">
          {text === "Verified" ? <CheckCircleIcon /> : null}
          <Button onClick={handleClick} className="formbtn" variant="primary" disabled={isSubmitting}>{text}</Button>
        </div>
      </Form>
    </>
  );
};
export default OTPBox;
