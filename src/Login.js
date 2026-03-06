import React, { useState } from "react";
import logo from './images/logo.png'
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import OTPBox from "./Components/Otp";

const Login = () => {
  const [firstDivVisible, setFirstDivVisible] = useState(true);
  const [secondDivVisible, setSecondDivVisible] = useState(false);
  const [className, setClassName] = useState('');



  const showSecondDiv = () => {
    setFirstDivVisible(false);
    setSecondDivVisible(true); 
    setClassName('highlight');
  };
 
  return (
    <>
      <div className="container">
        <div className="loginwrapper">
          <div className={`logincard ${className}`}>
            <div className="leftlogin">
              <img src={logo} alt="logo" />
              <h5>Candidate Assessment Portal</h5>
            </div>
            <div className="rightlogin">
              <h3>Candidate Login</h3>
              {firstDivVisible && (
                <Form className="logform">
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Enter Email ID</Form.Label>
                    <div className="inputwrp">
                      <Form.Control type="email" placeholder="xyz@gmail.com" />
                      <MailOutlineIcon />
                    </div>
                  </Form.Group>
                  <Button onClick={showSecondDiv} className="mt-4 formbtn btnright" variant="primary" type="submit">
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
              <li><a href="/">Help</a></li>
              <li><a href="/">Privacy</a></li>
              <li><a href="/">Terms</a></li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
