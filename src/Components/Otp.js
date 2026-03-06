import React, { useState } from "react";
import ReplayIcon from '@mui/icons-material/Replay';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
const OTPBox = () => {
    const [otp, setOtp] = useState(new Array(4).fill(""));
    const [verified, setVerified] = useState(false);
    const newpage = useNavigate();
    const [text, setText] = useState('Verify');

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        // const newOtp = setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);
        //Focus next input
        if (element.nextSibling) {
            element.nextSibling.focus();
        }
        // Check if all OTP digits are filled
        if (newOtp.every((digit) => digit !== "")) {
            setVerified(true);
        } else {
            setVerified(false);
        }
    };



    const handleClick = () => {
        if (verified) {
            // Change the text when the button is clicked 

            setText('Verified');
            
            // Navigate to new page
            setTimeout(() => {
                newpage("/");
            }, 1000);
        }
    };

    return (
        <>
            <Form className="logform">
                <Form.Label>Enter OTP sent to your email ID</Form.Label>  <br />
                {otp.map((data, index) => {
                    return (
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
                    );
                })}
                <p className="resend mt-3">Resend in <span className="timer">30 sec <ReplayIcon /> </span> </p>
                <div className="btnright btnicon mt-4 ">
                 {text === "Verified" ?  <CheckCircleIcon /> : null }
                   
                    <Button onClick={handleClick} className="formbtn" variant="primary"> {text} </Button>
                </div>
            </Form>
        </>
    );
};

export default OTPBox;