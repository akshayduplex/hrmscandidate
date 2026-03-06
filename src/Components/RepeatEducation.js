import React, { useState } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import DateRangeIcon from '@mui/icons-material/DateRange';

function RepeatsEducation() {
    const [fileFields, setFileFields] = useState([{ id: 0, file: null }]);
    // Function to handle adding a new file input field
    const handleAddFileField = () => {
        setFileFields([...fileFields, { id: fileFields.length , file: null }]);
    };

    // Function to handle removing a file input field
    const handleRemoveFileField = (id) => {
        setFileFields(fileFields.filter((field) => field.id !== id));
    };



    return (
        <>
            {fileFields.map((field) => (
                <div className={`educationblock-${field.id}`}  key={field.id}>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridEmail">
                            <Form.Label>Institute Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter name" />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridPassword">
                            <Form.Label>Degree</Form.Label>
                            <Form.Select defaultValue="Choose...">
                                <option>Choose...</option>
                                <option>...</option>
                            </Form.Select>
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridCity">
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control type="date" placeholder="dd/mm/yyyy" />
                            <DateRangeIcon />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridCity">
                            <Form.Label>End Date</Form.Label>
                            <Form.Control type="date" placeholder="dd/mm/yyyy" />
                            <DateRangeIcon />
                        </Form.Group>
                    </Row>
                    <div className="appendmore removebtn mt-3">
                        <button className='' type='button' onClick={() => handleRemoveFileField(field.id)}>- Remove Education</button>
                    </div>
                </div>

            ))}
            <div className="appendmore mt-3">
                <button type='button' onClick={handleAddFileField}>+ Add Education</button>
            </div>
        </>
    );
}


export default RepeatsEducation;

