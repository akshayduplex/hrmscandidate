import React, { useState, useEffect } from "react";
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import FileUpload from "./FileUpload";
import InputGroup from 'react-bootstrap/InputGroup';
import ProfileSubmit from "./ProfileSubmit";
import AOS from 'aos';
import RepeatsEducation from "./RepeatEducation";
import RepeatsExperience from "./RepeatExperience";
import DateRangeIcon from '@mui/icons-material/DateRange';

const Profile = () => {

    const [firstDivVisible, setFirstDivVisible] = useState(true);
    const [secondDivVisible, setSecondDivVisible] = useState(false);

    const showSecondDiv = () => {
        setFirstDivVisible(false);
        setSecondDivVisible(true);
    };

    useEffect(() => {
        AOS.init({
            // Global settings
            duration: 800, // animation duration
            once: false, // whether animation should happen only once - while scrolling down
        });
    }, []); // run only once after initial render


    return (
        <>
            {firstDivVisible && (
                <div className="maincontent">
                    <div className="container animate__animated animate__fadeIn animate__slower">
                        <div className="contentwrap ">
                            <div className="contentbox w100">
                                <div className="contenthdr d-block">
                                    <p> <KeyboardBackspaceOutlinedIcon /> </p>
                                    <h4>Review Application</h4>
                                </div>
                                <div className="profileform">
                                    <Form>
                                        <div className="profl-block resumwrap" data-aos="fade-up" data-aos-duration="2500">
                                            <div className="dflexbtwn">
                                                <h5>1. Resume</h5>
                                                <CheckCircleIcon />
                                            </div>
                                        </div>
                                        <div className="profl-block formwrap" data-aos="fade-up" data-aos-duration="2500">
                                            <h5>2. Personal Information</h5>
                                            <Row className="mb-3">
                                                <Form.Group as={Col} controlId="formGridEmail">
                                                    <Form.Label>Your Photo</Form.Label>
                                                    <FileUpload />
                                                </Form.Group>
                                            </Row>
                                            <Row className="mb-3">
                                                <Form.Group as={Col} controlId="formGridEmail">
                                                    <Form.Label>Name</Form.Label>
                                                    <Form.Control type="text" placeholder="Enter name" />
                                                </Form.Group>
                                                <Form.Group as={Col} controlId="formGridPassword">
                                                    <Form.Label>Email ID</Form.Label>
                                                    <Form.Control type="email" placeholder="awasthi.anshul1997@gmail.com" />
                                                </Form.Group>
                                            </Row>
                                            <Row className="mb-3">
                                                <Form.Group as={Col} controlId="formGridAddress1">
                                                    <Form.Label>Mobile Number</Form.Label>
                                                    <Form.Control placeholder="+91-91011010000" />
                                                </Form.Group>

                                                <Form.Group as={Col} controlId="formGridAddress2">
                                                    <Form.Label>Current Employer</Form.Label>
                                                    <Form.Control placeholder="abc pvt. ltd." />
                                                </Form.Group>
                                            </Row>
                                            <Row className="mb-3">
                                                <Form.Group as={Col} controlId="formGridAddress1">
                                                    <Form.Label>Current Designation</Form.Label>
                                                    <Form.Control placeholder="Frontend Developer" />
                                                </Form.Group>

                                                <Form.Group as={Col} controlId="formGridAddress2">
                                                    <Form.Label>Location</Form.Label>
                                                    <Form.Control placeholder="Noida" />
                                                </Form.Group>
                                            </Row>
                                            <Row className="mb-3">
                                                <Form.Group as={Col} controlId="formGridAddress1">
                                                    <Form.Label>Total Experience</Form.Label>
                                                    <div className="selectflex">
                                                        <InputGroup>
                                                            <Form.Select defaultValue="Choose...">
                                                                <option>0</option>
                                                                <option>1</option>
                                                                <option>2</option>
                                                                <option>3</option>
                                                                <option>4</option>
                                                            </Form.Select>
                                                            <InputGroup.Text>Years</InputGroup.Text>
                                                        </InputGroup>
                                                        <InputGroup>
                                                            <Form.Select defaultValue="Choose...">
                                                                <option>0</option>
                                                                <option>1</option>
                                                                <option>2</option>
                                                                <option>3</option>
                                                                <option>4</option>
                                                            </Form.Select>
                                                            <InputGroup.Text>Months</InputGroup.Text>
                                                        </InputGroup>
                                                    </div>
                                                </Form.Group>

                                                <Form.Group as={Col} controlId="formGridAddress2">
                                                    <Form.Label>Relevant Experience</Form.Label>
                                                    <div className="selectflex">
                                                        <InputGroup>
                                                            <Form.Select defaultValue="Choose...">
                                                                <option>0</option>
                                                                <option>1</option>
                                                                <option>2</option>
                                                                <option>3</option>
                                                                <option>4</option>
                                                            </Form.Select>
                                                            <InputGroup.Text>Years</InputGroup.Text>
                                                        </InputGroup>
                                                        <InputGroup>
                                                            <Form.Select defaultValue="Choose...">
                                                                <option>0</option>
                                                                <option>1</option>
                                                                <option>2</option>
                                                                <option>3</option>
                                                                <option>4</option>
                                                            </Form.Select>
                                                            <InputGroup.Text>Months</InputGroup.Text>
                                                        </InputGroup>
                                                    </div>
                                                </Form.Group>
                                            </Row>
                                            <Row className="mb-3">
                                                <Form.Group as={Col} controlId="formGridCity">
                                                    <Form.Label>Current CTC</Form.Label>
                                                    <Form.Control />
                                                </Form.Group>
                                                <Form.Group as={Col} controlId="formGridCity">
                                                    <Form.Label>Expected CTC</Form.Label>
                                                    <Form.Control />
                                                </Form.Group>
                                            </Row>
                                            <Row className="mb-3">
                                                <Form.Group as={Col} controlId="formGridCity">
                                                    <Form.Label>Notice Period</Form.Label>
                                                    <div className="selectflex">
                                                        <InputGroup>
                                                            <Form.Select defaultValue="Choose...">
                                                                <option>10</option>
                                                                <option>15</option>
                                                                <option>30</option>
                                                                <option>45</option>
                                                            </Form.Select>
                                                            <InputGroup.Text>Days</InputGroup.Text>
                                                        </InputGroup>
                                                    </div>
                                                </Form.Group>
                                                <Form.Group as={Col} controlId="formGridCity">
                                                    <Form.Label>Last working day (In case of Serving)</Form.Label>
                                                    <Form.Control type="date" placeholder="dd/mm/yyyy" />
                                                    <DateRangeIcon />
                                                </Form.Group>
                                            </Row>
                                            <Row className="mb-3">
                                                <Form.Group as={Col} controlId="formGridCity">
                                                    <Form.Label>Applied from</Form.Label>
                                                    <Form.Select defaultValue="Choose...">
                                                        <option>Choose...</option>
                                                        <option>...</option>
                                                    </Form.Select>
                                                </Form.Group>
                                                <Form.Group as={Col} controlId="formGridCity">
                                                    <Form.Label>Reference Employee (if any)</Form.Label>
                                                    <Form.Control />
                                                </Form.Group>
                                            </Row>

                                        </div>
                                        <div className="profl-block formwrap" data-aos="fade-up" data-aos-duration="2500">
                                            <h5>3. Experience</h5>

                                            <RepeatsExperience />
                                        </div>

                                        <div className="profl-block formwrap" data-aos="fade-up" data-aos-duration="2500">
                                            <h5>4. Education</h5>
                                            <RepeatsEducation />
                                        </div>
                                        <div className="profl-block formwrap" data-aos="fade-up" data-aos-duration="2500">
                                            <h5>5. Other</h5>
                                            <Form.Group className="mb-3" controlId="formGridAddress1">
                                                <Form.Label>Cover Letter</Form.Label>
                                                <textarea placeholder="Write your cover letter"></textarea>
                                            </Form.Group>
                                            <Row className="mb-3">
                                                <Form.Group as={Col} controlId="formGridEmail">
                                                    <Form.Label>LinkedIn  Profile</Form.Label>
                                                    <Form.Control type="text" placeholder="Enter LinkedIn  Profile" />
                                                </Form.Group>
                                                <Form.Group as={Col} controlId="formGridPassword">
                                                    <Form.Label>Facebook  Profile</Form.Label>
                                                    <Form.Control type="text" placeholder="Enter Facebook  Profile" />
                                                </Form.Group>
                                            </Row>
                                        </div>
                                        <div className="finalsubmit">
                                            <Button onClick={showSecondDiv} className="sitebtn profilesub" type="submit">
                                                Submit
                                            </Button>
                                        </div>
                                    </Form>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {secondDivVisible && (
                <div className="maincontent">
                    <div className="container" data-aos="fade-in" data-aos-duration="3000">
                        <ProfileSubmit />
                    </div>
                </div>
            )}
        </>
    )
}


export default Profile;
