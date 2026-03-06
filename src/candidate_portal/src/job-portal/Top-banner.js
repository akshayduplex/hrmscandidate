import React from "react";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import InputGroup from 'react-bootstrap/InputGroup';

function Top_banner() {
    return (
        <>
            <div className="container-fluid topbanner">
                <div className="container">
                    <div className="jobbanner">
                        <h4>Find Job on HLFPPT</h4>
                        <p className="my-4">Search Jobs opening for which we are hiring right now.</p>
                        <Form>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formGridAddress1">
                                    <div className="selectflex">
                                        <InputGroup>
                                            <InputGroup.Text>What</InputGroup.Text>
                                            <Form.Select defaultValue="Choose...">
                                                <option>Engineering</option>
                                                <option>Management</option>
                                                <option>HR</option>
                                            </Form.Select>
                                        </InputGroup>
                                        <InputGroup>
                                            <InputGroup.Text id="inputGroup-sizing-lg">Where</InputGroup.Text>
                                            <Form.Control aria-label="Large" aria-describedby="inputGroup-sizing-sm" />
                                        </InputGroup>
                                        <Button className="sitebtn jobsearch bgblue" type="submit">
                                            Find Jobs
                                        </Button>
                                    </div>
                                </Form.Group>
                            </Row>
                        </Form>
                    </div>
                </div>
            </div>
            </>
    )
}
export default Top_banner;