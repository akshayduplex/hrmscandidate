import React from "react";
import Job_cards from "./Job-cards";
import Top_banner from "./Top-banner";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { MdOutlineCurrencyRupee } from "react-icons/md";

import VerticalTabs from './Vertical-jobs';
import Job_description from './Job-description';

function Job_details() {
    const tabs = [
        { title: <Job_cards />, content: <Job_description /> },
        { title: <Job_cards />, content: <Job_description /> },
        { title: <Job_cards />, content: <Job_description /> },
    ];
    return (
        <>
            <Top_banner />

            <div className="container">

                <div className="joblist_display mt-4">
                    <div className="jobcounts dflexbtwn">
                        <h5><span>20</span> jobs openings in Engineering</h5>
                        <div className="filters">
                            <Form.Select aria-label="Default select example">
                                <option>Relevance</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </Form.Select>
                            <Form.Select aria-label="Default select example">
                                <option>Job Type</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </Form.Select>
                            <InputGroup>
                                <InputGroup.Text><MdOutlineCurrencyRupee /></InputGroup.Text>
                                <Form.Select defaultValue="Choose...">
                                    <option>3 lpa - 5 lpa</option>
                                    <option>6 lpa - 8 lpa</option>
                                    <option>8 lpa - 10 lpa</option>
                                </Form.Select>
                            </InputGroup>
                            <Form.Select aria-label="Default select example">
                                <option value="1">7 days</option>
                                <option value="2">15 days</option>
                                <option value="3">30 days</option>
                            </Form.Select>
                        </div>
                    </div>
                    <div className="row">

                        <VerticalTabs tabs={tabs} />
                    </div>
                </div>
            </div>
        </>
    );
}
export default Job_details;