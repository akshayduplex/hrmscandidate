import React, { useState, useEffect } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { formatDate } from "../helper/My_Helper";

function Repeats_experience({ formData, handleInputChange }) {
    const getCurrentDate = () => {
        const date = new Date();
        return date.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD
    };
   
    const defaultExperience = [
        { designation: '', company: '', from_date: getCurrentDate(), to_date: getCurrentDate(), responsibility: '', is_currently_working: 'No' }
    ];
    const [fileFields, setFileFields] = useState(formData.experience || defaultExperience);

    useEffect(() => {
        if (!formData.experience || formData.experience.length === 0) {
            setFileFields(defaultExperience);
            handleInputChange({ experience: defaultExperience });
        } else {
            setFileFields(formData.experience);
        }
    }, [formData.experience]);

    const handleCheckboxChange = (fieldId) => {
        setFileFields(prevFields => {
            const updatedFields = prevFields.map((field, index) =>
                index === fieldId
                    ? { ...field, is_currently_working: field.is_currently_working === "Yes" ? "No" : "Yes" }
                    : field
            );
            handleInputChange({ experience: updatedFields });
            return updatedFields;
        });
    };

    // const handleAddFileField = () => {
    //     const newField = { designation: '', company: '', from_date: '', to_date: '', responsibility: '', is_currently_working: 'No' };
    //     setFileFields([...fileFields, newField]);
    //     handleInputChange({ experience: [...fileFields, newField] });
    // };
    const handleAddFileField = () => {
        const newField = { designation: '', company: '', from_date: getCurrentDate(), to_date: getCurrentDate(), responsibility: '', is_currently_working: 'No' };
        setFileFields([...fileFields, newField]);
        handleInputChange({ experience: [...fileFields, newField] });
    };

    const handleRemoveFileField = (fieldIndex) => {
        const updatedFields = fileFields.filter((_, index) => index !== fieldIndex);
        setFileFields(updatedFields);
        handleInputChange({ experience: updatedFields });
    };

    const handleFieldChange = (e, fieldIndex, fieldName) => {
        const { value } = e.target;
        const updatedFields = fileFields.map((field, index) =>
            index === fieldIndex ? { ...field, [fieldName]: value } : field
        );
        setFileFields(updatedFields);
        handleInputChange({ experience: updatedFields });
    };

    return (
        <>
            {fileFields.map((field, index) => (
                <div className={`experienceblock-${index}`} key={index}>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId={`designation-${index}`}>
                            <Form.Label>Designation</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter designation"
                                value={field.designation}
                                // onChange={(e) => handleFieldChange(e, index, 'designation')}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const regex = /^[a-zA-Z\s]*$/; // Allows only letters and spaces
                                    if (!regex.test(value)) {
                                        return; // Do not update state if input contains non-letter characters
                                    }
                                    handleFieldChange(e, index, 'designation');
                                }}
                            />
                        </Form.Group>
                        <Form.Group as={Col} controlId={`company-${index}`}>
                            <Form.Label>Company Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter company name"
                                value={field.company}
                                // onChange={(e) => handleFieldChange(e, index, 'company')}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const regex = /^[a-zA-Z\s]*$/; // Allows only letters and spaces
                                    if (!regex.test(value)) {
                                        return; // Do not update state if input contains non-letter characters
                                    }
                                    handleFieldChange(e, index, 'company');
                                }}
                            />
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId={`from_date-${index}`}>
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={formatDate(field.from_date)}
                                onChange={(e) => handleFieldChange(e, index, 'from_date')}
                            />
                            <DateRangeIcon />
                        </Form.Group>
                        <Form.Group as={Col} controlId={`to_date-${index}`}>
                            <Form.Label>End Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={formatDate(field.to_date)}
                                onChange={(e) => handleFieldChange(e, index, 'to_date')}
                                disabled={field.is_currently_working === "Yes"}
                            />
                            <DateRangeIcon />
                        </Form.Group>
                    </Row>
                    <Form.Group className="mb-3 currentlywork">
                        <Form.Check
                            type="checkbox"
                            id={`checkbox-${index}`}
                            checked={field.is_currently_working === "Yes"}
                            label="I currently work here"
                            onChange={() => handleCheckboxChange(index)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId={`responsibility-${index}`}>
                        <Form.Label>Responsibility</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter brief about the kind of projects you have done"
                            value={field.responsibility}
                            onChange={(e) => handleFieldChange(e, index, 'responsibility')}
                        />
                    </Form.Group>
                    <div className="appendmore removebtn mt-3">
                        <button type="button" onClick={() => handleRemoveFileField(index)}>- Remove Experience</button>
                    </div>
                </div>
            ))}
            <div className="appendmore mt-3">
                <button type="button" onClick={handleAddFileField}>+ Add Experience</button>
            </div>
        </>
    );
}

export default Repeats_experience;
