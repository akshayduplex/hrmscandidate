
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from 'react-bootstrap/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import FileUpload from "../Components/FileUpload";
import InputGroup from 'react-bootstrap/InputGroup';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CustomAsyncSelectField from '../job-portal/JobSearchForm/SelectComponents'
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchRecordsById } from "../Redux/Slices/JobListApi";
import axios from "axios";
import config from "../Config/Config";
import { apiHeaderTokenMultiPart, apiHeaderToken } from "../Headers/CustomeHeaders";
import { useState } from "react";
import ProfileImageUpload from "../Components/ImageUplods/ProifleImageUploads";

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: '#fff',
        borderColor: state.isFocused ? '#D2C9FF' : state.isHovered ? '#80CBC4' : provided.borderColor,
        boxShadow: state.isFocused ? '0 0 0 1px #D2C9FF' : 'none',
        '&:hover': {
            borderColor: '#D2C9FF',
        },
        width: '100%',
        height: '44px',
    }),
    menu: (provided) => ({
        ...provided,
        borderTop: '1px solid #D2C9FF',
        zIndex: '9',
    }),
    option: (provided, state) => ({
        ...provided,
        borderBottom: '1px solid #D2C9FF',
        color: state.isSelected ? '#fff' : '#000',
        backgroundColor: state.isSelected ? '#4CAF50' : state.isFocused ? '#80CBC4' : provided.backgroundColor,
        '&:hover': {
            backgroundColor: '#80CBC4',
            color: '#fff',
        },
    }),
};


const Applyform = () => {

    const [socialMedia, setSocialMedia] = useState([])
    const { file, profile_image } = useSelector(state => state.files)
    const dispatch = useDispatch();
    const jobs = useSelector((state) => state.jobs.jobRecordsById)
    const { id } = useParams();


    useEffect(() => {
        dispatch(fetchRecordsById({ id: id }))
    }, [dispatch, id])



    const TotalOptions = (years, months) => {
        let options = [];
        if (years) {
            for (let i = 0; i <= 20; i++) {
                options.push(<option key={i} value={i}>{i}</option>);
            }
        } else if (months) {
            for (let i = 0; i <= 12; i++) {
                options.push(<option key={i} value={i}>{i}</option>);
            }
        }
        return options;
    };

    const SocialMedia = () => {
        let options = [];

        if (socialMedia && socialMedia?.length > 0) {

            for (let i = 0; i <= socialMedia?.length - 1; i++) {
                options.push(<option key={socialMedia[i]?.name} value={socialMedia[i]?.name}>{socialMedia[i]?.name}</option>);
            }
        }
        return options;
    };

    const handleDynamicInputFields = (inputFields) => {
        if (!inputFields) {
            return null;
        }
        let components = [];
        inputFields.forEach((field) => {
            if (['Mandatory', 'Optional'].includes(field.action) && field.label === 'Applied From') {
                components.push(
                    <Form.Group as={Col} controlId="formGridCity">
                        <Form.Label>Hear from</Form.Label>
                        <Form.Select
                            name="appliedFrom"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.appliedFrom}
                            hidden={field?.action === "off" ? true : false}
                            isInvalid={formik.touched.appliedFrom && formik.errors.appliedFrom}
                        >
                            <option value="" disabled hidden>
                                Select Applied From
                            </option>
                            {SocialMedia()}
                        </Form.Select>
                    </Form.Group>

                )
            } else if (['Mandatory', 'Optional'].includes(field.action) && field.label === 'Reference Employee') {
                components.push(
                    <Form.Group as={Col} controlId="formGridCity">
                        <Form.Label>Reference Employee (if any)</Form.Label>
                        <Form.Control
                            name="referenceEmployee"
                            onChange={(e) => {
                                const regex = /^[A-Za-z()-/ ]+$/;
                                if (regex.test(e.target.value) || e.target.value === '') {
                                    formik.handleChange(e);
                                }
                            }}
                            onBlur={formik.handleBlur}
                            hidden={field?.action === "off" ? true : false}
                            placeholder="Reference Employee"
                            value={formik.values.referenceEmployee}
                        />
                    </Form.Group>
                )
            }
        })

        return components;

    }

    const notify = (message) => toast.success(message, {
        position: "top-right",
        theme: "dark",
    });

    const mobileNumberCurrentEmployer = (inputFields) => {
        if (!inputFields) {
            return null;
        }

        let components = [];
        inputFields.forEach((field) => {
            if (['Mandatory', 'Optional'].includes(field.action) && field.label === 'Phone') {
                components.push(
                    <Form.Group as={Col} controlId="formGridAddress1">
                        <Form.Label>Mobile Number</Form.Label>
                        <Form.Control
                            name="mobileNumber"
                            type="text"
                            maxLength={10}
                            placeholder="Enter mobile number"
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d{0,10}$/.test(value)) {
                                    formik.setFieldValue('mobileNumber', value);
                                }
                            }}
                            onBlur={formik.handleBlur}
                            hidden={field?.action === "off" ? true : false}
                            value={formik.values.mobileNumber}
                            isInvalid={formik.touched.mobileNumber && formik.errors.mobileNumber}
                        />
                    </Form.Group>
                )
            } else if (['Mandatory', 'Optional'].includes(field.action) && field.label === 'Employer') {
                components.push(
                    <Form.Group as={Col} controlId="formGridAddress2">
                        <Form.Label>Current Employer</Form.Label>
                        <Form.Control
                            name="currentEmployer"
                            placeholder="abc pvt. ltd."
                            onChange={(e) => {
                                const regex = /^[A-Za-z()-/ ]+$/;
                                if (regex.test(e.target.value) || e.target.value === '') {
                                    formik.handleChange(e);
                                }
                            }}
                            onBlur={formik.handleBlur}
                            hidden={field?.action === "off" ? true : false}
                            value={formik.values.currentEmployer}
                            isInvalid={formik.touched.currentEmployer && formik.errors.currentEmployer}
                        />

                    </Form.Group>
                )
            }
        })
        return components;
    }

    const DesignationAndLocation = (inputFields) => {
        if (!inputFields) {
            return null;
        }
        let components = [];
        inputFields.forEach((field) => {
            if (['Mandatory', 'Optional'].includes(field.action) && field.label === 'designation') {
                components.push(
                    <Form.Group as={Col} controlId="formGridAddress1">
                        <Form.Label>Current Designation</Form.Label>
                        <Form.Control
                            name="currentDesignation"
                            placeholder={jobs.status === 'succeeded' && jobs?.data?.designation}
                            onChange={(e) => {
                                const regex = /^[A-Za-z()-/ ]+$/;
                                if (regex.test(e.target.value) || e.target.value === '') {
                                    formik.handleChange(e);
                                }
                            }}
                            onBlur={formik.handleBlur}
                            hidden={field?.action === "off" ? true : false}
                            value={formik.values.currentDesignation}
                            isInvalid={formik.touched.currentDesignation && formik.errors.currentDesignation}
                        />
                    </Form.Group>
                )
            } else if (['Mandatory', 'Optional'].includes(field.action) && field.label === 'Location') {
                components.push(
                    <Form.Group as={Col} controlId="formGridAddress2">
                        <Form.Label>Location</Form.Label>
                        <CustomAsyncSelectField
                            field={{
                                name: 'location',
                                value: formik.values.location,
                                onBlur: formik.handleBlur,
                                isInvalid: formik?.touched?.location && formik?.errors?.location
                            }}
                            form={formik}
                            hidden={field?.action === "off" ? true : false}
                            customStyles={customStyles}
                            isInvalid={formik?.touched?.location && formik?.errors?.location}
                            isApplied={true}
                        />
                    </Form.Group>
                )
            }
        })
        return components;
    }

    const currentCTCexpectedCTC = (inputFields) => {
        if (!inputFields) {
            return null;
        }
        let components = [];
        inputFields.forEach((field) => {
            if (['Mandatory', 'Optional'].includes(field.action) && field.label === 'Current CTC') {
                components.push(
                    <Form.Group as={Col} controlId="formGridCity">
                        <Form.Label>Current CTC (LPA)</Form.Label>
                        <Form.Control
                            name="currentCTC"
                            placeholder="3.5"
                            type="text"
                            onChange={(e) => {
                                let value = e.target.value;
                                value = value.replace(/[^0-9.]/g, '');
                                if (value.length <= 10) {
                                    formik.setFieldValue("currentCTC", value);
                                }
                            }}
                            onBlur={formik.handleBlur}
                            hidden={field?.action === "off" ? true : false}
                            value={formik.values.currentCTC}
                            isInvalid={formik.touched.currentCTC && formik.errors.currentCTC}
                        />
                    </Form.Group>
                )
            } else if (['Mandatory', 'Optional'].includes(field.action) && field.label === 'Expected CTC') {
                components.push(
                    <Form.Group as={Col} controlId="formGridCity">
                        <Form.Label>Expected CTC (LPA)</Form.Label>
                        <Form.Control
                            name="expectedCTC"
                            placeholder="3.5"
                            type="text"
                            onChange={(e) => {
                                let value = e.target.value;
                                value = value.replace(/[^0-9.]/g, '');
                                if (value.length <= 10) {
                                    formik.setFieldValue("expectedCTC", value);
                                }
                            }}
                            onBlur={formik.handleBlur}
                            hidden={field?.action === "off" ? true : false}
                            value={formik.values.expectedCTC}
                            isInvalid={formik.touched.expectedCTC && formik.errors.expectedCTC}
                        />
                    </Form.Group>
                )
            }
        })
        return components;
    }


    const NoticePeriodLastworking = (inputFields) => {
        if (!inputFields) {
            return null;
        }
        let components = [];
        inputFields.forEach((field) => {
            if (['Mandatory', 'Optional'].includes(field.action) && field.label === 'Notice Period') {
                components.push(
                    <Form.Group as={Col} controlId="formGridCity">
                        <Form.Label>Notice Period</Form.Label>
                        {/* <div className="selectflex">
                            <InputGroup>
                                <Form.Select
                                    name="noticePeriod"
                                    onChange={formik.handleChange}
                                    hidden={field?.action === "off" ? true : false}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.noticePeriod}
                                    isInvalid={formik.touched.noticePeriod && formik.errors.noticePeriod}
                                >
                                    <option value={0}>0</option>
                                    <option value={10}>10</option>
                                    <option value={15}>15</option>
                                    <option value={30}>30</option>
                                </Form.Select>
                                <InputGroup.Text>Days</InputGroup.Text>
                            </InputGroup>
                        </div> */}

                        <div className="selectflex">
                            <InputGroup>
                                <Form.Control
                                    type="text"
                                    inputMode="numeric"
                                    name="noticePeriod"
                                    placeholder="Enter notice period"
                                    // onChange={formik.handleChange}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^\d{0,10}$/.test(value)) {
                                            formik.setFieldValue('noticePeriod', value);
                                        }
                                    }}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.noticePeriod}
                                    isInvalid={formik.touched.noticePeriod && formik.errors.noticePeriod}
                                    hidden={field?.action === "off"}
                                />
                                <InputGroup.Text>Days</InputGroup.Text>
                                {formik.touched.noticePeriod && formik.errors.noticePeriod ? (
                                    <Form.Control.Feedback type="invalid">
                                        {formik.errors.noticePeriod}
                                    </Form.Control.Feedback>
                                ) : null}
                            </InputGroup>
                        </div>
                    </Form.Group>
                )
            } else if (['Mandatory', 'Optional'].includes(field.action) && field.label === 'Last Working Day') {
                components.push(
                    <Form.Group as={Col} controlId="formGridCity">
                        <Form.Label>Last working day (In case of Serving)</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type="date"
                                name="lastWorkingDay"
                                onChange={formik.handleChange}
                                hidden={field?.action === "off" ? true : false}
                                onBlur={formik.handleBlur}
                                value={formik.values.lastWorkingDay}
                                isInvalid={formik.touched.lastWorkingDay && formik.errors.lastWorkingDay}
                            />
                            <div className="styling">
                                <DateRangeIcon />
                            </div>
                        </InputGroup>
                    </Form.Group>
                )
            }
        })
        return components;
    }

    const TotalRelevantExperience = (inputFields) => {
        if (!inputFields) {
            return null;
        }
        let components = [];
        inputFields.forEach((field) => {
            if (['Mandatory', 'Optional'].includes(field.action) && field.label === 'Experience') {
                components.push(
                    <>
                        <Form.Group as={Col} controlId="formGridAddress1">
                            <Form.Label>Total Experience</Form.Label>
                            <div className="selectflex">
                                <InputGroup>
                                    <Form.Select
                                        name="totalExperienceYears"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        hidden={field?.action === "off" ? true : false}
                                        value={formik.values.totalExperienceYears}
                                        isInvalid={formik.touched.totalExperienceYears && formik.errors.totalExperienceYears}
                                    >
                                        {
                                            TotalOptions(true, false)
                                        }
                                    </Form.Select>
                                    <InputGroup.Text>Years</InputGroup.Text>
                                </InputGroup>
                                <InputGroup>
                                    <Form.Select
                                        name="totalExperienceMonths"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        hidden={field?.action === "off" ? true : false}
                                        value={formik.values.totalExperienceMonths}
                                        isInvalid={formik.touched.totalExperienceMonths && formik.errors.totalExperienceMonths}
                                    >
                                        {
                                            TotalOptions(false, true)
                                        }
                                    </Form.Select>
                                    <InputGroup.Text>Months</InputGroup.Text>
                                </InputGroup>
                            </div>
                        </Form.Group>
                    </>
                )
            }
        })

        if (jobs.status === 'succeeded' && jobs.data.form_profile) {
            jobs.data.form_profile?.forEach((item) => {
                if (['Mandatory', 'Optional'].includes(item.action) && item.label === 'ProfileExperience') {
                    components.push(
                        <>
                            <Form.Group as={Col} controlId="formGridAddress2">
                                <Form.Label>Relevant Experience</Form.Label>
                                <div className="selectflex">
                                    <InputGroup>
                                        <Form.Select
                                            name="relevantExperienceYears"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            hidden={item?.action === "off" ? true : false}
                                            value={formik.values.relevantExperienceYears}
                                            isInvalid={formik.touched.relevantExperienceYears && formik.errors.relevantExperienceYears}
                                        >
                                            {
                                                TotalOptions(true, false)
                                            }
                                        </Form.Select>
                                        <InputGroup.Text>Years</InputGroup.Text>
                                    </InputGroup>
                                    <InputGroup>
                                        <Form.Select
                                            name="relevantExperienceMonths"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            hidden={item?.action === "off" ? true : false}
                                            value={formik.values.relevantExperienceMonths}
                                            isInvalid={formik.touched.relevantExperienceMonths && formik.errors.relevantExperienceMonths}
                                        >
                                            {
                                                TotalOptions(false, true)
                                            }
                                        </Form.Select>
                                        <InputGroup.Text>Months</InputGroup.Text>
                                    </InputGroup>
                                </div>
                            </Form.Group>
                        </>
                    )
                }
            })
        }
        return components;
    }

    const CheckedProfileImage = (inputFields) => {
        if (!inputFields) {
            return null;
        }
        return inputFields.map((field) => {
            if (['Mandatory', 'Optional'].includes(field.action) && field.label === 'Photo') {
                return (
                    <>
                        <h5>
                            Upload Profile Image{' '}
                            {jobs.status === 'succeeded' &&
                                jobs.data.form_personal_data.find(
                                    (item) => item.action === 'Mandatory' && item.label === 'Photo'
                                ) ? (
                                <span style={{ color: 'red' }}>*</span>
                            ) : (
                                <span style={{ color: 'gray' }}>(Optional)</span>
                            )}
                        </h5>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridImage">
                                <ProfileImageUpload />
                            </Form.Group>
                        </Row>
                    </>
                )
            }
            return null;
        })
    }

    const checkResume = (inputFields) => {
        if (!inputFields) {
            return null;
        }
        return inputFields.map((field) => {
            if (['Mandatory', 'Optional'].includes(field.action) && field.label === 'Resume') {
                return (
                    <>
                        <h5>
                            Upload Resume {' '}
                            {jobs.status === 'succeeded' &&
                                jobs.data.form_profile.find(
                                    (item) => item.action === 'Mandatory' && item.label === 'Resume'
                                ) ? (
                                <span style={{ color: 'red' }}>*</span>
                            ) : (
                                <span style={{ color: 'gray' }}>(Optional)</span>
                            )}
                        </h5>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridImage">
                                <FileUpload />
                            </Form.Group>
                        </Row>
                    </>
                )
            }
            return null;
        })
    }

    // Handle Profile and Eduction Experience

    const ProfileExperienceAndEducation = () => {
        let components = [];
        if (jobs.status === 'succeeded' && jobs.data.form_profile) {
            jobs.data.form_profile?.forEach((field) => {
                if (['Mandatory', 'Optional'].includes(field.action) && field.label === 'Education') {
                    components.push(
                        <>
                            <Form.Group as={Col} controlId="formGridPassword">
                                <Form.Label>Education ( Graduation )</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="education"
                                    placeholder="( Graduation / 12  / 10  )"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.education}
                                    hidden={field?.action === "off" ? true : false}
                                    isInvalid={formik.touched.education && formik.errors.education}
                                />
                            </Form.Group>
                        </>
                    )
                }
            })
        }

        if (jobs.status === 'succeeded' && jobs.data.form_social_links) {
            jobs.data.form_social_links?.forEach((field) => {
                if (['Mandatory', 'Optional'].includes(field.action) && field.label === 'LinkedIn') {
                    components.push(
                        <>
                            <Form.Group as={Col} controlId="formGridPassword">
                                <Form.Label>LinkedIn Profile Link</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="linkedin_url"
                                    placeholder="https://......."
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.linkedin_url}
                                    hidden={field?.action === "off" ? true : false}
                                    isInvalid={formik.touched.linkedin_url && formik.errors.linkedin_url}
                                />
                            </Form.Group>
                        </>
                    )
                }
            })
        }
        return components
    }

    const SocialMediasLinkInput = () => {
        let components = [];
        if (jobs.status === 'succeeded' && jobs.data.form_social_links) {
            jobs.data.form_social_links?.forEach((field) => {
                if (['Mandatory', 'Optional'].includes(field.action) && field.label === 'Instagram') {
                    components.push(
                        <>
                            <Form.Group as={Col} controlId="instagram_url">
                                <Form.Label>Instagram Profile Link</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="instagram_url"
                                    placeholder="https://......."
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.instagram_url}
                                    hidden={field?.action === "off" ? true : false}
                                    isInvalid={formik.touched.instagram_url && formik.errors.instagram_url}
                                />
                            </Form.Group>
                        </>
                    )
                }
            })
        }

        if (jobs.status === 'succeeded' && jobs.data.form_social_links) {
            jobs.data.form_social_links?.forEach((field) => {
                if (['Mandatory', 'Optional'].includes(field.action) && field.label === 'Facebook') {
                    components.push(
                        <>
                            <Form.Group as={Col} controlId="facebook_url">
                                <Form.Label>Facebook Profile Link</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="facebook_url"
                                    placeholder="https://......."
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.facebook_url}
                                    hidden={field?.action === "off" ? true : false}
                                    isInvalid={formik.touched.facebook_url && formik.errors.facebook_url}
                                />
                            </Form.Group>
                        </>
                    )
                }
            })
        }
        return components
    }
    const SocialMediasLinkInput1 = () => {
        let components = [];
        if (jobs.status === 'succeeded' && jobs.data.form_social_links) {
            jobs.data.form_social_links?.forEach((field) => {
                if (['Mandatory', 'Optional'].includes(field.action) && field.label === 'Portfolio') {
                    components.push(
                        <>
                            <Form.Group as={Col} controlId="profile_portfolio_url">
                                <Form.Label>Profile Portfolio Link</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="profile_portfolio_url"
                                    placeholder="https://......."
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.profile_portfolio_url}
                                    hidden={field?.action === "off" ? true : false}
                                    isInvalid={formik.touched.profile_portfolio_url && formik.errors.profile_portfolio_url}
                                />
                            </Form.Group>
                        </>
                    )
                }
            })
        }

        if (jobs.status === 'succeeded' && jobs.data.form_social_links) {
            jobs.data.form_social_links?.forEach((field) => {
                if (['Mandatory', 'Optional'].includes(field.action) && field.label === 'Website') {
                    components.push(
                        <>
                            <Form.Group as={Col} controlId="formGridPassword">
                                <Form.Label>Website Link</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="website_url"
                                    placeholder="https://......."
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.website_url}
                                    hidden={field?.action === "off" ? true : false}
                                    isInvalid={formik.touched.website_url && formik.errors.website_url}
                                />
                            </Form.Group>
                        </>
                    )
                }
            })
        }

        return components
    }

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            mobileNumber: "",
            currentEmployer: "",
            currentDesignation: "",
            location: "",
            totalExperienceYears: 0,
            totalExperienceMonths: 0,
            relevantExperienceYears: 0,
            relevantExperienceMonths: 0,
            currentCTC: "",
            expectedCTC: "",
            noticePeriod: 0,
            lastWorkingDay: "",
            appliedFrom: "",
            referenceEmployee: "",
            education: "",
            linkedin_url: '',
            facebook_url: '',
            instagram_url: '',
            website_url: '',
            profile_portfolio_url: '',
        },

        validationSchema: Yup.object().shape(
            jobs?.status === "succeeded"
                ? jobs.data.form_personal_data.reduce((schema, field) => {
                    //console.log(field)
                    switch (field.label) {
                        case 'Candidate Full name':
                            schema.name = field.action === 'Mandatory' ? Yup.string().required("Required") : Yup.string();
                            break;
                        case 'Email':
                            schema.email = field.action === 'Mandatory' ? Yup.string().email("Invalid email").required("Required") : Yup.string().email("Invalid email");
                            break;
                        case 'Phone':
                            schema.mobileNumber = field.action === 'Mandatory'
                                ? Yup.string()
                                    .required("Required")
                                    .matches(/^\d{10}$/, "Must be exactly 10 digits")
                                : Yup.string()
                                    .matches(/^\d{10}$/, "Must be exactly 10 digits");
                            break;
                        case 'designation':
                            schema.currentDesignation = field.action === 'Mandatory' ? Yup.string().required("Required") : Yup.string();
                            break;
                        case 'Experience':
                            schema.totalExperienceYears = field.action === 'Mandatory' ? Yup.string().required("Required") : Yup.string();
                            schema.totalExperienceMonths = field.action === 'Mandatory' ? Yup.string().required("Required") : Yup.string();
                            schema.relevantExperienceYears = field.action === 'Mandatory' ? Yup.string().required("Required") : Yup.string();
                            schema.relevantExperienceMonths = field.action === 'Mandatory' ? Yup.string().required("Required") : Yup.string();
                            break;
                        case 'Location':
                            schema.location = field.action === 'Mandatory' ? Yup.string().required("Required") : Yup.string();
                            break;
                        case 'Employer':
                            schema.currentEmployer = field.action === 'Mandatory' ? Yup.string().required("Required") : Yup.string();
                            break;
                        case 'Current CTC':
                            schema.currentCTC = field.action === 'Mandatory' ? Yup.string().required("Required") : Yup.string();
                            break;
                        case 'Expected CTC':
                            schema.expectedCTC = field.action === 'Mandatory' ? Yup.string().required("Required") : Yup.string();
                            break;
                        case 'Notice Period':
                            schema.noticePeriod = field.action === 'Mandatory' ? Yup.string().required("Required") : Yup.string();
                            break;
                        case 'Applied From':
                            schema.appliedFrom = field.action === 'Mandatory' ? Yup.string().required("Required") : Yup.string();
                            break;
                        case 'Reference Employee':
                            schema.referenceEmployee = field.action === 'Mandatory' ? Yup.string().required("Required") : Yup.string();
                            break;
                        case 'Last Working Day':
                            schema.lastWorkingDay = field.action === 'Mandatory' ? Yup.string().required("Required") : Yup.string();
                            break;
                        // case 'Education': 
                        //     schema.education = jobs.status === 'succeeded' && jobs.data.form_profile.find((item) => item?.action === 'Mandatory') ? Yup.string().required() : Yup.string();
                        //     break;
                        default:
                            break;
                    }
                    schema.education = jobs.status === 'succeeded' && jobs.data.form_profile.find((item) => item?.action === 'Mandatory' && item?.label === 'Education') ? Yup.string().required() : Yup.string();
                    schema.linkedin_url = jobs.status === 'succeeded' && jobs.data.form_social_links.find((item) => item?.action === 'Mandatory' && item?.label === 'LinkedIn') ? Yup.string().required() : Yup.string();
                    schema.instagram_url = jobs.status === 'succeeded' && jobs.data.form_social_links.find((item) => item?.action === 'Mandatory' && item?.label === 'Instagram') ? Yup.string().required() : Yup.string();
                    schema.website_url = jobs.status === 'succeeded' && jobs.data.form_social_links.find((item) => item?.action === 'Mandatory' && item?.label === 'Website') ? Yup.string().required() : Yup.string();
                    schema.profile_portfolio_url = jobs.status === 'succeeded' && jobs.data.form_social_links.find((item) => item?.action === 'Mandatory' && item?.label === 'Portfolio') ? Yup.string().required() : Yup.string();
                    schema.facebook_url = jobs.status === 'succeeded' && jobs.data.form_social_links.find((item) => item?.action === 'Mandatory' && item?.label === 'Facebook') ? Yup.string().required() : Yup.string();
                    return schema;
                }, {})
                : {}
        ),
        onSubmit: (values, { resetForm }) => {
            const formData = new FormData();
            formData.append('job_id', jobs.data._id);
            formData.append('job_title', jobs.data.job_title);
            formData.append('job_type', jobs.data.job_type);
            formData.append('project_id', jobs.data.project_id);
            formData.append('project_name', jobs.data.project_name);
            formData.append('designation_id', jobs.data?.designation_id);
            formData.append('name', values.name);
            formData.append('email', values.email);
            formData.append('mobile_no', values.mobileNumber);
            formData.append('filename', file);
            formData.append('designation', values.currentDesignation);
            formData.append('current_employer', values.currentEmployer);
            formData.append('location', values.location);
            formData.append('total_experience', `${values.totalExperienceYears} Year(s) ${values?.totalExperienceMonths} Months`);
            formData.append('relevant_experience', `${values.relevantExperienceYears} Year(s) ${values?.relevantExperienceMonths} Months`);
            formData.append('current_ctc', values.currentCTC);
            formData.append('expected_ctc', values.expectedCTC);
            formData.append('notice_period', values.noticePeriod);
            formData.append('last_working_day', values.lastWorkingDay);
            formData.append('applied_from', values.appliedFrom);
            formData.append('reference_employee', values.referenceEmployee);
            formData.append('department', jobs.data.department);

            if ((jobs.status === 'succeeded' && jobs.data.form_profile.find((item) => item.action === 'Mandatory' && item.label === 'Resume')) && !file) {
                return toast.warn('Please Select The Resume', {
                    position: "top-right",
                    theme: "dark"
                });
            }

            // checked the Social Listed
            let data = [];
            if (values?.linkedin_url) {
                data.push({
                    brand: 'linkedin',
                    link: values.linkedin_url
                })
            }
            if (values?.instagram_url) {
                data.push({
                    brand: 'instagram',
                    link: values.instagram_url
                })
            }
            if (values?.website_url) {
                data.push({
                    brand: 'website',
                    link: values.website_url
                })
            }
            if (values?.profile_portfolio_url) {
                data.push({
                    brand: 'profile_portfolio',
                    link: values.profile_portfolio_url
                })
            }

            if (values?.facebook_url) {
                data.push({
                    brand: 'facebook',
                    link: values.facebook_url
                })
            }

            
            formData.append('social_links', JSON.stringify(data));

            if ((jobs.status === 'succeeded' && jobs.data.form_personal_data.find((item) => item.action === 'Mandatory' && item.label === 'Photo')) && !profile_image) {
                return toast.warn('Please Select The Profile Image', {
                    position: "top-right",
                    theme: "dark"
                });
            }

            if(profile_image){
                formData.append('photo' , profile_image)
            }

            axios.post(`${config.BASE_URL}/front/applyJob`, formData, apiHeaderTokenMultiPart(config.API_TOKEN))
                .then((response) => {
                    if (response.data?.status) {
                        notify(response.data.message);
                        resetForm();
                    }
                })
                .catch((err) => {
                    toast.warn(err.response.data.message, {
                        position: "top-right",
                        theme: "dark",
                    });
                });
        },
    });

    const getAppliedFromList = async () => {
        const payload = { status: 'Active' };
        try {
            let response = await axios.post(`${config.BASE_URL}/front/getAppliedFromList`, payload, apiHeaderToken(config.API_TOKEN));
            setSocialMedia(response?.data?.data)

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getAppliedFromList();
    }, []);

    return (
        <>
            <ToastContainer
                position="bottom-left"
                autoClose={5000}
                theme="dark"
                limit={1}
            />
            <div className="container">
                <div className="contentwrap">
                    <div className="applyform profileform">
                        <h4>Complete few Information to apply for this job</h4>
                        <Form onSubmit={formik.handleSubmit} acceptCharset="UTF-8">
                            <div className="formwrap">
                                {
                                    checkResume(jobs.status === 'succeeded' && jobs.data.form_profile)
                                }
                                {
                                    CheckedProfileImage(jobs.status === 'succeeded' && jobs.data.form_personal_data)
                                }
                                <h5>Personal Information</h5>
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formGridEmail">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            placeholder="Enter name"
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                const regex = /^[a-zA-Z\s]*$/;
                                                if (!regex.test(value)) {
                                                    return;
                                                }
                                                if (value.length <= 20) {
                                                    formik.setFieldValue('name', value);
                                                }
                                            }}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.name}
                                            isInvalid={formik.touched.name && formik.errors.name}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="formGridPassword">
                                        <Form.Label>Email ID</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            placeholder="example@gmail.com"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.email}
                                            isInvalid={formik.touched.email && formik.errors.email}
                                        />
                                    </Form.Group>
                                </Row>
                                <Row className="mb-3">
                                    {
                                        mobileNumberCurrentEmployer(jobs.status === 'succeeded' && jobs.data.form_personal_data)
                                    }
                                </Row>
                                <Row className="mb-3">
                                    {
                                        DesignationAndLocation(jobs.status === 'succeeded' && jobs.data.form_personal_data)
                                    }
                                </Row>
                                <Row className="mb-3">
                                    {
                                        TotalRelevantExperience(jobs.status === 'succeeded' && jobs.data.form_personal_data)
                                    }
                                </Row>
                                <Row className="mb-3">
                                    {
                                        currentCTCexpectedCTC(jobs.status === 'succeeded' && jobs.data.form_personal_data)
                                    }

                                </Row>

                                <Row className="mb-3">
                                    {
                                        NoticePeriodLastworking(jobs.status === 'succeeded' && jobs.data.form_personal_data)
                                    }
                                </Row>


                                <Row className="mb-3">
                                    {
                                        ProfileExperienceAndEducation()
                                    }
                                </Row>

                                <Row className="mb-3">
                                    {
                                        SocialMediasLinkInput()
                                    }
                                </Row>

                                <Row className="mb-3">
                                    {
                                        SocialMediasLinkInput1()
                                    }
                                </Row>

                                <Row className="mb-3">
                                    {
                                        handleDynamicInputFields(jobs.status === 'succeeded' && jobs.data.form_personal_data)
                                    }
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
    );
}

export default Applyform;







