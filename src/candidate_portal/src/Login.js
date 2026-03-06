import React, { useEffect, useState } from "react";
// import logo from './images/logo.png';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { loginWithEmail } from "./helper/Api_Helper";
import OTPBox from "./components/Otp";
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import config from "../../Config/Config";
import { useSelector } from "react-redux";
 
const Login = () => {

  const [logo, setLogo] = useState('');

  const webSetting = useSelector(state => state.jobs.webSettingData);

  // useEffect(() => {
  //     dispatch(ConfigrationSetting({ domain: config.FRONT_URL }))
  // }, [dispatch])

  useEffect(() => {
      if (webSetting && webSetting?.data?.logo_image) {
          setLogo(webSetting?.data?.logo_image);
      }
  }, [webSetting]);


  const [emailId, setemailId] = useState("");
  const [firstDivVisible, setFirstDivVisible] = useState(true);
  const [secondDivVisible, setSecondDivVisible] = useState(false);
  const [className, setClassName] = useState('');
  const [flashMessage, setFlashMessage] = useState({ text: '', type: '' });
  const [showFlash, setShowFlash] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showSecondDiv = () => {
    setFirstDivVisible(false);
    setSecondDivVisible(true); 
    setClassName('highlight');
  };
 


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const postData = { email_id: emailId };

    if (emailId.length > 0) {
      try {
        const res = await loginWithEmail(postData);
        if (res.status) {
          // Store email ID in sessionStorage
          sessionStorage.setItem('emailId', emailId);
          // Set flash message
          setFlashMessage({ text: res.message, type: 'success' });
          setShowFlash(true);
          // Show second div
          showSecondDiv();
          // Hide the message after 5 seconds
          setTimeout(() => {
            setShowFlash(false);
            setFlashMessage({ text: '', type: '' });
          }, 5000);
        } else {
          setFlashMessage({ text: "An error occurred, please try again.", type: 'error' });
          setShowFlash(true);setIsSubmitting(false);
          setTimeout(() => {
            setShowFlash(false);
            setFlashMessage({ text: '', type: '' });
          }, 5000);
        }
      } catch (e) {
        setFlashMessage({ text: "An error occurred, please try again.", type: 'error' });
        setShowFlash(true);
        setTimeout(() => {
          setShowFlash(false);
          setFlashMessage({ text: '', type: '' });
        }, 5000);
      } finally {
        setIsSubmitting(false); // Reset submitting state
      }
    } else {
      setFlashMessage({ text: "Please enter a valid email address", type: 'error' });
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
      <div className="container">
        <div className="loginwrapper">
          <div className={`logincard ${className}`}>
            <div className="leftlogin">
              <img src={config.IMAGE_PATH + logo} alt="logo" />
              <h5>Candidate Assessment Portal</h5>
            </div>
            <div className="rightlogin">
              <h3>Candidate Login</h3>
              {firstDivVisible && (
                <Form className="logform" onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Enter Email ID</Form.Label>
                    <div className="inputwrp">
                      <Form.Control type="email" onChange={(e) => setemailId(e.target.value)} value={emailId} placeholder="xyz@gmail.com" />
                      <MailOutlineIcon />
                    </div>
                  </Form.Group>
                  <Button className="mt-4 formbtn btnright" variant="primary" type="submit" disabled={isSubmitting}>
                    Login
                  </Button>
                </Form>

              )}
              {secondDivVisible && (
                <OTPBox />
              )}
            </div>
          </div>
          <div className="sitelinks"> 
            <ul>
              <li><a href={`/`}>Home</a></li>
              <li><a href={`/privacy-policy`}>Privacy</a></li>
              <li><a href={`/terms-conditions`}>Terms</a></li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
