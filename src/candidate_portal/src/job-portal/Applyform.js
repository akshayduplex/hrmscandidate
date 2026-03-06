import React from "react";
// import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import FileUpload from "../components/File-upload";
import InputGroup from 'react-bootstrap/InputGroup';
import DateRangeIcon from '@mui/icons-material/DateRange';

const Applyform = () => {


    return (
        <>
            <div className="container">
                <div className="contentwrap">
                    <div className="applyform profileform">
                        <h4>Complete few Information to apply for this job</h4>
                        <Form>
                            <div className="formwrap">
                                <h5>1. Upload Resume</h5>
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formGridEmail">
                                        <FileUpload />
                                    </Form.Group>
                                </Row>
                                <h5>2. Personal Information</h5>
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
                                                <Form.Select>
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
                                        <Form.Label>Hear from</Form.Label>
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

                            <div className="finalsubmit">
                                <Button className="sitebtn profilesub" type="submit">
                                    Submit
                                </Button>
                            </div>
                        </Form>

                    </div>
                </div>
            </div>
        </>
    )
}


export default Applyform;
