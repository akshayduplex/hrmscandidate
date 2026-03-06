import React, { useState } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import DateRangeIcon from '@mui/icons-material/DateRange';

function RepeatsExperience() {
    const [isChecked, setIsChecked] = useState(false);
    const [className, setClassName] = useState('');


    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
        setClassName('enddate');
    };


    const [fileFields, setFileFields] = useState([{ id: 0, file: null }]);
    // Function to handle adding a new file input field
    const handleAddFileField = () => {
        setFileFields([...fileFields, { id: fileFields.length, file: null }]);
    };

    // Function to handle removing a file input field
    const handleRemoveFileField = (id) => {
        setFileFields(fileFields.filter((field) => field.id !== id));
    };



    return (
        <>
            {fileFields.map((field) => (
                <div className={`experienceblock-${field.id}`} key={field.id}>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridEmail">
                            <Form.Label>Designation</Form.Label>
                            <Form.Control type="text" placeholder="Enter name" />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridPassword">
                            <Form.Label>Company Name</Form.Label>
                            <Form.Control type="text" placeholder="awasthi.anshul1997@gmail.com" />
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridCity">
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control type="date" placeholder="dd/mm/yyyy" />
                            <DateRangeIcon />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridCity" className={`${className}`}>
                            <Form.Label>End Date</Form.Label>
                            <Form.Control type="date" placeholder="dd/mm/yyyy" />
                            <DateRangeIcon />
                        </Form.Group>
                    </Row>
                    <Form.Group className="mb-3 currentlywork">
                        <Form.Check type="checkbox"
                            id="formcheck"
                            checked={isChecked}
                            label="I currently work here"
                            onChange={handleCheckboxChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGridAddress1">
                        <Form.Label>Responsibilities</Form.Label>
                        <textarea placeholder="Enter brief about the kind of projects you have done"></textarea>
                    </Form.Group>
                    <div className="appendmore removebtn mt-3">
                        <button className='' type='button' onClick={() => handleRemoveFileField(field.id)}>- Remove Experience</button>
                    </div>
                </div>

            ))}
            <div className="appendmore mt-3">
                <button type='button' onClick={handleAddFileField}>+ Add Experience</button>
            </div>
        </>
    );
}


export default RepeatsExperience;

