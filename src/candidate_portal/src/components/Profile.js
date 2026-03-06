import React, { useState, useEffect } from "react";
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import InputGroup from 'react-bootstrap/InputGroup';
import AOS from 'aos';
import RepeatsEducation from "./Repeat_education";
import RepeatsExperience from "./Repeat_experience";
import DateRangeIcon from '@mui/icons-material/DateRange';
import { getLocationList, getDesignationList, getAppliedFromList, editProfile, getCandidateById } from "../helper/Api_Helper";
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import ProfileSubmit from "./Profile_submit";
import { getCandidateId, formatDate, imgUrl } from "../helper/My_Helper";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const [firstDivVisible, setFirstDivVisible] = useState(true);

    const [secondDivVisible, setSecondDivVisible] = useState(false);
    const [locationOptions, setLocationOptions] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [designationOptions, setDesignationOptions] = useState([]);
    const [appliedfromOptions, setAppliedfromOptions] = useState([]);
    const [showDocument , setShowDocument] = useState(false);

    console.log(setSecondDivVisible , setShowDocument);

    // const [inputValue, setInputValue] = useState('');
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);
    const [flashMessage, setFlashMessage] = useState({ text: '', type: '' });
    const [showFlash, setShowFlash] = useState(false);
    const [errors, setErrors] = useState({});


    function extractExperience(experienceString) {
        const regex = /(\d+)\s*Year\(s?\)?(?:\s*(\d+)\s*Month)?/;
        const match = experienceString.match(regex);

        if (match) {
            const years = parseInt(match[1], 10);
            const months = match[2] ? parseInt(match[2], 10) : 0;
            return [years, months];
        }

        return [0, 0];
    }

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile_no: "",
        current_employer: "",
        location: "",
        total_experience_years: 0,
        total_experience_months: "",
        relevant_experience_years: "",
        relevant_experience_months: "",
        designation: "",
        current_ctc: "",
        expected_ctc: "",
        notice_period: "",
        last_working_day: "",
        applied_from: "",
        reference_employee: "",
        experience: [],
        education: [],
        old_photo_file: "",
        filename: "",
        other: "",
        linkedin: "",
        facebook: "",
        assessment_apply_status: ''
    });

    const validateForm = () => {
        const errors = {};

        if (!formData.name.trim()) {
            errors.name = "Name is required";
        }
        if (!formData.location.trim()) {
            errors.location = "Location is required";
        }
        if (!formData.mobile_no.trim() || !/^\+?\d{10,15}$/.test(formData.mobile_no)) {
            errors.mobile_no = "Valid mobile number is required";
        }

        return errors;
    };

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: false,
        });
        const fetchCandidateData = async () => {
            try {

                const response = await getCandidateById({ _id: getCandidateId(), scope_fields: [] }); // Replace with the actual candidate ID
                const data = response.data ?? {};
                let totalExperience = extractExperience(data.total_experience)
                let relevantExperience = extractExperience(data.relevant_experience)
                setFormData({
                    name: data.name || "",
                    email: data.email || "",
                    mobile_no: data.mobile_no || "",
                    current_employer: data.current_employer || "",
                    designation: data.designation || "",
                    location: data.location || "",
                    total_experience_years: totalExperience && totalExperience[0],
                    total_experience_months: totalExperience && totalExperience[1] ? totalExperience[1] : 0,
                    relevant_experience_years: relevantExperience && relevantExperience[0],
                    relevant_experience_months: relevantExperience && relevantExperience[1] ? relevantExperience[1] : 0,
                    current_ctc: data.current_ctc || "",
                    expected_ctc: data.expected_ctc || "",
                    notice_period: data.notice_period.split(' ')[0] || "",
                    last_working_day: formatDate(data.last_working_day) || "",
                    applied_from: data.applied_from || "",
                    reference_employee: data.reference_employee || "",
                    experience: data.experience || [],
                    education: data.education || [],
                    old_photo_file: data.photo || "",
                    assessment_apply_status: data?.assessment_apply_status,
                    // filename: data.photo || "",
                    other: data.other || "",
                    linkedin: data.social_links?.find(link => link.brand === 'linkedin')?.link || "",
                    facebook: data.social_links?.find(link => link.brand === 'facebook')?.link || "",
                });

                if (data.filename) {
                    setPreview(data.filename);
                }

            } catch (error) {
                console.error('Error fetching candidate data', error);
            }
        };

        fetchCandidateData();
    }, []);

    useEffect(() => {
        if (!selectedLocation) {
            setLocationOptions([]);
        }
    }, [selectedLocation]);

    const fetchLocations = async (inputValue) => {
        if (inputValue.length < 2) {
            setLocationOptions([]);
            return;
        }

        try {
            const response = await getLocationList(inputValue);

            if (response.data && Array.isArray(response.data)) {
                setLocationOptions(response.data);
            } else {
                // Handle case where response data is not an array
                setLocationOptions([]);
            }
        } catch (error) {
            console.error('Error fetching location data', error);
            // Optional: Show a message or notification to the user
            setLocationOptions([]);
        }
    };


    const handleInputChange = (updatedField) => {
        const [field, value] = Object.entries(updatedField)[0];



        setFormData((prevFormData) => ({ ...prevFormData, [field]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [field]: '' })); // Clear any previous errors for this field
    };




    const handleLocationChange = (valueObj) => {
        // setInputValue(valueObj['location']);
        fetchLocations(valueObj['location']);

        setFormData(prevFormData => ({
            ...prevFormData,
            ...valueObj
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleOptionClick = (option) => {
        setSelectedLocation(option);
        setFormData(prevData => ({
            ...prevData,
            location: option.name
        }));
        // setInputValue(option.name);
        setLocationOptions([]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Validate form
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors); // Update errors state
        }

        // Clear errors if validation passes
        setErrors({});

        // Validate education dates
        const hasBlankDates = formData.education.some(({ from_date, to_date }) => !from_date || !to_date);
        if (hasBlankDates) {
            setFlashMessage({ text: 'Education - From date or To date cannot be blank.', type: 'error' });
            setShowFlash(true);
            setTimeout(() => {
                setShowFlash(false);
                setFlashMessage({ text: '', type: '' });
            }, 5000);
            return; // Stop form submission
        }


        const ExphasBlankDates = formData.experience.some(({ from_date, to_date }) => !from_date || !to_date);
        if (ExphasBlankDates) {
            setFlashMessage({ text: 'Experience - From date or To date cannot be blank.', type: 'error' });
            setShowFlash(true);
            setTimeout(() => {
                setShowFlash(false);
                setFlashMessage({ text: '', type: '' });
            }, 5000);
            return; // Stop form submission
        }

        const formDataToSend = new FormData();
        let relevant_experience = `${formData.relevant_experience_years} Year(s) ${formData.relevant_experience_months} Months`;
        let total_experience = `${formData.total_experience_years} Year(s) ${formData.total_experience_months} Months`;
        let social_links = JSON.stringify([
            { "brand": "facebook", "link": formData.facebook },
            { "brand": "linkedin", "link": formData.linkedin }
        ]);
        let notice_period = `${formData.notice_period}`;
        const educationCleaned = formData.education.map(({ id, degreeOptions, ...rest }) => rest);

        // Append form data fields
        formDataToSend.append('_id', getCandidateId());
        formDataToSend.append('name', formData.name);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('mobile_no', formData.mobile_no);
        formDataToSend.append('current_employer', formData.current_employer);
        formDataToSend.append('location', formData.location);
        formDataToSend.append('designation', formData.designation);
        formDataToSend.append('total_experience', total_experience);
        formDataToSend.append('relevant_experience', relevant_experience);
        formDataToSend.append('current_ctc', formData.current_ctc);
        formDataToSend.append('expected_ctc', formData.expected_ctc);
        formDataToSend.append('notice_period', notice_period);
        formDataToSend.append('applied_from', formData.applied_from);
        formDataToSend.append('reference_employee', formData.reference_employee);
        formDataToSend.append('experience', JSON.stringify(formData.experience)); // stringify if needed
        formDataToSend.append('education', JSON.stringify(educationCleaned)); // stringify if needed
        formDataToSend.append('old_photo_file', formData.old_photo_file);
        formDataToSend.append('other', formData.other);
        formDataToSend.append('social_links', social_links);
        if(formData.assessment_apply_status === 'disable'){
            formDataToSend.append('kyc_steps' , 'Docs');
        }

        // Append file
        if (file) {
            formDataToSend.append('filename', file);
        }

        try {
            // Replace with your API endpoint
            const response = await editProfile(formDataToSend);
            if (response.status) {

                setFlashMessage({ text: response.message, type: 'success' });
                setShowFlash(true);

                if(formData.assessment_apply_status === 'enable'){
                    setTimeout(() => {
                        setShowFlash(false);
                        setFlashMessage({ text: '', type: '' });
                        // window.location.reload();
                    }, 5000);
    
                    setFirstDivVisible(true);
                    // setSecondDivVisible(true);
                }else {
                    setTimeout(() => {
                        setShowFlash(false);
                        setFlashMessage({ text: '', type: '' });
                    }, 5000);
    
                    // setFirstDivVisible(false);
                    // setShowDocument(true);
                }
            } else {
                setFlashMessage({ text: response.message, type: 'error' });
                setShowFlash(true);
                setTimeout(() => {
                    setShowFlash(false);
                    setFlashMessage({ text: '', type: '' });
                }, 5000);
            }
        } catch (error) {
            if (error.response && error.response.status === 403) {
                // Handle the 403 error specifically
                setFlashMessage({ text: error.response.message, type: 'error' });
            } else {
                // Handle other errors
                setFlashMessage({ text:error?.message, type: 'error' });
            }
            setShowFlash(true);
            setTimeout(() => {
                setShowFlash(false);
                setFlashMessage({ text: '', type: '' });
            }, 5000);
        }
    };


    const fetchDesignations = async (inputValue) => {
        if (inputValue.length < 2) {
            setDesignationOptions([]);
            return;
        }

        try {
            // Replace with your API call
            const response = await getDesignationList(inputValue);

            if (response.data && Array.isArray(response.data)) {
                setDesignationOptions(response.data);
            } else {
                setDesignationOptions([]);
            }
        } catch (error) {
            console.error('Error fetching designation data', error);
            setDesignationOptions([]);
        }
    };

    const handleDesignationChange = (valueObj) => {
        fetchDesignations(valueObj['designation']);

        handleInputChange(valueObj);
    };

    const handleDesignationOptionClick = (designation) => {
        handleInputChange({ 'designation': designation });
        setDesignationOptions([]); // Clear the options after selection
    };


    const fetchAppliedForm = async (inputValue) => {
        if (inputValue.length < 2) {
            setAppliedfromOptions([]);
            return;
        }

        try {
            // Replace with your API call
            const response = await getAppliedFromList(inputValue);
            console.log(response)
            if (response.data && Array.isArray(response.data)) {
                setAppliedfromOptions(response.data);
            } else {
                setAppliedfromOptions([]);
            }
        } catch (error) {
            console.error('Error fetching designation data', error);
            setAppliedfromOptions([]);
        }
    };
    const handleAppliedFormChange = (valueObj) => {
        fetchAppliedForm(valueObj['applied_from']);

        handleInputChange(valueObj);
    };

    const handleAppliedFormOptionClick = (designation) => {
        handleInputChange({ 'applied_from': designation });
        setAppliedfromOptions([]); // Clear the options after selection
    };
    const navigate = useNavigate();

    const redirectHome = () => {
        navigate('/dashboard');
    };
    return (
        <>
            {showFlash && (
                <div className={`flash-message ${flashMessage.type}`}>
                    {flashMessage.type === 'success' && <FaCheckCircle className="icon" />}
                    {flashMessage.type === 'error' && <FaExclamationCircle className="icon" />}
                    <p>{flashMessage.text}</p>
                    <button className="close" onClick={() => setShowFlash(false)}>&times;</button>
                </div>
            )}
            {firstDivVisible && (
                <div className="maincontent">
                    <div className="container animate__animated animate__fadeIn animate__slower">
                        <div className="contentwrap">
                            <div className="contentbox w100">
                                <div className="contenthdr d-block">
                                    <p onClick={redirectHome}> <KeyboardBackspaceOutlinedIcon /> </p>
                                    {/* dashboard */}
                                    <h4>Review Application</h4>
                                </div>
                                <div className="profileform">
                                    <Form onSubmit={handleSubmit}>
                                        <div className="profl-block resumwrap" data-aos="fade-up" data-aos-duration="2500">
                                            <div className="dflexbtwn">
                                                <h5>1. Resume</h5>
                                                <CheckCircleIcon />
                                            </div>
                                        </div>
                                        <div className="profl-block formwrap" data-aos="fade-up" data-aos-duration="2500">
                                            <h5>2. Personal Information</h5>
                                            <Row className="mb-3">
                                                <Form.Group as={Col} controlId="formGridPhoto">
                                                    <Form.Label>Your Photo</Form.Label>
                                                    <div className='dflexbtwn position-relative'>
                                                        <div className='customup_btn'>
                                                            <button type="button" onClick={() => document.querySelector('input[type="file"]').click()}>
                                                                <span className='icon'><CloudUploadOutlinedIcon /></span>
                                                                <span>Click to upload or drag and drop</span>
                                                                <span>PNG, JPG (max 200px X 200 px)</span>
                                                            </button>
                                                        </div>
                                                        <div className='fileup_btnhide'>
                                                            <input type="file" onChange={handleFileChange} accept="image/*" />
                                                        </div>
                                                        {/* {preview && (
                                                            <img src={preview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px', marginLeft: '10px' }} />
                                                        )} */}
                                                        {preview ? (
                                                            <img src={preview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px', marginLeft: '10px' }} />
                                                        ) : (
                                                            <img
                                                                src={imgUrl(formData.old_photo_file) || ''}
                                                                alt="Default"
                                                                style={{ maxWidth: '200px', maxHeight: '200px', marginLeft: '10px' }}
                                                            />
                                                        )}
                                                    </div>
                                                </Form.Group>
                                            </Row>
                                            <Row className="mb-3">
                                                <Form.Group as={Col} controlId="formGridName">
                                                    <Form.Label>Name</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="name"
                                                        value={formData.name}
                                                        // onChange={(e) => handleInputChange({'name': e.target.value})} 
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            const regex = /^[a-zA-Z\s]*$/; // Allows only letters and spaces
                                                            if (!regex.test(value)) {
                                                                return; // Do not update state if input contains non-letter characters
                                                            }
                                                            handleInputChange({ 'name': value });
                                                        }}
                                                        placeholder="Enter name"
                                                        isInvalid={!!errors.name}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.name}
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                                <Form.Group as={Col} controlId="formGridEmail">
                                                    <Form.Label>Email ID</Form.Label>
                                                    <Form.Control
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        readOnly
                                                        placeholder="awasthi.anshul1997@gmail.com"
                                                    />
                                                </Form.Group>
                                            </Row>
                                            <Row className="mb-3">
                                                <Form.Group as={Col} controlId="formGridMobile">
                                                    <Form.Label>Mobile Number</Form.Label>
                                                    <Form.Control
                                                        name="mobile_no"
                                                        value={formData.mobile_no}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            const regex = /^\d*$/; // Allows only digits
                                                            if (!regex.test(value)) {
                                                                return; // Do not update state if input contains non-digit characters
                                                            }
                                                            handleInputChange({ 'mobile_no': value });
                                                        }}
                                                        maxLength={10}
                                                        placeholder="+91-91011010000"
                                                        isInvalid={!!errors.mobile_no}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.mobile_no}
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                                <Form.Group as={Col} controlId="formGridEmployer">
                                                    <Form.Label>Current Employer</Form.Label>
                                                    <Form.Control
                                                        name="current_employer"
                                                        value={formData.current_employer}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            const regex = /^[a-zA-Z\s]*$/; // Allows only letters and spaces
                                                            if (!regex.test(value)) {
                                                                return; // Do not update state if input contains non-letter characters
                                                            }
                                                            handleInputChange({ 'current_employer': value });
                                                        }}
                                                        placeholder="abc pvt. ltd."
                                                    />
                                                </Form.Group>
                                            </Row>
                                            <Row className="mb-3">
                                                {/* <Form.Group as={Col} controlId="formGridDesignation">
                                                    <Form.Label>Current Designation</Form.Label>
                                                    <Form.Control 
                                                        name="designation" 
                                                        value={formData.designation} 
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            const regex = /^[a-zA-Z\s]*$/; // Allows only letters and spaces
                                                            if (!regex.test(value)) {
                                                                return; // Do not update state if input contains non-letter characters
                                                            }
                                                            handleInputChange({ 'designation': value });
                                                        }}
                                                        placeholder="Frontend Developer" 
                                                    />
                                                </Form.Group> */}
                                                <Form.Group as={Col} controlId="formGridDesignation">
                                                    <Form.Label>Current Designation</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="designation"
                                                        value={formData.designation}
                                                        onChange={(e) => handleDesignationChange({ 'designation': e.target.value })}
                                                        placeholder="Search for a designation..."
                                                        isInvalid={!!errors.location}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.designation}
                                                    </Form.Control.Feedback>
                                                    {designationOptions.length > 0 && (
                                                        <ul className="designation-options">
                                                            {designationOptions.map(option => (
                                                                <li key={option._id} onClick={() => handleDesignationOptionClick(option.name)}>
                                                                    {option.name}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </Form.Group>
                                                <Form.Group as={Col} controlId="formGridLocation">
                                                    <Form.Label>Location</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="location"
                                                        value={formData.location}
                                                        onChange={(e) => handleLocationChange({ 'location': e.target.value })}
                                                        placeholder="Search for a location..."
                                                        isInvalid={!!errors.location}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.location}
                                                    </Form.Control.Feedback>
                                                    {locationOptions.length > 0 && (
                                                        <ul className="location-options">
                                                            {locationOptions.map(option => (
                                                                <li key={option._id} onClick={() => handleOptionClick(option)}>
                                                                    {option.name}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </Form.Group>
                                            </Row>
                                            <Row className="mb-3">
                                                <Form.Group as={Col} controlId="formGridTotalExperience">
                                                    <Form.Label>Total Experience</Form.Label>
                                                    <div className="selectflex">
                                                        <InputGroup>
                                                            <Form.Select
                                                                name="total_experience_years"
                                                                value={formData.total_experience_years}
                                                                onChange={(e) => handleInputChange({ 'total_experience_years': e.target.value })}
                                                            >
                                                                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map(i => (
                                                                    <option key={i} value={i}>{i}</option>
                                                                ))}
                                                            </Form.Select>
                                                            <InputGroup.Text>Years</InputGroup.Text>
                                                        </InputGroup>
                                                        <InputGroup>
                                                            <Form.Select
                                                                name="total_experience_months"
                                                                value={formData.total_experience_months}
                                                                onChange={(e) => handleInputChange({ 'total_experience_months': e.target.value })}
                                                            >
                                                                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map(i => (
                                                                    <option key={i} value={i}>{i}</option>
                                                                ))}
                                                            </Form.Select>
                                                            <InputGroup.Text>Months</InputGroup.Text>
                                                        </InputGroup>
                                                    </div>

                                                </Form.Group>
                                                <Form.Group as={Col} controlId="formGridRelevantExperience">
                                                    <Form.Label>Relevant Experience</Form.Label>
                                                    <div className="selectflex">
                                                        <InputGroup>
                                                            <Form.Select
                                                                name="relevant_experience_years"
                                                                value={formData.relevant_experience_years}
                                                                onChange={(e) => handleInputChange({ 'relevant_experience_years': e.target.value })}
                                                            >
                                                                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map(i => (
                                                                    <option key={i} value={i}>{i}</option>
                                                                ))}
                                                            </Form.Select>
                                                            <InputGroup.Text>Years</InputGroup.Text>
                                                        </InputGroup>
                                                        <InputGroup>
                                                            <Form.Select
                                                                name="relevant_experience_months"
                                                                value={formData.relevant_experience_months}
                                                                onChange={(e) => handleInputChange({ 'relevant_experience_months': e.target.value })}
                                                            >
                                                                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map(i => (
                                                                    <option key={i} value={i}>{i}</option>
                                                                ))}
                                                            </Form.Select>
                                                            <InputGroup.Text>Months</InputGroup.Text>
                                                        </InputGroup>
                                                    </div>
                                                </Form.Group>
                                            </Row>
                                            <Row className="mb-3">
                                                <Form.Group as={Col} controlId="formGridCurrentCTC">
                                                    <Form.Label>Current CTC</Form.Label>
                                                    <Form.Control
                                                        name="current_ctc"
                                                        value={formData.current_ctc}
                                                        onChange={(e) => handleInputChange({ 'current_ctc': e.target.value })}
                                                    />
                                                </Form.Group>
                                                <Form.Group as={Col} controlId="formGridExpectedCTC">
                                                    <Form.Label>Expected CTC</Form.Label>
                                                    <Form.Control
                                                        name="expected_ctc"
                                                        value={formData.expected_ctc}
                                                        onChange={(e) => handleInputChange({ 'expected_ctc': e.target.value })}
                                                    />
                                                </Form.Group>
                                            </Row>
                                            <Row className="mb-3">
                                                <Form.Group as={Col} controlId="formGridNoticePeriod">
                                                    <Form.Label>Notice Period</Form.Label>
                                                    <div className="selectflex">
                                                        <InputGroup>
                                                            <Form.Control
                                                                type="text"
                                                                inputMode="numeric"
                                                                name="noticePeriod"
                                                                value={formData.notice_period}
                                                                placeholder="Enter notice period"
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    if (/^\d{0,10}$/.test(value)) {
                                                                        handleInputChange({ 'notice_period': e.target.value })
                                                                    }
                                                                }}
                                                            />
                                                            <InputGroup.Text>Days</InputGroup.Text>
                                                        </InputGroup>
                                                    </div>
                                                </Form.Group>
                                                <Form.Group as={Col} controlId="formGridLastWorkingDay">
                                                    <Form.Label>Last working day (In case of Serving)</Form.Label>
                                                    <Form.Control
                                                        type="date"
                                                        name="last_working_day"
                                                        value={formData.last_working_day}
                                                        onChange={(e) => handleInputChange({ 'last_working_day': e.target.value })}
                                                    />
                                                    <DateRangeIcon />
                                                </Form.Group>
                                            </Row>
                                            <Row className="mb-3">
                                                <Form.Group as={Col} controlId="formGridAppliedFrom">
                                                    <Form.Label>Hear from</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="applied_from"
                                                        value={formData.applied_from}
                                                        onChange={(e) => handleAppliedFormChange({ 'applied_from': e.target.value })}
                                                        placeholder="Hear from..."
                                                        isInvalid={!!errors.applied_from}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.applied_from}
                                                    </Form.Control.Feedback>
                                                    {appliedfromOptions.length > 0 && (
                                                        <ul className="applied-from-options">
                                                            {appliedfromOptions.map(option => (
                                                                <li key={option._id} onClick={() => handleAppliedFormOptionClick(option.name)}>
                                                                    {option.name}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </Form.Group>

                                                <Form.Group as={Col} controlId="formGridReferenceEmployee">
                                                    <Form.Label>Reference Employee (if any)</Form.Label>
                                                    <Form.Control
                                                        name="reference_employee"
                                                        value={formData.reference_employee}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            const regex = /^[a-zA-Z\s]*$/; // Allows only letters and spaces
                                                            if (!regex.test(value)) {
                                                                return; // Do not update state if input contains non-letter characters
                                                            }
                                                            handleInputChange({ 'reference_employee': value });
                                                        }}
                                                    />
                                                </Form.Group>
                                            </Row>
                                        </div>
                                        <div className="profl-block formwrap" data-aos="fade-up" data-aos-duration="2500">
                                            <h5>3. Experience</h5>
                                            <RepeatsExperience
                                                formData={formData}
                                                handleInputChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="profl-block formwrap" data-aos="fade-up" data-aos-duration="2500">
                                            <h5>4. Education</h5>
                                            <RepeatsEducation
                                                formData={formData}
                                                handleInputChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="profl-block formwrap" data-aos="fade-up" data-aos-duration="2500">
                                            <h5>5. Other</h5>
                                            <Form.Group className="mb-3" controlId="formGridCoverLetter">
                                                <Form.Label>Cover Letter</Form.Label>
                                                <textarea
                                                    name="other"
                                                    value={formData.other}
                                                    onChange={(e) => handleInputChange({ 'other': e.target.value })}
                                                    placeholder="Write your cover letter"
                                                />
                                            </Form.Group>
                                            <Row className="mb-3">
                                                <Form.Group as={Col} controlId="formGridLinkedIn">
                                                    <Form.Label>LinkedIn Profile</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="linkedin"
                                                        value={formData.linkedin}
                                                        onChange={(e) => handleInputChange({ 'linkedin': e.target.value })}
                                                        placeholder="Enter LinkedIn Profile"
                                                    />
                                                </Form.Group>
                                                <Form.Group as={Col} controlId="formGridFacebook">
                                                    <Form.Label>Facebook Profile</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="facebook"
                                                        value={formData.facebook}
                                                        onChange={(e) => handleInputChange({ 'facebook': e.target.value })}
                                                        placeholder="Enter Facebook Profile"
                                                    />
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
                    </div>
                </div>
            )}
            {secondDivVisible && (formData.assessment_apply_status === 'enable') ?
                <div className="maincontent">
                    <div className="container" data-aos="fade-in" data-aos-duration="3000">
                        <ProfileSubmit />
                    </div>
                </div>
                : showDocument &&
                <div className="maincontent">
                    <div className="container" data-aos="fade-in" data-aos-duration="3000">
                        <div className="welcomebox">
                            <div className="welcometext">
                                <h2>Great !!</h2>
                                <p>Your updated profile have been submitted for evaluation. <br /> Please Uplods the Documents For the Document Verification.</p>
                                <Button onClick={(e) => {
                                    e.preventDefault();
                                    navigate('/upload-documents')
                                }} className="sitebtn mt-4 btnblue"> Uplods Documents </Button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default Profile;
