import React, { useState, useEffect } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { getEducationList } from '../helper/Api_Helper';
import { formatDate } from "../helper/My_Helper";

const RepeatsEducation = ({ formData, handleInputChange }) => {

    const getCurrentDate = () => {
        const currentDate = new Date();
        return currentDate.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
    };

    const defaultEducation = [
        {
            id: Date.now(),
            degree: '',
            degreeOptions: [],
            institute: '',
            from_date: getCurrentDate(),
            to_date: getCurrentDate()
        }
    ];


    const initializeEducation = (education) => {
        return education.length > 0 ? education.map(item => ({
            ...item,
            degreeOptions: item.degreeOptions || []  // Ensure degreeOptions is always an array
        })) : defaultEducation;
    };

    const [fileFields, setFileFields] = useState(formData.education || []);
    const [debounceTimeout, setDebounceTimeout] = useState(null);

    useEffect(() => {
        setFileFields(initializeEducation(formData.education || []));
    }, [formData.education]);

    // Fetch degree suggestions from API
    const fetchdegrees = async (query, fieldId) => {
        if (query.length < 2) {
            return;
        }

        try {
            const response = await getEducationList(query);
            const degreeOptions = response.data.map(option => option.name) || [];
            setFileFields(prevFields => prevFields.map(field =>
                field.id === fieldId ? { ...field, degreeOptions } : field
            ));
        } catch (error) {
            console.error('Error fetching degree data', error);
        }
    };

    const handledegreeChange = (value, fieldId) => {
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        setDebounceTimeout(setTimeout(() => {
            fetchdegrees(value, fieldId);
        }, 300));
        
        setFileFields(prevFields => prevFields.map(field =>
            field.id === fieldId ? { ...field, degree: value } : field
        ));

        // Update formData
        handleInputChange({
            education: fileFields.map(field =>
                field.id === fieldId ? { ...field, degree: value } : field
            )
        });
    };

    const handleAddFileField = () => {
        //const newField = { id: Date.now(), degree: '', degreeOptions: [], institute: '', from_date: '', to_date: '' };
        const newField = {
            id: Date.now(),
            degree: '',
            degreeOptions: [],
            institute: '', 
            from_date: getCurrentDate(),
            to_date: getCurrentDate()
        };
        setFileFields([...fileFields, newField]);

        // Update formData
        handleInputChange({
            education: [...fileFields, newField]
        });
    };

    const handleRemoveFileField = (fieldId) => {
        const updatedFields = fileFields.filter(field => field.id !== fieldId);
        setFileFields(updatedFields);

        // Update formData
        handleInputChange({
            education: updatedFields
        });
    };

    const handledegreeSelect = (degree, id) => {
        const updatedFields = fileFields.map(field =>
            field.id === id ? { ...field, degree: degree, degreeOptions: [] } : field
        );
        setFileFields(updatedFields);

        // Update formData
        handleInputChange({ education: updatedFields });
    };

    const handleFieldChange = (e, fieldId, fieldName) => {
        const { value } = e.target;
        const updatedFields = fileFields.map(field =>
            field.id === fieldId ? { ...field, [fieldName]: value } : field
        );
        setFileFields(updatedFields);

        // Update formData
        handleInputChange({ education: updatedFields });
    };

    return (
        <>
            {fileFields.map((field, index) => (
                <div className={`educationblock-${field.id}`} key={field.id}>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId={`institute-${field.id}`}>
                            <Form.Label>Institute Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter name"
                                value={field.institute}
                                // onChange={(e) => handleFieldChange(e, field.id, 'institute')}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const regex = /^[a-zA-Z\s]*$/; // Allows only letters and spaces
                                    if (!regex.test(value)) {
                                        return; // Do not update state if input contains non-letter characters
                                    }
                                    handleFieldChange(e, field.id, 'institute');
                                }}
                            />
                        </Form.Group>
                        <Form.Group as={Col} controlId={`degree-${field.id}`}>
                            <Form.Label>Degree</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter degree"
                                value={field.degree}
                                onChange={(e) => handledegreeChange(e.target.value, field.id)}
                            />
                            {field.degreeOptions.length > 0 && (
                                <ul className="degree-options">
                                    {field.degreeOptions.map((option) => (
                                        <li key={index} onClick={() => handledegreeSelect(option, field.id)}>
                                            {option}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId={`from_date-${field.id}`}>
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={formatDate(field.from_date)}
                                onChange={(e) => handleFieldChange(e, field.id, 'from_date')}
                            />
                            <DateRangeIcon />
                        </Form.Group>
                        <Form.Group as={Col} controlId={`to_date-${field.id}`}>
                            <Form.Label>End Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={formatDate(field.to_date)}
                                onChange={(e) => handleFieldChange(e, field.id, 'to_date')}
                            />
                            <DateRangeIcon />
                        </Form.Group>
                    </Row>
                    <div className="appendmore removebtn mt-3">
                        <button type="button" onClick={() => handleRemoveFileField(field.id)}>- Remove Education</button>
                    </div>
                </div>
            ))}
            <div className="appendmore mt-3">
                <button type="button" onClick={handleAddFileField}>+ Add Education</button>
            </div>
        </>
    );
};

export default RepeatsEducation;
