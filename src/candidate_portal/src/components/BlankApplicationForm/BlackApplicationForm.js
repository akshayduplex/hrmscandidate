import React, { useEffect, useMemo, useState } from 'react';
import {
    Stepper, Step, StepLabel,
    Button, TextField, Grid,
    FormControl, FormLabel, RadioGroup,
    FormControlLabel, Radio, Checkbox,
    Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow,
    Paper,
    Typography,
    IconButton,
    Box,
    MenuItem,
    FormHelperText,
} from '@mui/material';
import { Formik, Form, Field, FieldArray, useFormikContext, getIn, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Add, AddCircleOutline, Delete, DeleteOutline } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import PhotoSignatureUpload from './UploadsDocumetAndPrevies';
import moment from 'moment';
import FamilyDependentsTable from './FamilyDetailsTables';
import StrengthsWeaknessesEditor from './StranthAndWiknessEditore';
import CategoryHealthSection from './DocumentsVerifiecation';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DeclarationSection from './DeclarationVerification';
import axios from 'axios';
import config from '../../config/Config';
import { apiHeaderTokenMultiPart } from '../../helper/My_Helper';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getCandidateById } from '../../helper/Api_Helper';
import ApplicantForm from './ApplicationPreviewForm';


const ApplicationForm = () => {

    const [userDetails, setUserDetails] = useState(null);

    const loginCandidate = useMemo(() => {

        return JSON.parse(sessionStorage.getItem('loginData')) || {};

    }, [])

    const fetchCandidateDetails = async (payloads = { _id: '', scope_fields: [] }) => {
        try {
            let data = await getCandidateById(payloads);

            if (data.status) {
                setUserDetails(data?.data)
            }
        } catch (error) {
            console.log(error, 'this is error')
        }
    }


    useEffect(() => {

        if (loginCandidate) {
            let payloads = {
                "_id": loginCandidate._id,
                "scope_fields": []
            }
            fetchCandidateDetails(payloads);
        }

    }, [loginCandidate])



    const [activeStep, setActiveStep] = useState(0);

    const steps = [
        'Personal Details',
        'Category & Health',
        'Education & Training',
        'Employment History',
    ];

    const employmentSchema = Yup.object().shape({
        company_name_with_address: Yup.string().trim(),
        designation: Yup.string().trim(),
        role_and_responsibility: Yup.string().trim(),
        last_ctc: Yup.number()
            .typeError('Must be a number')
            .positive('Must be positive'),
        from_date: Yup.date(),
        to_date: Yup.date()
            .min(Yup.ref('from_date'), 'End date cannot be before start date'),
        currently_working: Yup.boolean(),
        reason_for_leaving: Yup.string(),
        organization_hr_contact_details: Yup.string()
            .email('Invalid email'),
        reporting_contact_number_name: Yup.string().trim()
    });

    // traning And Education validation -
    const trainingAndExperienceSchema = Yup.array()
        .of(
            Yup.object({
                name_of_course: Yup.string()
                    .trim(),
                institute_name: Yup.string()
                    .trim(),
                learn_project: Yup.string()
                    .trim(),
                duration_from: Yup.date()
                    .typeError('Start date must be a valid date'),
                duration_to: Yup.date()
                    .typeError('End date must be a valid date')
                    .min(
                        Yup.ref('duration_from'),
                        'End date cannot be before start date'
                    ),
                stipend_received: Yup.string()
                    .trim()
            })
        )
        .min(1, 'At least one training or experience entry is required');
    // Form validation schemas for each step
    const validationSchemas = [
        // Step 0: Personal Details (unchanged)
        Yup.object().shape({
            firstName: Yup.string().required('Name is required'),
            photograph: Yup.mixed()
                .required('Image is required')
                .test('fileSize', 'File size is too large', value => !value || (value && value.size <= 2 * 1024 * 1024)),
            signature: Yup.mixed()
                .required('Signature is required')
                .test('fileSize', 'File size is too large', value => !value || (value && value.size <= 2 * 1024 * 1024)),
            surname: Yup.string().required('Surname is required'),
            fatherOrHusbandName: Yup.string().required('Father/Husband Name is required'),
            communicationAddress: Yup.string().required('communication address is required'),
            communicationPin: Yup.string()
                .required('Pin code is required')
                .matches(/^\d{6}$/, 'Invalid PIN'),
            communicationMobile: Yup.string()
                .required('Mobile number is required')
                .matches(/^\d{10}$/, 'Invalid mobile'),
            dob: Yup.date().required('Date of Birth is required'),
            gender: Yup.string().required('Gender is required'),
            permanentAddress: Yup.string().required('Permanent address is required'),
            permanentPin: Yup.string().required('Pin code is required')
                .matches(/^\d{6}$/, 'Invalid PIN'),
            permanentMobile: Yup.string().required('Mobile number is required')
                .matches(/^\d{10}$/, 'Invalid mobile'),
            maritalStatus: Yup.string().required('Marital Status is required'),
            languages: Yup.array()
                .of(
                    Yup.object().shape({
                        language: Yup.string().required('Language is required'),
                        read: Yup.boolean(),
                        speak: Yup.boolean(),
                        write: Yup.boolean()
                    })
                )
                .min(1, 'At least one language must be added')
        }),
        // Step 1: Family Details (FIXED with function syntax)
        Yup.object().shape({
            familyDependents: Yup.array()
                .of(
                    Yup.object().shape({
                        particular: Yup.string()
                            .required('Particular is required')
                            .oneOf(
                                ['Father', 'Mother', 'Wife/Husband', 'Children', 'Brothers', 'Sisters'],
                                'Invalid particular'
                            ),
                        name: Yup.string().required('Name is required'),
                        age: Yup.number()
                            .typeError('Age must be a number')
                            .positive('Age must be positive')
                            .integer('Age must be an integer')
                            .required('Age is required'),
                        occupation: Yup.string().required('Occupation is required'),
                        dependent: Yup.boolean()
                    })
                )
                .min(1, 'At least one family dependent is required'),
            strengths: Yup.string().required('Strengths are required'),
            weaknesses: Yup.string().required('Weaknesses are required'),

            scStObcExService: Yup.object().shape({
                belongs: Yup.string()
                    .required('Please select Yes or No.'),
                details: Yup.string().when('belongs', {
                    is: 'yes',
                    then: (schema) =>
                        schema
                            .required('Please specify details.'),   // when yes → required
                    otherwise: (schema) =>
                        schema.notRequired(),                     // when no  → keep it optional
                }),

                document: Yup.mixed().when('belongs', {
                    is: 'yes',
                    then: (schema) =>
                        schema
                            .required('Please upload a document.'), // when yes → required
                    otherwise: (schema) =>
                        schema.notRequired(),                     // when no  → optional
                }),
            }),
            physicallyHandicapped: Yup.object().shape({
                belongs: Yup.string()
                    .required('Please select Yes or No.'),
                details: Yup.string().when('belongs', {
                    is: 'yes',
                    then: (schema) =>
                        schema
                            .required('Please specify details.'),   // when yes → required
                    otherwise: (schema) =>
                        schema.notRequired(),                     // when no  → keep it optional
                }),

                document: Yup.mixed().when('belongs', {
                    is: 'yes',
                    then: (schema) =>
                        schema
                            .required('Please upload a document.'), // when yes → required
                    otherwise: (schema) =>
                        schema.notRequired(),                     // when no  → optional
                }),

            }),
            majorAilments: Yup.object().shape({
                belongs: Yup.string()
                    .required('Please select Yes or No.'),
                details: Yup.string().when('belongs', {
                    is: 'yes',
                    then: (schema) =>
                        schema
                            .required('Please specify details.'),
                    otherwise: (schema) =>
                        schema.notRequired(),
                }),
                document: Yup.mixed().when('belongs', {
                    is: 'yes',
                    then: (schema) =>
                        schema
                            .required('Please upload a document.'),
                    otherwise: (schema) =>
                        schema.notRequired(),
                }),
            }),
            arrestedConvicted: Yup.object().shape({
                hasBeenConvicted: Yup.string().required('Please select Yes or No.'),
                details: Yup.string().when('hasBeenConvicted', {
                    is: 'yes',
                    then: (schema) => schema.required('Please specify details'),
                    otherwise: (schema) => schema.notRequired()
                })
            })
        }),
        // Step 2: Category & Health (placeholder)
        Yup.object().shape({
            isBeforeWorkingOrg: Yup.object({
                working: Yup.string()
                    .oneOf(['yes', 'no'], 'Please select Yes or No')
                    .required('This field is required'),
                person: Yup.object({
                    project_name: Yup.string(),
                    designation: Yup.string(),
                    reporting_person: Yup.string(),
                    from_date: Yup.date().nullable(),
                    to_date: Yup.date().nullable(),
                    reason_for_leaving_work: Yup.string(),
                })
                    .when('working', {
                        is: 'yes',
                        then: (schema) =>
                            schema.shape({
                                project_name: Yup.string().required('Project name is required'),
                                designation: Yup.string().required('Designation is required'),
                                reporting_person: Yup.string().required('Reporting person is required'),
                                from_date: Yup.date()
                                    .required('From date is required'),
                                to_date: Yup.date()
                                    .required('To date is required')
                                    .min(
                                        Yup.ref('from_date'),
                                        'To date cannot be before From date'
                                    ),
                                reason_for_leaving_work: Yup.string().required(
                                    'Reason for leaving is required'
                                ),
                            }),
                        otherwise: (schema) => schema,
                    }),
            }),


            isRelativeWorkingWithSame: Yup.object().shape({
                working: Yup.string()
                    .oneOf(['yes', 'no'], 'Please select Yes or No')
                    .required('This field is required'),
                person: Yup.object({
                    name: Yup.string().trim(),
                    department: Yup.string().trim(),
                    relation: Yup.string().trim(),
                })
                    .when('working', {
                        is: 'yes',
                        then: (schema) =>
                            schema.shape({
                                name: Yup.string().required('Name is required'),
                                department: Yup.string().required('Department is required'),
                                relation: Yup.string().required('Relation is required'),
                            }),
                        otherwise: (schema) => schema,
                    })
            }),

            educationOrQualification: Yup.array().of(
                Yup.object().shape({
                    collage_name: Yup.string()
                        .trim()
                        .required('College/University name is required'),
                    degree: Yup.string()
                        .trim()
                        .required('Degree is required'),
                    major_subject: Yup.string()
                        .trim()
                        .required('Major subject is required'),
                    percentage: Yup.number()
                        .typeError('Percentage must be a number')
                        .required('Percentage is required')
                        .min(0, 'Percentage cannot be negative')
                        .max(100, 'Percentage cannot exceed 100'),
                    from_date: Yup.date()
                        .typeError('From Date must be a valid date')
                        .required('From Date is required'),

                    to_date: Yup.date()
                        .typeError('To Date must be a valid date')
                        .required('To Date is required')
                        .min(
                            Yup.ref('from_date'),
                            'To Date cannot be before From Date'
                        ),
                    type_of_education: Yup.string()
                        .oneOf(['full_time', 'part_time'], 'Please Select Full Time / Part Time')
                        .required('Type of Education is required'),
                    years_of_passing: Yup.number()
                        .typeError('Year of passing must be a number')
                        .required('Year of passing is required')
                        .min(1900, 'Year seems too early')
                        .max(new Date().getFullYear(), 'Year cannot be in the future')
                })
            ),
            trainingAndExperience: trainingAndExperienceSchema,
            scholarship_any_association: Yup.string().trim().required('Please Specified'),
            extracurricular_activity: Yup.string().trim().required('Please Specified')
        }),
        // Step 3: Education & Training (placeholder)
        Yup.object().shape({
            employment_history: Yup.array().of(employmentSchema),
            salary_Structure: Yup.object().shape(
                {
                    basic: Yup.number()
                        .typeError('Basic amount must be a number')
                        .required('Basic amount is required')
                        .min(0, 'Must be at least 0'),
                    provident_fund: Yup.number()
                        .typeError('Provident fund amount must be a number')
                        .required('Provident fund amount is required')
                        .min(0, 'Must be at least 0'),
                    hra_cla: Yup.number()
                        .typeError('HRA / CLA  amount must be a number')
                        .required('HRA / CLA fund amount is required')
                        .min(0, 'Must be at least 0'),
                    superannuation: Yup.number()
                        .typeError('Superannuation  amount must be a number')
                        .required('Superannuation fund amount is required')
                        .min(0, 'Must be at least 0'),
                    conveyance: Yup.number()
                        .typeError('Conveyance  amount must be a number')
                        .required('Conveyance  amount is required')
                        .min(0, 'Must be at least 0'),
                    gratuity: Yup.number()
                        .typeError('Gratuity  amount must be a number')
                        .required('Gratuity  amount is required')
                        .min(0, 'Must be at least 0'),
                    medical_reimbursements: Yup.number()
                        .typeError('Medical Reimbursements Amount must be a number')
                        .required('Medical Reimbursements  amount is required')
                        .min(0, 'Must be at least 0'),
                    petrol_reimbursement: Yup.number()
                        .typeError('Petrol Reimbursement Amount must be a number')
                        .required('Petrol Reimbursement  amount is required')
                        .min(0, 'Must be at least 0'),
                    attire_reimbursement: Yup.number()
                        .typeError('Attire Reimbursement Amount must be a number')
                        .required('Attire Reimbursement  amount is required')
                        .min(0, 'Must be at least 0'),
                    lta: Yup.number()
                        .typeError('LTA Amount must be a number')
                        .required('LTA  amount is required')
                        .min(0, 'Must be at least 0'),
                    subscription_allowance: Yup.number()
                        .typeError('Subscription Allowance Amount must be a number')
                        .required('Subscription Allowance  amount is required')
                        .min(0, 'Must be at least 0'),
                    performance_bonus: Yup.number()
                        .typeError('Performance Bonus Amount must be a number')
                        .required('Performance Bonus  amount is required')
                        .min(0, 'Must be at least 0'),
                    telephone_reimbursement: Yup.number()
                        .typeError('Telephone Reimbursement Amount must be a number')
                        .required('Telephone Reimbursement  amount is required')
                        .min(0, 'Must be at least 0'),
                    other: Yup.number()
                        .typeError('Any other (pls. specify) Amount must be a number')
                        .required('Any other (pls. specify)  amount is required')
                        .min(0, 'Must be at least 0'),
                    driver_salary: Yup.number()
                        .typeError('Driver Salary Amount must be a number')
                        .required('Driver Salary  amount is required')
                        .min(0, 'Must be at least 0'),
                    children_education_allow: Yup.number()
                        .typeError('Children’s Education Allow Amount must be a number')
                        .required('Children’s Education Allow  amount is required')
                        .min(0, 'Must be at least 0'),
                    professional_development: Yup.number()
                        .typeError('Professional Development Amount must be a number')
                        .required('Professional Development  amount is required')
                        .min(0, 'Must be at least 0'),
                    any_other: Yup.number()
                        .typeError('Any other (pls. specify amount must be a number')
                        .required('Any other (pls. specify  amount is required')
                        .min(0, 'Must be at least 0'),
                }
            ),
            joining_details: Yup.object().shape(
                {
                    minimum_joining_period: Yup.string().trim(),
                    notice_period_of_current_emp: Yup.string().trim(),
                    preferred_location: Yup.string().trim(),
                    constant_location: Yup.string().trim()
                }
            ),
            reference: Yup.array()
                .of(
                    Yup.object().shape({
                        name_of_reference: Yup.string().trim(),
                        designation_organization: Yup.string().trim(),
                        email: Yup.string().trim().email('Invalid email format'),
                        relation_ship_with_self: Yup.string().trim(),
                        contact_number: Yup.string().trim().matches(/^[0-9]{10,15}$/, 'Contact number must be 10-15 digits'),
                    })
                )
                .test(
                    'at-least-one-complete-reference',
                    'At least one complete reference is required',
                    (references = []) => {
                        return references.some(ref =>
                            ref.name_of_reference &&
                            ref.designation_organization &&
                            ref.email &&
                            ref.relation_ship_with_self &&
                            ref.contact_number
                        );
                    }
                ),
            acceptDeclaration: Yup.boolean()
                .oneOf([true], 'You must agree to the declaration')
                .required('You must agree to the declaration'),
        }),
    ];

    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            ['clean']
        ]
    };

    const editorStyle = {
        '.ql-container': {
            minHeight: '200px',
            maxHeight: '200px',
            overflowY: 'auto',
            backgroundColor: 'white',
            borderRadius: '4px'
        },
        '.ql-editor': {
            minHeight: '150px',
            maxHeight: '200px',
            overflowY: 'auto'
        }
    };


    const initialValues = {
        photograph: null,
        photoPreview: null,
        signature: null,
        signaturePreview: null,
        firstName: '',
        middleName: '',
        surname: '',
        fatherOrHusbandName: '',
        communicationAddress: '',
        communicationPin: '',
        communicationTel: '',
        communicationMobile: '',
        communicationEmail: '',
        permanentAddress: '',
        permanentPin: '',
        permanentTel: '',
        permanentMobile: '',
        dob: '',
        age: '',
        gender: '',
        maritalStatus: '',
        languages: [{ language: '', read: false, speak: false, write: false }],

        // second steps -
        familyDependents: [
            { particular: '', name: '', age: '', occupation: '', dependent: false }
        ],
        strengths: '',
        weaknesses: '',

        scStObcExService: {
            belongs: 'no',
            details: '',
            document: null,
        },
        physicallyHandicapped: {
            belongs: 'no', // 'yes' or 'no'
            details: '',
            document: null,
        },
        majorAilments: {
            belongs: 'no', // 'yes' or 'no'
            details: '',
            document: null,
        },

        arrestedConvicted: {
            hasBeenConvicted: 'no', // 'yes' or 'no'
            details: '',
        },

        isBeforeWorkingOrg: {
            working: 'no',
            person: {
                project_name: '',
                designation: '',
                reporting_person: '',
                from_date: '',
                to_date: '',
                reason_for_leaving_work: '',
            }
        },

        isRelativeWorkingWithSame: {
            working: 'no',
            person: {
                name: '',
                department: '',
                relation: "",
            }
        },

        educationOrQualification: [
            {
                collage_name: '',
                degree: '',
                major_subject: '',
                percentage: '',
                course_duration: "",
                from_date: '',
                to_date: '',
                years_of_passing: '',
                type_of_education: '',
            }
        ],
        trainingAndExperience: [
            {
                name_of_course: '',
                institute_name: '',
                learn_project: '',
                duration_from: '',
                duration_to: '',
                stipend_received: ''
            }
        ],

        scholarship_any_association: '',
        extracurricular_activity: '',

        employment_history: [
            {
                company_name_with_address: '',
                designation: '',
                role_and_responsibility: '',
                last_ctc: '',
                from_date: '',
                to_date: '',
                currently_working: false,
                reason_for_leaving: '',
                organization_hr_contact_details: '',
                reporting_contact_number_name: '',
            }
        ],

        salary_Structure: {
            basic: '0',
            provident_fund: '0',
            hra_cla: '0',
            superannuation: '0',
            conveyance: '0',
            gratuity: "0",
            medical_reimbursements: '0',
            petrol_reimbursement: '0',
            attire_reimbursement: '0',
            lta: '0',
            subscription_allowance: '0',
            performance_bonus: '0',
            telephone_reimbursement: '0',
            other: '0',
            driver_salary: '0',
            children_education_allow: '0',
            professional_development: '0',
            any_other: '0',
        },

        joining_details: {
            minimum_joining_period: '',
            notice_period_of_current_emp: '',
            preferred_location: '',
            constant_location: '',
        },

        reference: [
            {
                name_of_reference: '',
                designation_organization: '',
                email: '',
                relation_ship_with_self: '',
                contact_number: ''
            },
            {
                name_of_reference: '',
                designation_organization: '',
                email: '',
                relation_ship_with_self: '',
                contact_number: ''
            }
        ],

        acceptDeclaration: false

    };

    const StepNavigation = ({ activeStep, steps, handleBack }) => {
        const { validateForm, setTouched } = useFormikContext();

        const touchAll = (errs) => {
            if (!errs || typeof errs !== 'object') {
                return true;
            }
            return Object.keys(errs).reduce((acc, key) => {
                acc[key] = touchAll(errs[key]);
                return acc;
            }, {});
        };

        const handleNext = async () => {
            const errors = await validateForm();
            const stepFields = Object.keys(validationSchemas[activeStep]?.fields || {});
            // Pick only the errors for this step
            const currentStepErrors = Object.keys(errors).reduce((acc, key) => {
                if (stepFields.includes(key)) {
                    acc[key] = errors[key];
                }
                return acc;
            }, {});

            // Turn error messages into a parallel touched structure
            const touchedForStep = touchAll(currentStepErrors);
            setTouched(touchedForStep);

            // If any errors remain, don't advance
            if (Object.keys(currentStepErrors).length > 0) {
                return;
            }

            // Otherwise move on
            setActiveStep(prev => prev + 1);
        };



        return (
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
                <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                >
                    Back
                </Button>

                {activeStep < steps.length - 1 ? (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                        sx={{ ml: 2 }}
                    >
                        Next
                    </Button>
                ) : (
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ ml: 2 }}
                    >
                        Submit
                    </Button>
                )}
            </div>
        );
    };

    const handleBack = () => setActiveStep(prev => prev - 1);
    const handleSubmit = async (values = initialValues) => {

        let communicationAddress = {
            address: values.communicationAddress,
            pincode: values.communicationPin,
            telephone: values.communicationTel,
            mobile_no: values.communicationMobile,
            email_id: values.communicationEmail
        }

        const permanentAddress = {
            address: values.permanentAddress,
            pincode: values.permanentPin,
            telephone: values.permanentTel,
            mobile_no: values.permanentMobile
        }

        const dateOfBirth = {
            date: moment(values.dob).date(), // 1–31
            month: moment(values.dob).format('MMMM'), // "July"
            year: moment(values.dob).year(), // 2025
            in_words: values.age + " years", // "8th July 2025"
        };

        const language = values.languages?.map((item) => {
            return {
                name: item?.language,
                read: item?.read ? 'yes' : 'no',
                speak: item?.speak ? 'yes' : 'no',
                write: item?.write ? 'yes' : 'no',
            }
        })

        let family_members = values?.familyDependents?.map((item) => {
            return {
                particulars: item?.particular,
                name: item?.name,
                age: item?.age,
                occupation: item?.occupation,
                is_dependent: item?.dependent ? 'yes' : 'no'
            }
        })

        const workingOrg = [
            {
                "projct_name": values.isBeforeWorkingOrg.person.project_name,
                "designation": values.isBeforeWorkingOrg.person.designation,
                "reporting_person": values.isBeforeWorkingOrg.person.reporting_person,
                "from": values.isBeforeWorkingOrg.person.from_date,
                "to": values.isBeforeWorkingOrg.person.to_date,
                "reason": values.isBeforeWorkingOrg.person.reason_for_leaving_work
            }
        ]

        const relation = [
            {
                "name": values.isRelativeWorkingWithSame.person.name,
                "department": values.isRelativeWorkingWithSame.person.department,
                "relation": values.isRelativeWorkingWithSame.person.relation,
            }
        ]

        const qualification = values.educationOrQualification?.map((item) => {
            return {
                "school_college": item?.collage_name,
                "degree": item?.degree,
                "subject": item?.major_subject,
                "marks": item?.percentage,
                "duration_from": item?.from_date,
                "duration_to": item?.to_date,
                "passing_year": item?.years_of_passing,
                "course_type": item?.type_of_education
            }
        })

        const training = values.trainingAndExperience.map((item) => {
            return {
                "course": item.name_of_course,
                "organization": item.institute_name,
                "subject_project": item.learn_project,
                "duration_from": item.duration_from,
                "duration_to": item.duration_to,
                "stipend_recieved": item.stipend_received
            }
        })

        const employment_history = values.employment_history?.map((item) => {
            return {
                "org_name": item.company_name_with_address,
                "designation": item.designation,
                "nature_of_work": item.role_and_responsibility,
                "ctc": item.last_ctc,
                "duration_from": item.from_date,
                "duration_to": item.currently_working ? "Till Now" : item.to_date,
                "currently_working": item.currently_working ? "yes" : "no",
                "organization_email": item.organization_hr_contact_details,
                "reporting_person_email": item.reporting_contact_number_name,
                "reporting_person_mobile": item.reason_for_leaving
            }
        })

        const pay_slip = {
            "basic": values.salary_Structure.basic,
            "hra_cla": values.salary_Structure.hra_cla,
            "conveyance": values.salary_Structure.conveyance,
            "petrol_reimbursement": values.salary_Structure.petrol_reimbursement,
            "attire_reimbursement": values.salary_Structure.attire_reimbursement,
            "subscription_allowance": values.salary_Structure.subscription_allowance,
            "telephone_reimbursement": values.salary_Structure.telephone_reimbursement,
            "driver_salary": values.salary_Structure.driver_salary,
            "childrens_education_allow": values.salary_Structure.children_education_allow,
            "professional_development": values.salary_Structure.professional_development,
            "monthly_any_other": values.salary_Structure.any_other,
            "provident_fund": values.salary_Structure.provident_fund,
            "superannuation": values.salary_Structure.superannuation,
            "gratuity": values.salary_Structure.gratuity,
            "medical_reimbursements": values.salary_Structure.medical_reimbursements,
            "lta": values.salary_Structure.lta,
            "performance_bonus": values.salary_Structure.performance_bonus,
            "annual_any_other": values.salary_Structure.other
        }

        const references_other_than_family = values.reference.map((item) => {
            return {
                "name": item.name_of_reference,
                "designation": item.designation_organization,
                "email": item.email,
                "mobile": item.contact_number,
                "relation": item.relation_ship_with_self
            }
        })

        let formData = new FormData();
        formData.append('candidate_id', loginCandidate?._id)
        formData.append('first_name', values.firstName)
        formData.append('middle_name', values.middleName)
        formData.append('surname', values.surname)
        formData.append('father_hushband_name', values.fatherOrHusbandName)

        formData.append('communication_address', JSON.stringify(communicationAddress))
        formData.append('permanent_address', JSON.stringify(permanentAddress))
        formData.append('dob', JSON.stringify(dateOfBirth))
        formData.append('gender', values.gender)
        formData.append('marital_status', values.maritalStatus)
        formData.append('language', JSON.stringify(language))
        formData.append('strength', values.strengths)
        formData.append('weakness', values.weaknesses)
        formData.append('family_members', JSON.stringify(family_members))
        formData.append('belongs_to_category', values.scStObcExService.belongs)
        if (values.scStObcExService.belongs === 'yes') {
            formData.append('belongs_to_category_proof_image', values.scStObcExService.document)
            formData.append('belongs_to_category_details', values.scStObcExService.details)
        }
        formData.append('physically_handicapped', values.physicallyHandicapped.belongs)
        if (values.physicallyHandicapped.belongs === 'yes') {
            formData.append('physically_handicapped_proof_image', values.physicallyHandicapped.document)
            formData.append('physically_handicapped_details', values.physicallyHandicapped.details)
        }
        formData.append('major_alignments', values.majorAilments.belongs)
        if (values.majorAilments.belongs === 'yes') {
            formData.append('major_alignments_image', values.majorAilments.document)
            formData.append('major_alignments_details', values.majorAilments.details)
        }
        formData.append('arrested_convicted_by_court', values.arrestedConvicted.hasBeenConvicted)
        if (values.arrestedConvicted.hasBeenConvicted === 'yes') {
            formData.append('arrested_convicted_by_court_details', values.arrestedConvicted.details)
        }
        formData.append('is_before_work_in_orgainization', values.isBeforeWorkingOrg.working);
        if (values.isBeforeWorkingOrg.working === 'yes') {
            formData.append("before_work_in_orgainization", JSON.stringify(workingOrg))
        }
        formData.append('relationship_associate_status', values.isRelativeWorkingWithSame.working);

        if (values.isRelativeWorkingWithSame.working === 'yes') {
            formData.append("relationship_associate_list", JSON.stringify(relation))
        }
        formData.append("qualification", JSON.stringify(qualification))
        formData.append("training", JSON.stringify(training))
        formData.append("scholarship", values.scholarship_any_association)
        formData.append("extracurricular_activities", values.extracurricular_activity)
        formData.append("employment_history", JSON.stringify(employment_history))
        formData.append("pay_slip", JSON.stringify(pay_slip))
        formData.append("references_other_than_family", JSON.stringify(references_other_than_family))
        formData.append("signature", values.signature)
        formData.append("profile_image", values.photograph)

        try {
            let response = await axios.post(`${config.API_URL}saveApplicantForm`, formData, apiHeaderTokenMultiPart());

            if (response.status === 200) {

                toast.success(response.data?.message)

                let payloads = {
                    "_id": loginCandidate._id,
                    "scope_fields": []
                }
                fetchCandidateDetails(payloads)

            } else {
                // console.log(response.data)
                toast.error(response.data?.message)
            }

        } catch (error) {

            console.log(error)
            toast.error((error?.response.data?.message && error?.response.data?.message) || error.message || 'Something went wrong')
        }
    };

    return (
        <>
            <div className="maincontent">
                <div className="container animate__animated animate__fadeIn animate__slower">
                    <div className="contentwrap">
                        <div className="contentbox">
                            <div className="contenthdr">
                                <h4> For Application Form </h4>
                            </div>
                            {
                                userDetails && userDetails?.applicant_form_status && userDetails?.applicant_form_status === 'Complete' ?
                                    <ApplicantForm candidate_data={userDetails} /> :
                                    <Formik
                                        initialValues={initialValues}
                                        validationSchema={validationSchemas[activeStep]}
                                        onSubmit={handleSubmit}
                                        validateOnBlur={true}
                                        validateOnChange={true}
                                    >
                                        {({ values, errors, touched, setFieldValue, submitCount, setFieldTouched }) => (
                                            <Form>
                                                <Stepper activeStep={activeStep} alternativeLabel>
                                                    {steps.map(label => (
                                                        <Step key={label}>
                                                            <StepLabel>{label}</StepLabel>
                                                        </Step>
                                                    ))}
                                                </Stepper>

                                                {activeStep === 0 && (
                                                    <Grid container spacing={3}>
                                                        {/* Photo Upload Section */}
                                                        <Grid item xs={12} sx={{ mt: 2 }}>
                                                            <PhotoSignatureUpload />
                                                        </Grid>

                                                        {/* Name Fields */}
                                                        <Grid item xs={12}>
                                                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                                                1.Name
                                                            </Typography>
                                                            <Grid container spacing={2}>
                                                                <Grid item xs={12} md={4}>
                                                                    <Field
                                                                        as={TextField}
                                                                        name="firstName"
                                                                        label="First Name"
                                                                        fullWidth
                                                                        required
                                                                        size="small"
                                                                        margin="dense"
                                                                        error={touched.firstName && !!errors.firstName}
                                                                        helperText={touched.firstName && errors.firstName}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} md={4}>
                                                                    <Field
                                                                        as={TextField}
                                                                        name="middleName"
                                                                        label="Middle Name"
                                                                        fullWidth
                                                                        size="small"
                                                                        margin="dense"
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} md={4}>
                                                                    <Field
                                                                        as={TextField}
                                                                        name="surname"
                                                                        label="Surname"
                                                                        fullWidth
                                                                        size="small"
                                                                        margin="dense"
                                                                        required
                                                                        error={touched.surname && !!errors.surname}
                                                                        helperText={touched.surname && errors.surname}
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>

                                                        {/* Father's/Husband's Name */}
                                                        <Grid item xs={12}>
                                                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                                                2. Father’s / Husband’s Name*
                                                            </Typography>
                                                            <Field
                                                                as={TextField}
                                                                name="fatherOrHusbandName"
                                                                label="Father's / Husband's Name"
                                                                fullWidth
                                                                size="small"
                                                                margin="dense"
                                                                required
                                                                error={touched.fatherOrHusbandName && !!errors.fatherOrHusbandName}
                                                                helperText={touched.fatherOrHusbandName && errors.fatherOrHusbandName}
                                                            />
                                                        </Grid>

                                                        {/* Address Section */}
                                                        <Grid item xs={12}>
                                                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                                                3. Address for Communication
                                                            </Typography>
                                                            <Grid container spacing={2}>
                                                                <Grid item xs={12}>
                                                                    <Field
                                                                        as={TextField}
                                                                        name="communicationAddress"
                                                                        label="Full Address"
                                                                        fullWidth
                                                                        multiline
                                                                        rows={3}
                                                                        required
                                                                        error={touched.communicationAddress && !!errors.communicationAddress}
                                                                        helperText={touched.communicationAddress && errors.communicationAddress}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={6} md={3}>
                                                                    <Field
                                                                        as={TextField}
                                                                        name="communicationPin"
                                                                        value={values.communicationPin}
                                                                        label="Pin Code"
                                                                        onChange={(e) => {
                                                                            const onlyNums = e.target.value?.replace(/\D/g, '');
                                                                            if (onlyNums?.length <= 6) {
                                                                                setFieldValue(e.target.name, onlyNums);
                                                                            }
                                                                        }}
                                                                        fullWidth
                                                                        size="small"
                                                                        margin="dense"
                                                                        error={touched.communicationPin && !!errors.communicationPin}
                                                                        helperText={touched.communicationPin && errors.communicationPin}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={6} md={3}>
                                                                    <Field
                                                                        as={TextField}
                                                                        name="communicationTel"
                                                                        label="Telephone No"
                                                                        fullWidth
                                                                        size="small"
                                                                        margin="dense"
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={6} md={3}>
                                                                    <Field
                                                                        as={TextField}
                                                                        name="communicationMobile"
                                                                        label="Mobile No"
                                                                        value={values.communicationMobile}
                                                                        onChange={(e) => {
                                                                            const onlyNums = e.target.value?.replace(/\D/g, '');
                                                                            if (onlyNums?.length <= 10) {
                                                                                setFieldValue(e.target.name, onlyNums);
                                                                            }
                                                                        }}
                                                                        fullWidth
                                                                        required
                                                                        size="small"
                                                                        margin="dense"
                                                                        error={touched.communicationMobile && !!errors.communicationMobile}
                                                                        helperText={touched.communicationMobile && errors.communicationMobile}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={6} md={3}>
                                                                    <Field
                                                                        as={TextField}
                                                                        name="communicationEmail"
                                                                        label="Email ID"
                                                                        fullWidth
                                                                        type="email"
                                                                        size="small"
                                                                        margin="dense"
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>

                                                        {/* Permanent Address */}
                                                        <Grid item xs={12}>
                                                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                4. Permanent Address -
                                                                <FormControlLabel
                                                                    control={<Checkbox onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            setFieldValue('permanentAddress', values.communicationAddress);
                                                                            setFieldValue('permanentPin', values.communicationPin);
                                                                            setFieldValue('permanentTel', values.communicationTel);
                                                                            setFieldValue('permanentMobile', values.communicationMobile);
                                                                        } else {
                                                                            setFieldValue('permanentAddress', '');
                                                                            setFieldValue('permanentPin', '');
                                                                            setFieldValue('permanentTel', '');
                                                                            setFieldValue('permanentMobile', '');
                                                                        }
                                                                    }} />}
                                                                    label="Same as communication address"
                                                                    sx={{ m: 0 }}
                                                                />
                                                            </Typography>
                                                            <Grid container spacing={2}>
                                                                <Grid item xs={12}>
                                                                    <Field
                                                                        as={TextField}
                                                                        name="permanentAddress"
                                                                        label="Full Address"
                                                                        fullWidth
                                                                        multiline
                                                                        required
                                                                        rows={3}
                                                                        error={touched.permanentAddress && !!errors.permanentAddress}
                                                                        helperText={touched.permanentAddress && errors.permanentAddress}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={6} md={3}>
                                                                    <Field
                                                                        as={TextField}
                                                                        name="permanentPin"
                                                                        label="Pin Code"
                                                                        fullWidth
                                                                        onChange={(e) => {
                                                                            const onlyNums = e.target.value?.replace(/\D/g, '');
                                                                            if (onlyNums?.length <= 6) {
                                                                                setFieldValue(e.target.name, onlyNums);
                                                                            }
                                                                        }}
                                                                        size="small"
                                                                        margin="dense"
                                                                        error={touched.permanentPin && !!errors.permanentPin}
                                                                        helperText={touched.permanentPin && errors.permanentPin}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={6} md={3}>
                                                                    <Field
                                                                        as={TextField}
                                                                        name="permanentTel"
                                                                        label="Telephone No"
                                                                        fullWidth
                                                                        size="small"
                                                                        margin="dense"
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={6} md={3}>
                                                                    <Field
                                                                        as={TextField}
                                                                        name="permanentMobile"
                                                                        label="Mobile No"
                                                                        onChange={(e) => {
                                                                            const onlyNums = e.target.value?.replace(/\D/g, '');
                                                                            if (onlyNums?.length <= 10) {
                                                                                setFieldValue(e.target.name, onlyNums);
                                                                            }
                                                                        }}
                                                                        fullWidth
                                                                        size="small"
                                                                        margin="dense"
                                                                        error={touched.permanentMobile && !!errors.permanentMobile}
                                                                        helperText={touched.permanentMobile && errors.permanentMobile}
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>

                                                        {/* Personal Details */}
                                                        <Grid item xs={12}>
                                                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                                                5.Date Of Birth & Age
                                                            </Typography>
                                                            <Grid container spacing={2}>
                                                                <Grid item xs={12} sm={6} md={6}>
                                                                    <Field
                                                                        as={TextField}
                                                                        name="dob"
                                                                        label="Date of Birth"
                                                                        fullWidth
                                                                        type="date"
                                                                        size="small"
                                                                        margin="dense"
                                                                        InputLabelProps={{ shrink: true }}
                                                                        InputProps={{
                                                                            inputProps: {
                                                                                max: moment().subtract(10, 'years').format('YYYY-MM-DD'),
                                                                            }
                                                                        }}
                                                                        error={touched.dob && !!errors.dob}
                                                                        helperText={touched.dob && errors.dob}
                                                                        onChange={(e) => {
                                                                            const dobValue = e.target.value;
                                                                            setFieldValue('dob', dobValue);
                                                                            if (dobValue) {
                                                                                const birthDate = moment(dobValue, 'YYYY-MM-DD');
                                                                                const today = moment();
                                                                                const age = today.diff(birthDate, 'years');
                                                                                setFieldValue('age', age);
                                                                            } else {
                                                                                setFieldValue('age', '');
                                                                            }
                                                                        }}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={6} md={6}>
                                                                    <Field
                                                                        as={TextField}
                                                                        name="age"
                                                                        label="Age"
                                                                        fullWidth
                                                                        type="text"
                                                                        size="small"
                                                                        margin="dense"
                                                                        disabled
                                                                    />
                                                                </Grid>
                                                            </Grid>

                                                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
                                                                6. Marital Status / Gender
                                                            </Typography>

                                                            <Grid container spacing={2}>

                                                                <Grid item xs={12} sm={6} md={6}>
                                                                    <FormControl
                                                                        component="fieldset"
                                                                        fullWidth
                                                                        required
                                                                        size="small"
                                                                        margin="dense"
                                                                        error={(errors.maritalStatus && touched.maritalStatus) || (errors.maritalStatus && submitCount > 0)}
                                                                    >
                                                                        <FormLabel component="legend">Marital Status</FormLabel>
                                                                        <Box
                                                                            sx={{
                                                                                border: (errors.maritalStatus && touched.maritalStatus) || (errors.maritalStatus && submitCount > 0) ? '1px solid red' : '1px solid #ccc',
                                                                                borderRadius: '4px',
                                                                                p: 1
                                                                            }}
                                                                        >
                                                                            <Field name="maritalStatus">
                                                                                {({ field }) => (
                                                                                    <RadioGroup {...field} row>
                                                                                        <FormControlLabel value="single" control={<Radio />} label="Single" />
                                                                                        <FormControlLabel value="married" control={<Radio />} label="Married" />
                                                                                        <FormControlLabel value="divorced" control={<Radio />} label="Divorced" />
                                                                                        <FormControlLabel value="widowed" control={<Radio />} label="Widowed" />
                                                                                    </RadioGroup>
                                                                                )}
                                                                            </Field>
                                                                        </Box>
                                                                        {(errors.maritalStatus && touched.maritalStatus) || (errors.maritalStatus && submitCount > 0) && (
                                                                            <Typography variant="caption" color="error">
                                                                                {errors.maritalStatus}
                                                                            </Typography>
                                                                        )}
                                                                    </FormControl>
                                                                </Grid>

                                                                <Grid item xs={12} sm={6} md={6}>
                                                                    <FormControl
                                                                        component="fieldset"
                                                                        fullWidth
                                                                        size="small"
                                                                        margin="dense"
                                                                        required
                                                                        error={(errors.gender && touched.gender) || (errors.gender && submitCount > 0)}
                                                                    >
                                                                        <FormLabel component="legend">Gender</FormLabel>
                                                                        <Box
                                                                            sx={{
                                                                                border: (errors.gender && touched.gender) || (errors.gender && submitCount > 0) ? '1px solid red' : '1px solid #ccc',
                                                                                borderRadius: '4px',
                                                                                p: 1
                                                                            }}
                                                                        >
                                                                            <Field name="gender">
                                                                                {({ field }) => (
                                                                                    <RadioGroup {...field} row>
                                                                                        <FormControlLabel
                                                                                            value="male"
                                                                                            control={<Radio />}
                                                                                            label="Male"
                                                                                        />
                                                                                        <FormControlLabel
                                                                                            value="female"
                                                                                            control={<Radio />}
                                                                                            label="Female"
                                                                                        />
                                                                                    </RadioGroup>
                                                                                )}
                                                                            </Field>
                                                                        </Box>

                                                                        {((errors.gender && touched.gender) || (errors.gender && submitCount > 0)) && (
                                                                            <Typography variant="caption" color="error">
                                                                                {errors.gender}
                                                                            </Typography>
                                                                        )}
                                                                    </FormControl>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>

                                                        {/* Languages Section */}
                                                        <Grid item xs={12}>
                                                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                                                7. Languages Known (Specify mother tongue first)
                                                            </Typography>
                                                            <FieldArray name="languages">
                                                                {({ push, remove }) => (
                                                                    <>
                                                                        <TableContainer component={Paper} sx={{
                                                                            mb: 2,
                                                                            border: (errors.languages && touched.languages) || (errors.languages && submitCount > 0) ? '2px solid red' : '1px solid #ccc',
                                                                            borderRadius: '4px'
                                                                        }}>
                                                                            <Table size="small">
                                                                                <TableHead>
                                                                                    <TableRow>
                                                                                        <TableCell>Language</TableCell>
                                                                                        <TableCell align="center">Read</TableCell>
                                                                                        <TableCell align="center">Speak</TableCell>
                                                                                        <TableCell align="center">Write</TableCell>
                                                                                        <TableCell align="center">Actions</TableCell>
                                                                                    </TableRow>
                                                                                </TableHead>
                                                                                <TableBody>
                                                                                    {values.languages.map((_, index) => {
                                                                                        const fieldError =
                                                                                            errors.languages &&
                                                                                            Array.isArray(errors.languages) &&
                                                                                            errors.languages[index] &&
                                                                                            errors.languages[index].language;

                                                                                        const fieldTouched =
                                                                                            touched.languages &&
                                                                                            Array.isArray(touched.languages) &&
                                                                                            touched.languages[index] &&
                                                                                            touched.languages[index].language;

                                                                                        return (
                                                                                            <TableRow key={index}>
                                                                                                <TableCell>
                                                                                                    <Field
                                                                                                        as={TextField}
                                                                                                        name={`languages.${index}.language`}
                                                                                                        fullWidth
                                                                                                        size="small"
                                                                                                        error={Boolean(fieldError && fieldTouched)}
                                                                                                        helperText={fieldError && fieldTouched ? fieldError : ''}
                                                                                                    />
                                                                                                </TableCell>
                                                                                                <TableCell align="center">
                                                                                                    <Field
                                                                                                        type="checkbox"
                                                                                                        name={`languages.${index}.read`}
                                                                                                        as={Checkbox}
                                                                                                        checked={values.languages[index].read}
                                                                                                    />
                                                                                                </TableCell>
                                                                                                <TableCell align="center">
                                                                                                    <Field
                                                                                                        type="checkbox"
                                                                                                        name={`languages.${index}.speak`}
                                                                                                        as={Checkbox}
                                                                                                        checked={values.languages[index].speak}
                                                                                                    />
                                                                                                </TableCell>
                                                                                                <TableCell align="center">
                                                                                                    <Field
                                                                                                        type="checkbox"
                                                                                                        name={`languages.${index}.write`}
                                                                                                        as={Checkbox}
                                                                                                        checked={values.languages[index].write}
                                                                                                    />
                                                                                                </TableCell>
                                                                                                <TableCell align="center">
                                                                                                    <IconButton
                                                                                                        onClick={() => remove(index)}
                                                                                                        size="small"
                                                                                                        color="error"
                                                                                                        disabled={values.languages.length === 1}
                                                                                                    >
                                                                                                        <Delete fontSize="small" />
                                                                                                    </IconButton>
                                                                                                </TableCell>
                                                                                            </TableRow>
                                                                                        );
                                                                                    })}
                                                                                </TableBody>
                                                                            </Table>
                                                                        </TableContainer>
                                                                        {typeof errors.languages === 'string' && (
                                                                            <Typography variant="caption" color="error">
                                                                                {errors.languages}
                                                                            </Typography>
                                                                        )}
                                                                        <Button
                                                                            variant="outlined"
                                                                            startIcon={<Add />}
                                                                            onClick={() => push({ language: '', read: false, speak: false, write: false })}
                                                                        >
                                                                            Add Language
                                                                        </Button>
                                                                    </>
                                                                )}
                                                            </FieldArray>
                                                        </Grid>
                                                    </Grid>
                                                )}

                                                {
                                                    activeStep === 1 && (
                                                        <Grid container spacing={3} sx={{ mt: 2 }}>
                                                            <FamilyDependentsTable />
                                                            <StrengthsWeaknessesEditor />
                                                            <CategoryHealthSection />

                                                            <Grid item xs={12}>
                                                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                                                    11. Have you been arrested/convicted by any Court of Law in India or Abroad?
                                                                    (If Yes, Please give details).
                                                                </Typography>

                                                                <RadioGroup
                                                                    row
                                                                    name="arrestedConvicted.hasBeenConvicted"
                                                                    value={values.arrestedConvicted.hasBeenConvicted || ''}
                                                                    onChange={(e) => {

                                                                        setFieldValue('arrestedConvicted.hasBeenConvicted', e.target.value)
                                                                        if (e.target.value === 'yes') {
                                                                            setFieldTouched('arrestedConvicted.details', true)
                                                                        } else {
                                                                            setFieldTouched('arrestedConvicted.details', null)
                                                                        }
                                                                    }}
                                                                    sx={{ mb: 1 }}
                                                                >
                                                                    <FormControlLabel
                                                                        value="yes"
                                                                        control={<Radio size="small" />}
                                                                        label="Yes"
                                                                    />
                                                                    <FormControlLabel
                                                                        value="no"
                                                                        control={<Radio size="small" />}
                                                                        label="No"
                                                                        sx={{ ml: 2 }}
                                                                    />
                                                                </RadioGroup>

                                                                {errors.arrestedConvicted?.hasBeenConvicted && (
                                                                    <Typography variant="caption" color="error">
                                                                        {errors.arrestedConvicted.hasBeenConvicted}
                                                                    </Typography>
                                                                )}

                                                                {
                                                                    values.arrestedConvicted.hasBeenConvicted === 'yes' && (
                                                                        <Box mt={2} sx={{ pl: 3, borderLeft: '2px solid #e0e0e0' }}>
                                                                            <TextField
                                                                                label="Please specify"
                                                                                name={`arrestedConvicted.details`}
                                                                                value={values.arrestedConvicted?.details || ''}
                                                                                onChange={(e) => {
                                                                                    setFieldValue(`arrestedConvicted.details`, e.target.value)
                                                                                    setFieldTouched(`arrestedConvicted.details`, true)
                                                                                }}
                                                                                onBlur={() => {
                                                                                    setFieldTouched(`arrestedConvicted.details`, true)
                                                                                }}
                                                                                multiline
                                                                                fullWidth
                                                                                rows={2}
                                                                                size="small"
                                                                                margin="dense"
                                                                                error={
                                                                                    (touched.arrestedConvicted?.details || submitCount > 0) &&
                                                                                    Boolean(errors.arrestedConvicted?.details)
                                                                                }

                                                                                // same guard for helper text
                                                                                helperText={
                                                                                    (touched.arrestedConvicted?.details || submitCount > 0) &&
                                                                                    errors.arrestedConvicted?.details
                                                                                }

                                                                            />
                                                                        </Box>
                                                                    )
                                                                }
                                                            </Grid>
                                                        </Grid>
                                                    )
                                                }

                                                {
                                                    activeStep === 2 && (
                                                        <Grid container spacing={3} sx={{ mt: 2 }}>
                                                            <Grid item xs={12}>
                                                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                                                    12. Have you ever worked with HLFPPT before? (If Yes, Please give details).
                                                                </Typography>

                                                                <RadioGroup
                                                                    row
                                                                    name="isBeforeWorkingOrg.working"
                                                                    value={values.isBeforeWorkingOrg?.working || ''}
                                                                    onChange={(e) => setFieldValue('isBeforeWorkingOrg.working', e.target.value)}
                                                                    onBlur={() => setFieldTouched('isBeforeWorkingOrg.working', true)}
                                                                    sx={{ mb: 1 }}
                                                                >
                                                                    <FormControlLabel
                                                                        value="yes"
                                                                        control={<Radio size="small" />}
                                                                        label="Yes"
                                                                    />
                                                                    <FormControlLabel
                                                                        value="no"
                                                                        control={<Radio size="small" />}
                                                                        label="No"
                                                                        sx={{ ml: 2 }}
                                                                    />
                                                                </RadioGroup>

                                                                {getIn(touched, 'isBeforeWorkingOrg.working') &&
                                                                    getIn(errors, 'isBeforeWorkingOrg.working') && (
                                                                        <Typography variant="caption" color="error">
                                                                            {getIn(errors, 'isBeforeWorkingOrg.working')}
                                                                        </Typography>
                                                                    )}
                                                                {values.isBeforeWorkingOrg?.working === 'yes' && (
                                                                    <TableContainer>
                                                                        <Table size="small">
                                                                            <TableHead>
                                                                                <TableRow>
                                                                                    {[
                                                                                        { name: 'project_name', label: 'Project Name', type: 'text' },
                                                                                        { name: 'designation', label: 'Designation', type: 'text' },
                                                                                        { name: 'reporting_person', label: 'Reporting Person', type: 'text' },
                                                                                        { name: 'from_date', label: 'From Date', type: 'date' },
                                                                                        { name: 'to_date', label: 'To Date', type: 'date' },
                                                                                        { name: 'reason_for_leaving_work', label: 'Reason for Leaving', type: 'text' },
                                                                                    ].map((item) => (
                                                                                        <TableCell key={item.name} sx={{ fontWeight: 'bold' }}>
                                                                                            {item.label}
                                                                                        </TableCell>
                                                                                    ))}
                                                                                </TableRow>
                                                                            </TableHead>
                                                                            <TableBody>
                                                                                <TableRow>
                                                                                    {[
                                                                                        { name: 'project_name', label: 'Project Name', type: 'text' },
                                                                                        { name: 'designation', label: 'Designation', type: 'text' },
                                                                                        { name: 'reporting_person', label: 'Reporting Person', type: 'text' },
                                                                                        { name: 'from_date', label: 'From Date', type: 'date' },
                                                                                        { name: 'to_date', label: 'To Date', type: 'date' },
                                                                                        { name: 'reason_for_leaving_work', label: 'Reason for Leaving', type: 'text' },
                                                                                    ].map(({ name, label, type }) => {
                                                                                        const fieldPath = `isBeforeWorkingOrg.person.${name}`;
                                                                                        return (
                                                                                            <TableCell key={name}>
                                                                                                <TextField
                                                                                                    name={fieldPath}
                                                                                                    fullWidth
                                                                                                    size="small"
                                                                                                    type={type}
                                                                                                    label={label}
                                                                                                    variant="outlined"
                                                                                                    InputLabelProps={type === 'date' ? { shrink: true } : undefined}
                                                                                                    value={getIn(values, fieldPath) || ''}
                                                                                                    onChange={(e) =>
                                                                                                        setFieldValue(fieldPath, e.target.value)
                                                                                                    }
                                                                                                    onBlur={() =>
                                                                                                        setFieldTouched(fieldPath, true)
                                                                                                    }
                                                                                                    error={Boolean(
                                                                                                        getIn(touched, fieldPath) &&
                                                                                                        getIn(errors, fieldPath)
                                                                                                    )}
                                                                                                    helperText={
                                                                                                        getIn(touched, fieldPath) &&
                                                                                                            getIn(errors, fieldPath)
                                                                                                            ? getIn(errors, fieldPath)
                                                                                                            : ''
                                                                                                    }
                                                                                                />
                                                                                            </TableCell>
                                                                                        );
                                                                                    })}
                                                                                </TableRow>
                                                                            </TableBody>
                                                                        </Table>
                                                                    </TableContainer>
                                                                )}
                                                            </Grid>

                                                            <Grid item xs={12}>

                                                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                                                    13. Is your any relative/ friend/ close relationship associated with HLFPPT (Presently or in Past) ? (If Yes, Please give detail)
                                                                </Typography>

                                                                <RadioGroup
                                                                    row
                                                                    name="isRelativeWorkingWithSame.working"
                                                                    value={values.isRelativeWorkingWithSame?.working || ''}
                                                                    onChange={(e) => setFieldValue(`isRelativeWorkingWithSame.working`, e.target.value)}
                                                                    onBlur={(e) => {
                                                                        setFieldTouched(e.target.name, true)
                                                                    }}
                                                                    sx={{ mb: 1 }}
                                                                >
                                                                    <FormControlLabel
                                                                        value="yes"
                                                                        control={<Radio size="small" />}
                                                                        label="Yes"
                                                                    />
                                                                    <FormControlLabel
                                                                        value="no"
                                                                        control={<Radio size="small" />}
                                                                        label="No"
                                                                        sx={{ ml: 2 }}
                                                                    />
                                                                </RadioGroup>

                                                                {touched.isRelativeWorkingWithSame?.working && errors.isRelativeWorkingWithSame?.working && (
                                                                    <Typography variant="caption" color="error">
                                                                        {errors.isRelativeWorkingWithSame.working}
                                                                    </Typography>
                                                                )}

                                                                {values.isRelativeWorkingWithSame?.working === 'yes' && (
                                                                    <TableContainer>
                                                                        <Table size="small">
                                                                            <TableHead>
                                                                                <TableRow>
                                                                                    {[
                                                                                        { name: 'name', label: 'Name', type: 'text' },
                                                                                        { name: 'Department', label: 'Department', type: 'text' },
                                                                                        { name: 'Relation', label: 'Relation', type: 'text' },
                                                                                    ].map((item) => (
                                                                                        <TableCell key={item.name} sx={{ fontWeight: 'bold' }}>
                                                                                            {item.label}
                                                                                        </TableCell>
                                                                                    ))}
                                                                                </TableRow>
                                                                            </TableHead>
                                                                            <TableBody>
                                                                                <TableRow>
                                                                                    {[
                                                                                        { name: 'name', label: 'Name', type: 'text' },
                                                                                        { name: 'department', label: 'Department', type: 'text' },
                                                                                        { name: 'relation', label: 'Relation', type: 'text' },
                                                                                    ].map(({ name, label, type }) => (
                                                                                        <TableCell key={name}>
                                                                                            <TextField
                                                                                                name={`isRelativeWorkingWithSame.person.${name}`}
                                                                                                fullWidth
                                                                                                size="small"
                                                                                                type={type}
                                                                                                label={label}
                                                                                                variant="outlined"
                                                                                                InputLabelProps={type === 'date' ? { shrink: true } : undefined}
                                                                                                value={values.isRelativeWorkingWithSame?.person?.[name] || ''}
                                                                                                onChange={(e) => setFieldValue(`isRelativeWorkingWithSame.person.${name}`, e.target.value)}
                                                                                                onBlur={(e) => {
                                                                                                    setFieldTouched(e.target?.name, true);
                                                                                                }}
                                                                                                error={
                                                                                                    Boolean(
                                                                                                        errors.isRelativeWorkingWithSame?.person?.[name] &&
                                                                                                        touched.isRelativeWorkingWithSame?.person?.[name]
                                                                                                    )
                                                                                                }
                                                                                                helperText={
                                                                                                    touched.isRelativeWorkingWithSame?.person?.[name] &&
                                                                                                        errors.isRelativeWorkingWithSame?.person?.[name]
                                                                                                        ? errors.isRelativeWorkingWithSame.person[name]
                                                                                                        : ''
                                                                                                }
                                                                                            />
                                                                                        </TableCell>
                                                                                    ))}
                                                                                </TableRow>
                                                                            </TableBody>
                                                                        </Table>
                                                                    </TableContainer>
                                                                )}

                                                            </Grid>

                                                            <Grid item xs={12}>
                                                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                                                    14. Details of Educational Qualification
                                                                </Typography>

                                                                <FieldArray name="educationOrQualification">
                                                                    {({ push, remove }) => (
                                                                        <div>
                                                                            {values.educationOrQualification?.map((qualification, index) => (
                                                                                <Grid container spacing={2} key={index} sx={{
                                                                                    mb: 3,
                                                                                    p: 2,
                                                                                    border: '1px solid #e0e0e0',
                                                                                    borderRadius: '4px',
                                                                                    backgroundColor: index % 2 === 0 ? '#fafafa' : '#fff'
                                                                                }}>
                                                                                    <Grid item xs={12}>
                                                                                        <Typography variant="subtitle2" sx={{
                                                                                            display: 'flex',
                                                                                            justifyContent: 'space-between',
                                                                                            alignItems: 'center'
                                                                                        }}>
                                                                                            Qualification #{index + 1} {index === 0 && <Typography variant="caption" color="red">(Matric / 10th qualification details is mandatory for the first section.)</Typography>}
                                                                                            {index > 0 && (
                                                                                                <Button
                                                                                                    variant="outlined"
                                                                                                    color="error"
                                                                                                    size="small"
                                                                                                    onClick={() => remove(index)}
                                                                                                    sx={{ ml: 2 }}
                                                                                                >
                                                                                                    Remove
                                                                                                </Button>
                                                                                            )}
                                                                                        </Typography>
                                                                                    </Grid>

                                                                                    {/* College Name */}
                                                                                    <Grid item xs={12} md={6}>
                                                                                        <Field
                                                                                            name={`educationOrQualification.${index}.collage_name`}
                                                                                            as={TextField}
                                                                                            label="College/University Name"
                                                                                            fullWidth
                                                                                            size="small"
                                                                                            error={
                                                                                                touched.educationOrQualification?.[index]?.collage_name &&
                                                                                                Boolean(errors.educationOrQualification?.[index]?.collage_name)
                                                                                            }
                                                                                            helperText={
                                                                                                touched.educationOrQualification?.[index]?.collage_name &&
                                                                                                errors.educationOrQualification?.[index]?.collage_name
                                                                                            }
                                                                                        />
                                                                                    </Grid>

                                                                                    {/* Degree */}
                                                                                    <Grid item xs={12} md={6}>
                                                                                        <Field
                                                                                            name={`educationOrQualification.${index}.degree`}
                                                                                            as={TextField}
                                                                                            label="Degree/Certificate"
                                                                                            fullWidth
                                                                                            size="small"
                                                                                            error={
                                                                                                touched.educationOrQualification?.[index]?.degree &&
                                                                                                Boolean(errors.educationOrQualification?.[index]?.degree)
                                                                                            }
                                                                                            helperText={
                                                                                                touched.educationOrQualification?.[index]?.degree &&
                                                                                                errors.educationOrQualification?.[index]?.degree
                                                                                            }
                                                                                        />
                                                                                    </Grid>

                                                                                    {/* Major Subject */}
                                                                                    <Grid item xs={12} md={6}>
                                                                                        <Field
                                                                                            name={`educationOrQualification.${index}.major_subject`}
                                                                                            as={TextField}
                                                                                            label="Major Subject"
                                                                                            fullWidth
                                                                                            size="small"
                                                                                            error={
                                                                                                touched.educationOrQualification?.[index]?.major_subject &&
                                                                                                Boolean(errors.educationOrQualification?.[index]?.major_subject)
                                                                                            }
                                                                                            helperText={
                                                                                                touched.educationOrQualification?.[index]?.major_subject &&
                                                                                                errors.educationOrQualification?.[index]?.major_subject
                                                                                            }
                                                                                        />
                                                                                    </Grid>

                                                                                    {/* Percentage */}
                                                                                    <Grid item xs={12} md={6}>
                                                                                        <Field
                                                                                            name={`educationOrQualification.${index}.percentage`}
                                                                                            as={TextField}
                                                                                            label="Percentage/CGPA"
                                                                                            fullWidth
                                                                                            size="small"
                                                                                            type="text"
                                                                                            inputProps={{
                                                                                                inputMode: 'decimal',
                                                                                                pattern: '^\\d*\\.?\\d{0,2}$',
                                                                                                maxLength: 6,
                                                                                            }}
                                                                                            onChange={(e) => {
                                                                                                const val = e.target.value;
                                                                                                if (/^\d*\.?\d{0,2}$/.test(val)) {
                                                                                                    setFieldValue(e.target.name, val);
                                                                                                }
                                                                                            }}
                                                                                            error={
                                                                                                touched.educationOrQualification?.[index]?.percentage &&
                                                                                                Boolean(errors.educationOrQualification?.[index]?.percentage)
                                                                                            }
                                                                                            helperText={
                                                                                                touched.educationOrQualification?.[index]?.percentage &&
                                                                                                errors.educationOrQualification?.[index]?.percentage
                                                                                            }
                                                                                        />
                                                                                    </Grid>

                                                                                    {/* Course Duration */}
                                                                                    <Grid item xs={12} md={6}>
                                                                                        <Field
                                                                                            name={`educationOrQualification.${index}.from_date`}
                                                                                            as={TextField}
                                                                                            label="Start From"
                                                                                            fullWidth
                                                                                            size="small"
                                                                                            type="date"
                                                                                            margin="dense"
                                                                                            InputLabelProps={{ shrink: true }}
                                                                                            error={
                                                                                                touched.educationOrQualification?.[index]?.from_date &&
                                                                                                Boolean(errors.educationOrQualification?.[index]?.from_date)
                                                                                            }
                                                                                            helperText={
                                                                                                touched.educationOrQualification?.[index]?.from_date &&
                                                                                                errors.educationOrQualification?.[index]?.from_date
                                                                                            }
                                                                                        />
                                                                                    </Grid>

                                                                                    <Grid item xs={12} md={6}>
                                                                                        <Field
                                                                                            name={`educationOrQualification.${index}.to_date`}
                                                                                            as={TextField}
                                                                                            label="End From"
                                                                                            fullWidth
                                                                                            size="small"
                                                                                            type="date"
                                                                                            margin="dense"
                                                                                            InputLabelProps={{ shrink: true }}
                                                                                            error={
                                                                                                touched.educationOrQualification?.[index]?.to_date &&
                                                                                                Boolean(errors.educationOrQualification?.[index]?.to_date)
                                                                                            }
                                                                                            helperText={
                                                                                                touched.educationOrQualification?.[index]?.to_date &&
                                                                                                errors.educationOrQualification?.[index]?.to_date
                                                                                            }
                                                                                        />
                                                                                    </Grid>

                                                                                    <Grid item xs={12} md={6}>
                                                                                        <Field
                                                                                            name={`educationOrQualification.${index}.type_of_education`}
                                                                                            as={TextField}
                                                                                            select
                                                                                            label="Study Mode"
                                                                                            // value={values.educationOrQualification[index].type_of_education || ""}
                                                                                            // onChange={(e) => setFieldValue(e.target.name , e.target.value)}
                                                                                            fullWidth
                                                                                            size="small"
                                                                                            variant="outlined"
                                                                                            error={
                                                                                                touched.educationOrQualification?.[index]?.type_of_education &&
                                                                                                Boolean(errors.educationOrQualification?.[index]?.type_of_education)
                                                                                            }
                                                                                            helperText={
                                                                                                touched.educationOrQualification?.[index]?.type_of_education &&
                                                                                                errors.educationOrQualification?.[index]?.type_of_education
                                                                                            }
                                                                                        >
                                                                                            <MenuItem value="full_time">Full Time</MenuItem>
                                                                                            <MenuItem value="part_time">Part Time</MenuItem>
                                                                                        </Field>
                                                                                    </Grid>

                                                                                    {/* Year of Passing */}
                                                                                    <Grid item xs={12} md={6}>
                                                                                        <Field
                                                                                            name={`educationOrQualification.${index}.years_of_passing`}
                                                                                            as={TextField}
                                                                                            label="Year of Passing"
                                                                                            fullWidth
                                                                                            onChange={(e) => {
                                                                                                const val = e.target.value;
                                                                                                // only digits, up to 4 chars
                                                                                                if (/^\d{0,4}$/.test(val)) {
                                                                                                    setFieldValue(e.target.name, val);
                                                                                                }
                                                                                            }}
                                                                                            size="small"
                                                                                            type="text"
                                                                                            error={
                                                                                                touched.educationOrQualification?.[index]?.years_of_passing &&
                                                                                                Boolean(errors.educationOrQualification?.[index]?.years_of_passing)
                                                                                            }
                                                                                            helperText={
                                                                                                touched.educationOrQualification?.[index]?.years_of_passing &&
                                                                                                errors.educationOrQualification?.[index]?.years_of_passing
                                                                                            }
                                                                                        />
                                                                                    </Grid>
                                                                                </Grid>
                                                                            ))}

                                                                            <Button
                                                                                variant="outlined"
                                                                                color="primary"
                                                                                startIcon={<AddIcon />}
                                                                                onClick={() => push({
                                                                                    collage_name: '',
                                                                                    degree: '',
                                                                                    major_subject: '',
                                                                                    percentage: '',
                                                                                    course_duration: '',
                                                                                    years_of_passing: '',
                                                                                })}
                                                                                sx={{ mt: 1 }}
                                                                            >
                                                                                Add Another Qualification
                                                                            </Button>
                                                                        </div>
                                                                    )}
                                                                </FieldArray>
                                                            </Grid>

                                                            <Grid item xs={12}>
                                                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                                                    15. Technical / Professional Training:
                                                                </Typography>

                                                                <FieldArray name="trainingAndExperience">
                                                                    {({ remove, push }) => (
                                                                        <>
                                                                            <TableContainer component={Paper} sx={{ mt: 2, overflowX: 'auto' }}>
                                                                                <Table size="small">
                                                                                    <TableHead>
                                                                                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                                                                            <TableCell>Name of the course</TableCell>
                                                                                            <TableCell>Organization / Institution</TableCell>
                                                                                            <TableCell>Subject learned / Project done</TableCell>
                                                                                            <TableCell>Duration From</TableCell>
                                                                                            <TableCell>Duration To</TableCell>
                                                                                            <TableCell>Stipend Received</TableCell>
                                                                                            <TableCell align="center">Action</TableCell>
                                                                                        </TableRow>
                                                                                    </TableHead>
                                                                                    <TableBody>
                                                                                        {values.trainingAndExperience?.map((training, index) => {
                                                                                            const fieldName = (field) => `trainingAndExperience[${index}].${field}`;
                                                                                            const error = (field) =>
                                                                                                errors.trainingAndExperience?.[index]?.[field] &&
                                                                                                touched.trainingAndExperience?.[index]?.[field];
                                                                                            return (
                                                                                                <TableRow key={index}>
                                                                                                    {/* Course Name */}
                                                                                                    <TableCell>
                                                                                                        <TextField
                                                                                                            name={fieldName('name_of_course')}
                                                                                                            fullWidth
                                                                                                            variant="outlined"
                                                                                                            size="small"
                                                                                                            value={training.name_of_course}
                                                                                                            onChange={(e) => setFieldValue(fieldName('name_of_course'), e.target.value)}
                                                                                                            onBlur={() => {
                                                                                                                setFieldTouched(fieldName('name_of_course'), true);
                                                                                                            }}
                                                                                                            error={error('name_of_course')}
                                                                                                            helperText={error('name_of_course') && errors.trainingAndExperience[index].name_of_course}
                                                                                                        />
                                                                                                    </TableCell>

                                                                                                    {/* Organization */}
                                                                                                    <TableCell>
                                                                                                        <TextField
                                                                                                            name={fieldName('institute_name')}
                                                                                                            fullWidth
                                                                                                            variant="outlined"
                                                                                                            size="small"
                                                                                                            value={training.institute_name}
                                                                                                            onChange={(e) => setFieldValue(fieldName('institute_name'), e.target.value)}

                                                                                                            onBlur={() => {
                                                                                                                setFieldTouched(fieldName('institute_name'), true);
                                                                                                            }}
                                                                                                            error={error('institute_name')}
                                                                                                            helperText={error('institute_name') && errors.trainingAndExperience[index].institute_name}
                                                                                                        />
                                                                                                    </TableCell>

                                                                                                    {/* Subject/Project */}
                                                                                                    <TableCell>
                                                                                                        <TextField
                                                                                                            name={fieldName('learn_project')}
                                                                                                            fullWidth
                                                                                                            variant="outlined"
                                                                                                            size="small"
                                                                                                            value={training.learn_project}
                                                                                                            onChange={(e) => {
                                                                                                                setFieldValue(fieldName('learn_project'), e.target.value);
                                                                                                            }}
                                                                                                            onBlur={() => {
                                                                                                                setFieldTouched(fieldName('learn_project'), true);
                                                                                                            }}
                                                                                                            error={error('learn_project')}
                                                                                                            helperText={error('learn_project') && errors.trainingAndExperience[index].learn_project}
                                                                                                        />
                                                                                                    </TableCell>

                                                                                                    {/* Duration From */}
                                                                                                    <TableCell>
                                                                                                        <TextField
                                                                                                            name={fieldName('duration_from')}
                                                                                                            type="date"
                                                                                                            variant="outlined"
                                                                                                            size="small"
                                                                                                            InputLabelProps={{ shrink: true }}
                                                                                                            value={training.duration_from}
                                                                                                            onChange={(e) => {
                                                                                                                setFieldValue(fieldName('duration_from'), e.target.value);
                                                                                                            }}
                                                                                                            onBlur={() => {
                                                                                                                setFieldTouched(fieldName('duration_from'), true);
                                                                                                            }}
                                                                                                            error={error('duration_from')}
                                                                                                            helperText={error('duration_from') && errors.trainingAndExperience[index].duration_from}
                                                                                                        />
                                                                                                    </TableCell>

                                                                                                    {/* Duration To */}
                                                                                                    <TableCell>
                                                                                                        <TextField
                                                                                                            name={fieldName('duration_to')}
                                                                                                            type="date"
                                                                                                            variant="outlined"
                                                                                                            size="small"
                                                                                                            InputLabelProps={{ shrink: true }}
                                                                                                            value={training.duration_to}
                                                                                                            onChange={(e) => {
                                                                                                                setFieldValue(fieldName('duration_to'), e.target.value);
                                                                                                            }}
                                                                                                            onBlur={() => {
                                                                                                                setFieldTouched(fieldName('duration_to'), true);
                                                                                                            }}
                                                                                                            error={error('duration_to')}
                                                                                                            helperText={error('duration_to') && errors.trainingAndExperience[index].duration_to}
                                                                                                        />
                                                                                                    </TableCell>

                                                                                                    {/* Stipend */}
                                                                                                    <TableCell>
                                                                                                        <TextField
                                                                                                            name={fieldName('stipend_received')}
                                                                                                            type="text"
                                                                                                            variant="outlined"
                                                                                                            size="small"
                                                                                                            value={training.stipend_received}
                                                                                                            onChange={(e) => {
                                                                                                                setFieldValue(fieldName('stipend_received'), e.target.value);
                                                                                                            }}
                                                                                                            onBlur={() => {
                                                                                                                setFieldTouched(fieldName('stipend_received'), true);
                                                                                                            }}
                                                                                                            InputProps={{ inputProps: { min: 0 } }}
                                                                                                            error={error('stipend_received')}
                                                                                                            helperText={error('stipend_received') && errors.trainingAndExperience[index].stipend_received}
                                                                                                        />
                                                                                                    </TableCell>

                                                                                                    {/* Delete Button */}
                                                                                                    <TableCell align="center">
                                                                                                        <IconButton
                                                                                                            color="error"
                                                                                                            onClick={() => remove(index)}
                                                                                                            disabled={values.trainingAndExperience.length <= 1}
                                                                                                        >
                                                                                                            <DeleteOutline />
                                                                                                        </IconButton>
                                                                                                    </TableCell>
                                                                                                </TableRow>
                                                                                            );
                                                                                        })}
                                                                                    </TableBody>
                                                                                </Table>
                                                                            </TableContainer>

                                                                            {/* Add Button */}
                                                                            <IconButton
                                                                                color="primary"
                                                                                onClick={() => push({
                                                                                    name_of_course: '',
                                                                                    institute_name: '',
                                                                                    learn_project: '',
                                                                                    duration_from: '',
                                                                                    duration_to: '',
                                                                                    stipend_received: ''
                                                                                })}
                                                                                sx={{ mt: 1 }}
                                                                            >
                                                                                <AddCircleOutline fontSize="medium" />
                                                                                <Typography variant="body2" sx={{ ml: 1 }}>Add Training</Typography>
                                                                            </IconButton>
                                                                        </>
                                                                    )}
                                                                </FieldArray>
                                                            </Grid>

                                                            <Grid item xs={12}>
                                                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                                                    16. Scholarship / Membership of any Professional Association
                                                                </Typography>

                                                                <Box sx={editorStyle}>
                                                                    <ReactQuill
                                                                        value={values.scholarship_any_association || ''}
                                                                        onChange={(value) => setFieldValue('scholarship_any_association', value)}
                                                                        modules={quillModules}
                                                                        placeholder="Scholarship / Membership of any Professional Association"
                                                                        onBlur={() => {
                                                                            setFieldTouched('scholarship_any_association', true);
                                                                        }}
                                                                        theme="snow"
                                                                    />
                                                                </Box>

                                                                {touched.scholarship_any_association && errors.scholarship_any_association && (
                                                                    <Typography variant="caption" color="error">
                                                                        {errors.scholarship_any_association}
                                                                    </Typography>
                                                                )}

                                                            </Grid>

                                                            <Grid item xs={12}>
                                                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                                                    17. Extracurricular activities:
                                                                    (Include office held, distinctions obtained in schools/ colleges, etc. )
                                                                </Typography>

                                                                <Box sx={editorStyle}>
                                                                    <ReactQuill
                                                                        value={values.extracurricular_activity || ''}
                                                                        onChange={(value) => setFieldValue('extracurricular_activity', value)}
                                                                        modules={quillModules}
                                                                        placeholder="Extracurricular activities"
                                                                        onBlur={() => {
                                                                            setFieldTouched('extracurricular_activity', true);
                                                                        }}
                                                                        theme="snow"
                                                                    />
                                                                </Box>

                                                                {touched.extracurricular_activity && errors.extracurricular_activity && (
                                                                    <Typography variant="caption" color="error">
                                                                        {errors.extracurricular_activity}
                                                                    </Typography>
                                                                )}
                                                            </Grid>

                                                        </Grid>
                                                    )
                                                }

                                                {
                                                    activeStep === 3 && (
                                                        <Grid container spacing={3} sx={{ mt: 2 }}>

                                                            <Grid item xs={12}>
                                                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
                                                                    18. Employment History
                                                                </Typography>

                                                                <FieldArray name="employment_history">
                                                                    {({ remove, push }) => (
                                                                        <TableContainer
                                                                            component={Paper}
                                                                            sx={{
                                                                                mt: 2,
                                                                                mb: 3,
                                                                                overflowX: 'auto'
                                                                            }}
                                                                        >
                                                                            <Table size="medium" sx={{ minWidth: 1800 }}>
                                                                                <TableHead>
                                                                                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                                                                        <TableCell sx={{ width: '3%' }}>Sl.</TableCell>
                                                                                        <TableCell sx={{ width: '10%' }}>Name of Organization with Address</TableCell>
                                                                                        <TableCell sx={{ width: '10%' }}>Designation Held</TableCell>
                                                                                        <TableCell sx={{ width: '10%' }}>Nature of Work</TableCell>
                                                                                        <TableCell sx={{ width: '8%' }}>Last Drawn CTC (in LPA)</TableCell>
                                                                                        <TableCell sx={{ width: '20%' }}>Duration (From/To)</TableCell>
                                                                                        <TableCell sx={{ width: '10%' }}>Reason of leaving</TableCell>
                                                                                        <TableCell sx={{ width: '10%' }}>Organization/HR Email Contact</TableCell>
                                                                                        <TableCell sx={{ width: '10%' }}>Reporting Contact Number & Name</TableCell>
                                                                                        <TableCell sx={{ width: '3%' }}>Action</TableCell>
                                                                                    </TableRow>
                                                                                </TableHead>
                                                                                <TableBody>
                                                                                    {values.employment_history.map((_, index) => {
                                                                                        const empErrors = errors.employment_history?.[index] || {};
                                                                                        const empTouched = touched.employment_history?.[index] || {};

                                                                                        return (
                                                                                            <TableRow key={index}>
                                                                                                <TableCell>{index + 1}</TableCell>

                                                                                                {/* Organization Name & Address */}
                                                                                                <TableCell>
                                                                                                    <Field
                                                                                                        name={`employment_history.${index}.company_name_with_address`}
                                                                                                        as={TextField}
                                                                                                        fullWidth
                                                                                                        variant="outlined"
                                                                                                        size="small"
                                                                                                        error={
                                                                                                            empTouched.company_name_with_address &&
                                                                                                            !!empErrors.company_name_with_address
                                                                                                        }
                                                                                                    />
                                                                                                    <ErrorMessage
                                                                                                        name={`employment_history.${index}.company_name_with_address`}
                                                                                                        component={FormHelperText}
                                                                                                        error
                                                                                                    />
                                                                                                </TableCell>

                                                                                                {/* Designation */}
                                                                                                <TableCell>
                                                                                                    <Field
                                                                                                        name={`employment_history.${index}.designation`}
                                                                                                        as={TextField}
                                                                                                        fullWidth
                                                                                                        variant="outlined"
                                                                                                        size="small"
                                                                                                        error={empTouched.designation && !!empErrors.designation}
                                                                                                    />
                                                                                                    <ErrorMessage
                                                                                                        name={`employment_history.${index}.designation`}
                                                                                                        component={FormHelperText}
                                                                                                        error
                                                                                                    />
                                                                                                </TableCell>

                                                                                                {/* Nature of Work */}
                                                                                                <TableCell>
                                                                                                    <Field
                                                                                                        name={`employment_history.${index}.role_and_responsibility`}
                                                                                                        as={TextField}
                                                                                                        fullWidth
                                                                                                        variant="outlined"
                                                                                                        size="small"
                                                                                                        error={
                                                                                                            empTouched.role_and_responsibility &&
                                                                                                            !!empErrors.role_and_responsibility
                                                                                                        }
                                                                                                    />
                                                                                                    <ErrorMessage
                                                                                                        name={`employment_history.${index}.role_and_responsibility`}
                                                                                                        component={FormHelperText}
                                                                                                        error
                                                                                                    />
                                                                                                </TableCell>

                                                                                                {/* Last CTC - Enhanced Number Validation */}
                                                                                                <TableCell>
                                                                                                    <Field
                                                                                                        name={`employment_history.${index}.last_ctc`}
                                                                                                    >
                                                                                                        {({ field, form }) => (
                                                                                                            <TextField
                                                                                                                {...field}
                                                                                                                fullWidth
                                                                                                                variant="outlined"
                                                                                                                size="small"
                                                                                                                type="text"
                                                                                                                inputProps={{
                                                                                                                    step: "0.01",
                                                                                                                    min: "0"
                                                                                                                }}
                                                                                                                onKeyDown={(e) => {
                                                                                                                    // Prevent negative sign, 'e', and other non-numeric inputs
                                                                                                                    if (['-', 'e', 'E'].includes(e.key)) {
                                                                                                                        e.preventDefault();
                                                                                                                    }
                                                                                                                }}
                                                                                                                onChange={(e) => {
                                                                                                                    // Handle decimal values properly
                                                                                                                    let value = e.target.value;
                                                                                                                    // Allow only numbers and decimal
                                                                                                                    value = value?.replace(/[^0-9.]/g, '');
                                                                                                                    // Prevent multiple decimals
                                                                                                                    if ((value.match(/\./g) || []).length > 1) {
                                                                                                                        value = value.slice(0, -1);
                                                                                                                    }
                                                                                                                    form.setFieldValue(field.name, value);
                                                                                                                }}
                                                                                                                error={empTouched.last_ctc && !!empErrors.last_ctc}
                                                                                                            />
                                                                                                        )}
                                                                                                    </Field>
                                                                                                    <ErrorMessage
                                                                                                        name={`employment_history.${index}.last_ctc`}
                                                                                                        component={FormHelperText}
                                                                                                        error
                                                                                                    />
                                                                                                </TableCell>

                                                                                                {/* Duration */}
<TableCell>
    <Grid container spacing={1} alignItems="center">
        <Grid item xs={5.5}>
            <Field
                name={`employment_history.${index}.from_date`}
                type="date"
                as={TextField}
                fullWidth
                variant="outlined"
                size="small"
                InputLabelProps={{ shrink: true }}
                label="From"
                error={empTouched.from_date && !!empErrors.from_date}
            />
        </Grid>

        <Grid item xs={5.5}>
            <Field
                name={`employment_history.${index}.to_date`}
                type="date"
                as={TextField}
                fullWidth
                variant="outlined"
                size="small"
                InputLabelProps={{ shrink: true }}
                label="To"
                disabled={values.employment_history[index].currently_working}
                error={empTouched.to_date && !!empErrors.to_date}
            />
        </Grid>

        <Grid  item xs="auto">
            <Field name={`employment_history.${index}.currently_working`}>
                {({ field }) => (
                    <FormControlLabel
                        control={
                            <Checkbox
                                {...field}
                                checked={field.value || false}
                                onChange={(e) => {
                                    setFieldValue(`employment_history.${index}.currently_working`, e.target.checked);
                                    if (e.target.checked) {
                                        setFieldValue(`employment_history.${index}.to_date`, ''); // Clear To date
                                        setFieldValue(`employment_history.${index}.reason_for_leaving`, ''); // Optional: clear reason
                                    }
                                }}
                                size="small"
                            />
                        }
                        label="Till Now"
                        sx={{ m: 0 ,whiteSpace: "nowrap"}}
                    />
                )}
            </Field>
        </Grid>
    </Grid>

    <ErrorMessage
        name={`employment_history.${index}.to_date`}
        component={FormHelperText}
        error
    />
</TableCell>

                                                                                                {/* Reason of leaving */}
                                                                                                <TableCell>
                                                                                                    <Field
                                                                                                        name={`employment_history.${index}.reason_for_leaving`}
                                                                                                        as={TextField}
                                                                                                        fullWidth
                                                                                                        variant="outlined"
                                                                                                        size="small"
                                                                                                        error={
                                                                                                            empTouched.reason_for_leaving &&
                                                                                                            !!empErrors.reason_for_leaving
                                                                                                        }
                                                                                                    />
                                                                                                    <ErrorMessage
                                                                                                        name={`employment_history.${index}.reason_for_leaving`}
                                                                                                        component={FormHelperText}
                                                                                                        error
                                                                                                    />
                                                                                                </TableCell>

                                                                                                {/* HR Contact */}
                                                                                                <TableCell>
                                                                                                    <Field
                                                                                                        name={`employment_history.${index}.organization_hr_contact_details`}
                                                                                                        as={TextField}
                                                                                                        fullWidth
                                                                                                        variant="outlined"
                                                                                                        size="small"
                                                                                                        type="email"
                                                                                                        error={
                                                                                                            empTouched.organization_hr_contact_details &&
                                                                                                            !!empErrors.organization_hr_contact_details
                                                                                                        }
                                                                                                    />
                                                                                                    <ErrorMessage
                                                                                                        name={`employment_history.${index}.organization_hr_contact_details`}
                                                                                                        component={FormHelperText}
                                                                                                        error
                                                                                                    />
                                                                                                </TableCell>

                                                                                                {/* Reporting Contact */}
                                                                                                <TableCell>
                                                                                                    <Field
                                                                                                        name={`employment_history.${index}.reporting_contact_number_name`}
                                                                                                        as={TextField}
                                                                                                        fullWidth
                                                                                                        variant="outlined"
                                                                                                        size="small"
                                                                                                        error={
                                                                                                            empTouched.reporting_contact_number_name &&
                                                                                                            !!empErrors.reporting_contact_number_name
                                                                                                        }
                                                                                                    />
                                                                                                    <ErrorMessage
                                                                                                        name={`employment_history.${index}.reporting_contact_number_name`}
                                                                                                        component={FormHelperText}
                                                                                                        error
                                                                                                    />
                                                                                                </TableCell>

                                                                                                {/* Action */}
                                                                                                <TableCell>
                                                                                                    <IconButton
                                                                                                        onClick={() => remove(index)}
                                                                                                        disabled={values.employment_history.length === 1}
                                                                                                    >
                                                                                                        <DeleteOutline color={values.employment_history.length > 1 ? "error" : "disabled"} />
                                                                                                    </IconButton>
                                                                                                </TableCell>
                                                                                            </TableRow>
                                                                                        );
                                                                                    })}
                                                                                </TableBody>
                                                                            </Table>

                                                                            <Button
                                                                                variant="outlined"
                                                                                startIcon={<AddCircleOutline />}
                                                                                onClick={() => push({
                                                                                    company_name_with_address: '',
                                                                                    designation: '',
                                                                                    role_and_responsibility: '',
                                                                                    last_ctc: '',
                                                                                    from_date: '',
                                                                                    to_date: '',
                                                                                    reason_for_leaving: '',
                                                                                    organization_hr_contact_details: '',
                                                                                    reporting_contact_number_name: '',
                                                                                })}
                                                                                sx={{ mt: 2, ml: 2, mb: 2 }}
                                                                            >
                                                                                Add Employment
                                                                            </Button>
                                                                        </TableContainer>
                                                                    )}
                                                                </FieldArray>
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
                                                                    19. Current Compensation Details/ Pay slip
                                                                </Typography>

                                                                <TableContainer component={Paper} sx={{ mb: 2 }}>
                                                                    <Table size="small">
                                                                        <TableHead>
                                                                            <TableRow>
                                                                                <TableCell sx={{ fontWeight: 'bold' }}>
                                                                                    Monthly Components
                                                                                </TableCell>
                                                                                <TableCell sx={{ fontWeight: 'bold' }}>
                                                                                    Amount (in Rs.)
                                                                                </TableCell>
                                                                                <TableCell sx={{ fontWeight: 'bold' }}>
                                                                                    Annual Benefits
                                                                                </TableCell>
                                                                                <TableCell sx={{ fontWeight: 'bold' }}>
                                                                                    Amount (in Rs.)
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        </TableHead>
                                                                        <TableBody>
                                                                            <TableRow>
                                                                                <TableCell>Basic</TableCell>
                                                                                <TableCell>
                                                                                    <TextField
                                                                                        name={`salary_Structure.basic`}
                                                                                        fullWidth
                                                                                        size="small"
                                                                                        type="text"
                                                                                        value={getIn(values, 'salary_Structure.basic') || ''}
                                                                                        onChange={(e) => {
                                                                                            let value = e.target.value;
                                                                                            // allow only digits and one decimal
                                                                                            value = value?.replace(/[^0-9.]/g, '');
                                                                                            const parts = value.split('.');
                                                                                            if (parts.length > 2) {
                                                                                                value = parts.slice(0, 2).join('.') + parts.slice(2).join('');
                                                                                            }
                                                                                            setFieldValue('salary_Structure.basic', value);
                                                                                        }}
                                                                                        onKeyDown={(e) => {
                                                                                            if (['-', 'e', 'E'].includes(e.key)) {
                                                                                                e.preventDefault();
                                                                                            }
                                                                                        }}
                                                                                        onBlur={(e) => {
                                                                                            setFieldTouched(e.target.name, true);
                                                                                        }}
                                                                                        error={Boolean(getIn(touched, 'salary_Structure.basic') && getIn(errors, 'salary_Structure.basic'))}
                                                                                        helperText={
                                                                                            getIn(touched, 'salary_Structure.basic') && getIn(errors, 'salary_Structure.basic')
                                                                                                ? getIn(errors, 'salary_Structure.basic')
                                                                                                : ''
                                                                                        }
                                                                                        InputProps={{ inputProps: { min: 0 } }}
                                                                                    />
                                                                                </TableCell>

                                                                                <TableCell>Provident Fund</TableCell>
                                                                                <TableCell>
                                                                                    <TextField
                                                                                        name={`salary_Structure.provident_fund`}
                                                                                        fullWidth
                                                                                        size="small"
                                                                                        type="text"
                                                                                        value={getIn(values, 'salary_Structure.provident_fund') || ''}
                                                                                        onChange={(e) => {
                                                                                            let value = e.target.value;
                                                                                            // allow only digits and one decimal
                                                                                            value = value?.replace(/[^0-9.]/g, '');
                                                                                            const parts = value.split('.');
                                                                                            if (parts.length > 2) {
                                                                                                value = parts.slice(0, 2).join('.') + parts.slice(2).join('');
                                                                                            }
                                                                                            setFieldValue('salary_Structure.provident_fund', value);
                                                                                        }}
                                                                                        onKeyDown={(e) => {
                                                                                            if (['-', 'e', 'E'].includes(e.key)) {
                                                                                                e.preventDefault();
                                                                                            }
                                                                                        }}
                                                                                        onBlur={(e) => {
                                                                                            setFieldTouched(e.target.name, true);
                                                                                        }}
                                                                                        error={Boolean(getIn(touched, 'salary_Structure.provident_fund') && getIn(errors, 'salary_Structure.provident_fund'))}
                                                                                        helperText={
                                                                                            getIn(touched, 'salary_Structure.provident_fund') && getIn(errors, 'salary_Structure.provident_fund')
                                                                                                ? getIn(errors, 'salary_Structure.provident_fund')
                                                                                                : ''
                                                                                        }
                                                                                        InputProps={{ inputProps: { min: 0 } }}
                                                                                    />
                                                                                </TableCell>
                                                                            </TableRow>
                                                                            <TableRow>
                                                                                <TableCell>HRA / CLA</TableCell>
                                                                                <TableCell>
                                                                                    <TextField
                                                                                        name={`salary_Structure.hra_cla`}
                                                                                        fullWidth
                                                                                        size="small"
                                                                                        type="text"
                                                                                        value={getIn(values, 'salary_Structure.hra_cla') || ''}
                                                                                        onChange={(e) => {
                                                                                            let value = e.target.value;
                                                                                            // allow only digits and one decimal
                                                                                            value = value?.replace(/[^0-9.]/g, '');
                                                                                            const parts = value.split('.');
                                                                                            if (parts.length > 2) {
                                                                                                value = parts.slice(0, 2).join('.') + parts.slice(2).join('');
                                                                                            }
                                                                                            setFieldValue('salary_Structure.hra_cla', value);
                                                                                        }}
                                                                                        onKeyDown={(e) => {
                                                                                            if (['-', 'e', 'E'].includes(e.key)) {
                                                                                                e.preventDefault();
                                                                                            }
                                                                                        }}
                                                                                        onBlur={(e) => {
                                                                                            setFieldTouched(e.target.name, true);
                                                                                        }}
                                                                                        error={Boolean(getIn(touched, 'salary_Structure.hra_cla') && getIn(errors, 'salary_Structure.hra_cla'))}
                                                                                        helperText={
                                                                                            getIn(touched, 'salary_Structure.hra_cla') && getIn(errors, 'salary_Structure.hra_cla')
                                                                                                ? getIn(errors, 'salary_Structure.hra_cla')
                                                                                                : ''
                                                                                        }
                                                                                        InputProps={{ inputProps: { min: 0 } }}
                                                                                    />
                                                                                </TableCell>

                                                                                <TableCell>Superannuation</TableCell>
                                                                                <TableCell>
                                                                                    <TextField
                                                                                        name={`salary_Structure.superannuation`}
                                                                                        fullWidth
                                                                                        size="small"
                                                                                        type="text"
                                                                                        value={getIn(values, 'salary_Structure.superannuation') || ''}
                                                                                        onChange={(e) => {
                                                                                            let value = e.target.value;
                                                                                            // allow only digits and one decimal
                                                                                            value = value?.replace(/[^0-9.]/g, '');
                                                                                            const parts = value.split('.');
                                                                                            if (parts.length > 2) {
                                                                                                value = parts.slice(0, 2).join('.') + parts.slice(2).join('');
                                                                                            }
                                                                                            setFieldValue('salary_Structure.superannuation', value);
                                                                                        }}
                                                                                        onKeyDown={(e) => {
                                                                                            if (['-', 'e', 'E'].includes(e.key)) {
                                                                                                e.preventDefault();
                                                                                            }
                                                                                        }}
                                                                                        onBlur={(e) => {
                                                                                            setFieldTouched(e.target.name, true);
                                                                                        }}
                                                                                        error={Boolean(getIn(touched, 'salary_Structure.superannuation') && getIn(errors, 'salary_Structure.superannuation'))}
                                                                                        helperText={
                                                                                            getIn(touched, 'salary_Structure.superannuation') && getIn(errors, 'salary_Structure.superannuation')
                                                                                                ? getIn(errors, 'salary_Structure.superannuation')
                                                                                                : ''
                                                                                        }
                                                                                        InputProps={{ inputProps: { min: 0 } }}
                                                                                    />
                                                                                </TableCell>
                                                                            </TableRow>
                                                                            <TableRow>
                                                                                <TableCell>Conveyance</TableCell>
                                                                                <TableCell>
                                                                                    <TextField
                                                                                        name={`salary_Structure.conveyance`}
                                                                                        fullWidth
                                                                                        size="small"
                                                                                        type="text"
                                                                                        value={getIn(values, 'salary_Structure.conveyance') || ''}
                                                                                        onChange={(e) => {
                                                                                            let value = e.target.value;
                                                                                            // allow only digits and one decimal
                                                                                            value = value?.replace(/[^0-9.]/g, '');
                                                                                            const parts = value.split('.');
                                                                                            if (parts.length > 2) {
                                                                                                value = parts.slice(0, 2).join('.') + parts.slice(2).join('');
                                                                                            }
                                                                                            setFieldValue('salary_Structure.conveyance', value);
                                                                                        }}
                                                                                        onKeyDown={(e) => {
                                                                                            if (['-', 'e', 'E'].includes(e.key)) {
                                                                                                e.preventDefault();
                                                                                            }
                                                                                        }}
                                                                                        onBlur={(e) => {
                                                                                            setFieldTouched(e.target.name, true);
                                                                                        }}
                                                                                        error={Boolean(getIn(touched, 'salary_Structure.conveyance') && getIn(errors, 'salary_Structure.conveyance'))}
                                                                                        helperText={
                                                                                            getIn(touched, 'salary_Structure.conveyance') && getIn(errors, 'salary_Structure.conveyance')
                                                                                                ? getIn(errors, 'salary_Structure.conveyance')
                                                                                                : ''
                                                                                        }
                                                                                        InputProps={{ inputProps: { min: 0 } }}
                                                                                    />
                                                                                </TableCell>

                                                                                <TableCell>Gratuity</TableCell>
                                                                                <TableCell>
                                                                                    <TextField
                                                                                        name={`salary_Structure.gratuity`}
                                                                                        fullWidth
                                                                                        size="small"
                                                                                        type="text"
                                                                                        value={getIn(values, 'salary_Structure.gratuity') || ''}
                                                                                        onChange={(e) => {
                                                                                            let value = e.target.value;
                                                                                            // allow only digits and one decimal
                                                                                            value = value?.replace(/[^0-9.]/g, '');
                                                                                            const parts = value.split('.');
                                                                                            if (parts.length > 2) {
                                                                                                value = parts.slice(0, 2).join('.') + parts.slice(2).join('');
                                                                                            }
                                                                                            setFieldValue('salary_Structure.gratuity', value);
                                                                                        }}
                                                                                        onKeyDown={(e) => {
                                                                                            if (['-', 'e', 'E'].includes(e.key)) {
                                                                                                e.preventDefault();
                                                                                            }
                                                                                        }}
                                                                                        onBlur={(e) => {
                                                                                            setFieldTouched(e.target.name, true);
                                                                                        }}
                                                                                        error={Boolean(getIn(touched, 'salary_Structure.gratuity') && getIn(errors, 'salary_Structure.gratuity'))}
                                                                                        helperText={
                                                                                            getIn(touched, 'salary_Structure.gratuity') && getIn(errors, 'salary_Structure.gratuity')
                                                                                                ? getIn(errors, 'salary_Structure.gratuity')
                                                                                                : ''
                                                                                        }
                                                                                        InputProps={{ inputProps: { min: 0 } }}
                                                                                    />
                                                                                </TableCell>
                                                                            </TableRow>
                                                                            <TableRow>
                                                                                <TableCell>Petrol Reimbursement</TableCell>
                                                                                <TableCell>
                                                                                    <TextField
                                                                                        name={`salary_Structure.petrol_reimbursement`}
                                                                                        fullWidth
                                                                                        size="small"
                                                                                        type="text"
                                                                                        value={getIn(values, 'salary_Structure.petrol_reimbursement') || ''}
                                                                                        onChange={(e) => {
                                                                                            let value = e.target.value;
                                                                                            // allow only digits and one decimal
                                                                                            value = value?.replace(/[^0-9.]/g, '');
                                                                                            const parts = value.split('.');
                                                                                            if (parts.length > 2) {
                                                                                                value = parts.slice(0, 2).join('.') + parts.slice(2).join('');
                                                                                            }
                                                                                            setFieldValue('salary_Structure.petrol_reimbursement', value);
                                                                                        }}
                                                                                        onKeyDown={(e) => {
                                                                                            if (['-', 'e', 'E'].includes(e.key)) {
                                                                                                e.preventDefault();
                                                                                            }
                                                                                        }}
                                                                                        onBlur={(e) => {
                                                                                            setFieldTouched(e.target.name, true);
                                                                                        }}
                                                                                        error={Boolean(getIn(touched, 'salary_Structure.petrol_reimbursement') && getIn(errors, 'salary_Structure.petrol_reimbursement'))}
                                                                                        helperText={
                                                                                            getIn(touched, 'salary_Structure.petrol_reimbursement') && getIn(errors, 'salary_Structure.petrol_reimbursement')
                                                                                                ? getIn(errors, 'salary_Structure.petrol_reimbursement')
                                                                                                : ''
                                                                                        }
                                                                                        InputProps={{ inputProps: { min: 0 } }}
                                                                                    />
                                                                                </TableCell>

                                                                                <TableCell>Medical Reimbursements</TableCell>
                                                                                <TableCell>
                                                                                    <TextField
                                                                                        name={`salary_Structure.medical_reimbursements`}
                                                                                        fullWidth
                                                                                        size="small"
                                                                                        type="text"
                                                                                        value={getIn(values, 'salary_Structure.medical_reimbursements') || ''}
                                                                                        onChange={(e) => {
                                                                                            let value = e.target.value;
                                                                                            // allow only digits and one decimal
                                                                                            value = value?.replace(/[^0-9.]/g, '');
                                                                                            const parts = value.split('.');
                                                                                            if (parts.length > 2) {
                                                                                                value = parts.slice(0, 2).join('.') + parts.slice(2).join('');
                                                                                            }
                                                                                            setFieldValue('salary_Structure.medical_reimbursements', value);
                                                                                        }}
                                                                                        onKeyDown={(e) => {
                                                                                            if (['-', 'e', 'E'].includes(e.key)) {
                                                                                                e.preventDefault();
                                                                                            }
                                                                                        }}
                                                                                        onBlur={(e) => {
                                                                                            setFieldTouched(e.target.name, true);
                                                                                        }}
                                                                                        error={Boolean(getIn(touched, 'salary_Structure.medical_reimbursements') && getIn(errors, 'salary_Structure.medical_reimbursements'))}
                                                                                        helperText={
                                                                                            getIn(touched, 'salary_Structure.medical_reimbursements') && getIn(errors, 'salary_Structure.medical_reimbursements')
                                                                                                ? getIn(errors, 'salary_Structure.medical_reimbursements')
                                                                                                : ''
                                                                                        }
                                                                                        InputProps={{ inputProps: { min: 0 } }}
                                                                                    />
                                                                                </TableCell>
                                                                            </TableRow>
                                                                            <TableRow>
                                                                                <TableCell>Attire Reimbursement</TableCell>
                                                                                <TableCell>
                                                                                    <TextField
                                                                                        name={`salary_Structure.attire_reimbursement`}
                                                                                        fullWidth
                                                                                        size="small"
                                                                                        type="text"
                                                                                        value={getIn(values, 'salary_Structure.attire_reimbursement') || ''}
                                                                                        onChange={(e) => {
                                                                                            let value = e.target.value;
                                                                                            // allow only digits and one decimal
                                                                                            value = value?.replace(/[^0-9.]/g, '');
                                                                                            const parts = value.split('.');
                                                                                            if (parts.length > 2) {
                                                                                                value = parts.slice(0, 2).join('.') + parts.slice(2).join('');
                                                                                            }
                                                                                            setFieldValue('salary_Structure.attire_reimbursement', value);
                                                                                        }}
                                                                                        onKeyDown={(e) => {
                                                                                            if (['-', 'e', 'E'].includes(e.key)) {
                                                                                                e.preventDefault();
                                                                                            }
                                                                                        }}
                                                                                        onBlur={(e) => {
                                                                                            setFieldTouched(e.target.name, true);
                                                                                        }}
                                                                                        error={Boolean(getIn(touched, 'salary_Structure.attire_reimbursement') && getIn(errors, 'salary_Structure.attire_reimbursement'))}
                                                                                        helperText={
                                                                                            getIn(touched, 'salary_Structure.attire_reimbursement') && getIn(errors, 'salary_Structure.attire_reimbursement')
                                                                                                ? getIn(errors, 'salary_Structure.attire_reimbursement')
                                                                                                : ''
                                                                                        }
                                                                                        InputProps={{ inputProps: { min: 0 } }}
                                                                                    />
                                                                                </TableCell>

                                                                                <TableCell>LTA</TableCell>
                                                                                <TableCell>
                                                                                    <TextField
                                                                                        name={`salary_Structure.lta`}
                                                                                        fullWidth
                                                                                        size="small"
                                                                                        type="text"
                                                                                        value={getIn(values, 'salary_Structure.lta') || ''}
                                                                                        onChange={(e) => {
                                                                                            let value = e.target.value;
                                                                                            // allow only digits and one decimal
                                                                                            value = value?.replace(/[^0-9.]/g, '');
                                                                                            const parts = value.split('.');
                                                                                            if (parts.length > 2) {
                                                                                                value = parts.slice(0, 2).join('.') + parts.slice(2).join('');
                                                                                            }
                                                                                            setFieldValue('salary_Structure.lta', value);
                                                                                        }}
                                                                                        onKeyDown={(e) => {
                                                                                            if (['-', 'e', 'E'].includes(e.key)) {
                                                                                                e.preventDefault();
                                                                                            }
                                                                                        }}
                                                                                        onBlur={(e) => {
                                                                                            setFieldTouched(e.target.name, true);
                                                                                        }}
                                                                                        error={Boolean(getIn(touched, 'salary_Structure.lta') && getIn(errors, 'salary_Structure.lta'))}
                                                                                        helperText={
                                                                                            getIn(touched, 'salary_Structure.lta') && getIn(errors, 'salary_Structure.lta')
                                                                                                ? getIn(errors, 'salary_Structure.lta')
                                                                                                : ''
                                                                                        }
                                                                                        InputProps={{ inputProps: { min: 0 } }}
                                                                                    />
                                                                                </TableCell>
                                                                            </TableRow>
                                                                            <TableRow>
                                                                                <TableCell>Subscription Allowance</TableCell>
                                                                                <TableCell>
                                                                                    <TextField
                                                                                        name={`salary_Structure.subscription_allowance`}
                                                                                        fullWidth
                                                                                        size="small"
                                                                                        type="text"
                                                                                        value={getIn(values, 'salary_Structure.subscription_allowance') || ''}
                                                                                        onChange={(e) => {
                                                                                            let value = e.target.value;
                                                                                            // allow only digits and one decimal
                                                                                            value = value?.replace(/[^0-9.]/g, '');
                                                                                            const parts = value.split('.');
                                                                                            if (parts.length > 2) {
                                                                                                value = parts.slice(0, 2).join('.') + parts.slice(2).join('');
                                                                                            }
                                                                                            setFieldValue('salary_Structure.subscription_allowance', value);
                                                                                        }}
                                                                                        onKeyDown={(e) => {
                                                                                            if (['-', 'e', 'E'].includes(e.key)) {
                                                                                                e.preventDefault();
                                                                                            }
                                                                                        }}
                                                                                        onBlur={(e) => {
                                                                                            setFieldTouched(e.target.name, true);
                                                                                        }}
                                                                                        error={Boolean(getIn(touched, 'salary_Structure.subscription_allowance') && getIn(errors, 'salary_Structure.subscription_allowance'))}
                                                                                        helperText={
                                                                                            getIn(touched, 'salary_Structure.subscription_allowance') && getIn(errors, 'salary_Structure.subscription_allowance')
                                                                                                ? getIn(errors, 'salary_Structure.subscription_allowance')
                                                                                                : ''
                                                                                        }
                                                                                        InputProps={{ inputProps: { min: 0 } }}
                                                                                    />
                                                                                </TableCell>

                                                                                <TableCell>Performance Bonus</TableCell>
                                                                                <TableCell>
                                                                                    <TextField
                                                                                        name={`salary_Structure.performance_bonus`}
                                                                                        fullWidth
                                                                                        size="small"
                                                                                        type="text"
                                                                                        value={getIn(values, 'salary_Structure.performance_bonus') || ''}
                                                                                        onChange={(e) => {
                                                                                            let value = e.target.value;
                                                                                            // allow only digits and one decimal
                                                                                            value = value?.replace(/[^0-9.]/g, '');
                                                                                            const parts = value.split('.');
                                                                                            if (parts.length > 2) {
                                                                                                value = parts.slice(0, 2).join('.') + parts.slice(2).join('');
                                                                                            }
                                                                                            setFieldValue('salary_Structure.performance_bonus', value);
                                                                                        }}
                                                                                        onKeyDown={(e) => {
                                                                                            if (['-', 'e', 'E'].includes(e.key)) {
                                                                                                e.preventDefault();
                                                                                            }
                                                                                        }}
                                                                                        onBlur={(e) => {
                                                                                            setFieldTouched(e.target.name, true);
                                                                                        }}
                                                                                        error={Boolean(getIn(touched, 'salary_Structure.performance_bonus') && getIn(errors, 'salary_Structure.performance_bonus'))}
                                                                                        helperText={
                                                                                            getIn(touched, 'salary_Structure.performance_bonus') && getIn(errors, 'salary_Structure.performance_bonus')
                                                                                                ? getIn(errors, 'salary_Structure.performance_bonus')
                                                                                                : ''
                                                                                        }
                                                                                        InputProps={{ inputProps: { min: 0 } }}
                                                                                    />
                                                                                </TableCell>
                                                                            </TableRow>
                                                                            <TableRow>
                                                                                <TableCell>Telephone Reimbursement</TableCell>
                                                                                <TableCell>
                                                                                    <TextField
                                                                                        name={`salary_Structure.telephone_reimbursement`}
                                                                                        fullWidth
                                                                                        size="small"
                                                                                        type="text"
                                                                                        value={getIn(values, 'salary_Structure.telephone_reimbursement') || ''}
                                                                                        onChange={(e) => {
                                                                                            let value = e.target.value;
                                                                                            // allow only digits and one decimal
                                                                                            value = value?.replace(/[^0-9.]/g, '');
                                                                                            const parts = value.split('.');
                                                                                            if (parts.length > 2) {
                                                                                                value = parts.slice(0, 2).join('.') + parts.slice(2).join('');
                                                                                            }
                                                                                            setFieldValue('salary_Structure.telephone_reimbursement', value);
                                                                                        }}
                                                                                        onKeyDown={(e) => {
                                                                                            if (['-', 'e', 'E'].includes(e.key)) {
                                                                                                e.preventDefault();
                                                                                            }
                                                                                        }}
                                                                                        onBlur={(e) => {
                                                                                            setFieldTouched(e.target.name, true);
                                                                                        }}
                                                                                        error={Boolean(getIn(touched, 'salary_Structure.telephone_reimbursement') && getIn(errors, 'salary_Structure.telephone_reimbursement'))}
                                                                                        helperText={
                                                                                            getIn(touched, 'salary_Structure.telephone_reimbursement') && getIn(errors, 'salary_Structure.telephone_reimbursement')
                                                                                                ? getIn(errors, 'salary_Structure.telephone_reimbursement')
                                                                                                : ''
                                                                                        }
                                                                                        InputProps={{ inputProps: { min: 0 } }}
                                                                                    />
                                                                                </TableCell>

                                                                                <TableCell>Any other (pls. specify)</TableCell>
                                                                                <TableCell>
                                                                                    <TextField
                                                                                        name={`salary_Structure.other`}
                                                                                        fullWidth
                                                                                        size="small"
                                                                                        type="text"
                                                                                        value={getIn(values, 'salary_Structure.other') || ''}
                                                                                        onChange={(e) => {
                                                                                            let value = e.target.value;
                                                                                            // allow only digits and one decimal
                                                                                            value = value?.replace(/[^0-9.]/g, '');
                                                                                            const parts = value.split('.');
                                                                                            if (parts.length > 2) {
                                                                                                value = parts.slice(0, 2).join('.') + parts.slice(2).join('');
                                                                                            }
                                                                                            setFieldValue('salary_Structure.other', value);
                                                                                        }}
                                                                                        onKeyDown={(e) => {
                                                                                            if (['-', 'e', 'E'].includes(e.key)) {
                                                                                                e.preventDefault();
                                                                                            }
                                                                                        }}
                                                                                        onBlur={(e) => {
                                                                                            setFieldTouched(e.target.name, true);
                                                                                        }}
                                                                                        error={Boolean(getIn(touched, 'salary_Structure.other') && getIn(errors, 'salary_Structure.other'))}
                                                                                        helperText={
                                                                                            getIn(touched, 'salary_Structure.other') && getIn(errors, 'salary_Structure.other')
                                                                                                ? getIn(errors, 'salary_Structure.other')
                                                                                                : ''
                                                                                        }
                                                                                        InputProps={{ inputProps: { min: 0 } }}
                                                                                    />
                                                                                </TableCell>
                                                                            </TableRow>
                                                                            <TableRow>
                                                                                <TableCell>Driver’s salary</TableCell>
                                                                                <TableCell>
                                                                                    <TextField
                                                                                        name={`salary_Structure.driver_salary`}
                                                                                        fullWidth
                                                                                        size="small"
                                                                                        type="text"
                                                                                        value={getIn(values, 'salary_Structure.driver_salary') || ''}
                                                                                        onChange={(e) => {
                                                                                            let value = e.target.value;
                                                                                            // allow only digits and one decimal
                                                                                            value = value?.replace(/[^0-9.]/g, '');
                                                                                            const parts = value.split('.');
                                                                                            if (parts.length > 2) {
                                                                                                value = parts.slice(0, 2).join('.') + parts.slice(2).join('');
                                                                                            }
                                                                                            setFieldValue('salary_Structure.driver_salary', value);
                                                                                        }}
                                                                                        onKeyDown={(e) => {
                                                                                            if (['-', 'e', 'E'].includes(e.key)) {
                                                                                                e.preventDefault();
                                                                                            }
                                                                                        }}
                                                                                        onBlur={(e) => {
                                                                                            setFieldTouched(e.target.name, true);
                                                                                        }}
                                                                                        error={Boolean(getIn(touched, 'salary_Structure.driver_salary') && getIn(errors, 'salary_Structure.driver_salary'))}
                                                                                        helperText={
                                                                                            getIn(touched, 'salary_Structure.driver_salary') && getIn(errors, 'salary_Structure.driver_salary')
                                                                                                ? getIn(errors, 'salary_Structure.driver_salary')
                                                                                                : ''
                                                                                        }
                                                                                        InputProps={{ inputProps: { min: 0 } }}
                                                                                    />
                                                                                </TableCell>
                                                                                <TableCell></TableCell>
                                                                                <TableCell></TableCell>
                                                                            </TableRow>
                                                                            <TableRow>
                                                                                <TableCell>Children’s Education Allow.</TableCell>
                                                                                <TableCell>
                                                                                    <TextField
                                                                                        name={`salary_Structure.children_education_allow`}
                                                                                        fullWidth
                                                                                        size="small"
                                                                                        type="text"
                                                                                        value={getIn(values, 'salary_Structure.children_education_allow') || ''}
                                                                                        onChange={(e) => {
                                                                                            let value = e.target.value;
                                                                                            // allow only digits and one decimal
                                                                                            value = value?.replace(/[^0-9.]/g, '');
                                                                                            const parts = value.split('.');
                                                                                            if (parts.length > 2) {
                                                                                                value = parts.slice(0, 2).join('.') + parts.slice(2).join('');
                                                                                            }
                                                                                            setFieldValue('salary_Structure.children_education_allow', value);
                                                                                        }}
                                                                                        onKeyDown={(e) => {
                                                                                            if (['-', 'e', 'E'].includes(e.key)) {
                                                                                                e.preventDefault();
                                                                                            }
                                                                                        }}
                                                                                        onBlur={(e) => {
                                                                                            setFieldTouched(e.target.name, true);
                                                                                        }}
                                                                                        error={Boolean(getIn(touched, 'salary_Structure.children_education_allow') && getIn(errors, 'salary_Structure.children_education_allow'))}
                                                                                        helperText={
                                                                                            getIn(touched, 'salary_Structure.children_education_allow') && getIn(errors, 'salary_Structure.children_education_allow')
                                                                                                ? getIn(errors, 'salary_Structure.children_education_allow')
                                                                                                : ''
                                                                                        }
                                                                                        InputProps={{ inputProps: { min: 0 } }}
                                                                                    />
                                                                                </TableCell>
                                                                                <TableCell></TableCell>
                                                                                <TableCell></TableCell>
                                                                            </TableRow>
                                                                            <TableRow>
                                                                                <TableCell>Professional Development</TableCell>
                                                                                <TableCell>
                                                                                    <TextField
                                                                                        name={`salary_Structure.professional_development`}
                                                                                        fullWidth
                                                                                        size="small"
                                                                                        type="text"
                                                                                        value={getIn(values, 'salary_Structure.professional_development') || ''}
                                                                                        onChange={(e) => {
                                                                                            let value = e.target.value;
                                                                                            // allow only digits and one decimal
                                                                                            value = value?.replace(/[^0-9.]/g, '');
                                                                                            const parts = value.split('.');
                                                                                            if (parts.length > 2) {
                                                                                                value = parts.slice(0, 2).join('.') + parts.slice(2).join('');
                                                                                            }
                                                                                            setFieldValue('salary_Structure.professional_development', value);
                                                                                        }}
                                                                                        onKeyDown={(e) => {
                                                                                            if (['-', 'e', 'E'].includes(e.key)) {
                                                                                                e.preventDefault();
                                                                                            }
                                                                                        }}
                                                                                        onBlur={(e) => {
                                                                                            setFieldTouched(e.target.name, true);
                                                                                        }}
                                                                                        error={Boolean(getIn(touched, 'salary_Structure.professional_development') && getIn(errors, 'salary_Structure.professional_development'))}
                                                                                        helperText={
                                                                                            getIn(touched, 'salary_Structure.professional_development') && getIn(errors, 'salary_Structure.professional_development')
                                                                                                ? getIn(errors, 'salary_Structure.professional_development')
                                                                                                : ''
                                                                                        }
                                                                                        InputProps={{ inputProps: { min: 0 } }}
                                                                                    />
                                                                                </TableCell>
                                                                                <TableCell></TableCell>
                                                                                <TableCell></TableCell>
                                                                            </TableRow>
                                                                            <TableRow>
                                                                                <TableCell>Any other (pls. specify</TableCell>
                                                                                <TableCell>
                                                                                    <TextField
                                                                                        name={`salary_Structure.any_other`}
                                                                                        fullWidth
                                                                                        size="small"
                                                                                        type="text"
                                                                                        value={getIn(values, 'salary_Structure.any_other') || ''}
                                                                                        onChange={(e) => {
                                                                                            let value = e.target.value;
                                                                                            // allow only digits and one decimal
                                                                                            value = value?.replace(/[^0-9.]/g, '');
                                                                                            const parts = value.split('.');
                                                                                            if (parts.length > 2) {
                                                                                                value = parts.slice(0, 2).join('.') + parts.slice(2).join('');
                                                                                            }
                                                                                            setFieldValue('salary_Structure.any_other', value);
                                                                                        }}
                                                                                        onKeyDown={(e) => {
                                                                                            if (['-', 'e', 'E'].includes(e.key)) {
                                                                                                e.preventDefault();
                                                                                            }
                                                                                        }}
                                                                                        onBlur={(e) => {
                                                                                            setFieldTouched(e.target.name, true);
                                                                                        }}
                                                                                        error={Boolean(getIn(touched, 'salary_Structure.any_other') && getIn(errors, 'salary_Structure.any_other'))}
                                                                                        helperText={
                                                                                            getIn(touched, 'salary_Structure.any_other') && getIn(errors, 'salary_Structure.any_other')
                                                                                                ? getIn(errors, 'salary_Structure.any_other')
                                                                                                : ''
                                                                                        }
                                                                                        InputProps={{ inputProps: { min: 0 } }}
                                                                                    />
                                                                                </TableCell>
                                                                                <TableCell></TableCell>
                                                                                <TableCell></TableCell>
                                                                            </TableRow>
                                                                        </TableBody>
                                                                    </Table>
                                                                </TableContainer>
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
                                                                    20. Joining Details
                                                                </Typography>

                                                                <TableContainer component={Paper} sx={{ mb: 2 }}>
                                                                    <Table size="small">
                                                                        <TableBody>
                                                                            <TableRow>
                                                                                <TableCell sx={{ width: '35%' }}>Minimum Joining Period</TableCell>
                                                                                <TableCell sx={{ width: '65%' }} >
                                                                                    <TextField
                                                                                        name={`joining_details.minimum_joining_period`}
                                                                                        fullWidth
                                                                                        size="small"
                                                                                        type="text"
                                                                                        value={getIn(values, 'joining_details.minimum_joining_period') || ''}
                                                                                        onChange={(e) => {
                                                                                            setFieldValue('joining_details.minimum_joining_period', e.target.value);
                                                                                        }}
                                                                                        onBlur={(e) => {
                                                                                            setFieldTouched(e.target.name, true);
                                                                                        }}
                                                                                        error={Boolean(getIn(touched, 'joining_details.minimum_joining_period') && getIn(errors, 'joining_details.minimum_joining_period'))}
                                                                                        helperText={
                                                                                            getIn(touched, 'joining_details.minimum_joining_period') && getIn(errors, 'joining_details.minimum_joining_period')
                                                                                                ? getIn(errors, 'joining_details.minimum_joining_period')
                                                                                                : ''
                                                                                        }
                                                                                        InputProps={{ inputProps: { min: 0 } }}
                                                                                    />
                                                                                </TableCell>
                                                                            </TableRow>
                                                                            <TableRow>
                                                                                <TableCell sx={{ width: '35%' }}>Notice Period of Current Employment</TableCell>
                                                                                <TableCell sx={{ width: '65%' }} >
                                                                                    <TextField
                                                                                        name={`joining_details.notice_period_of_current_emp`}
                                                                                        fullWidth
                                                                                        size="small"
                                                                                        type="text"
                                                                                        value={getIn(values, 'joining_details.notice_period_of_current_emp') || ''}
                                                                                        onChange={(e) => {
                                                                                            setFieldValue('joining_details.notice_period_of_current_emp', e.target.value);
                                                                                        }}
                                                                                        onBlur={(e) => {
                                                                                            setFieldTouched(e.target.name, true);
                                                                                        }}
                                                                                        error={Boolean(getIn(touched, 'joining_details.notice_period_of_current_emp') && getIn(errors, 'joining_details.notice_period_of_current_emp'))}
                                                                                        helperText={
                                                                                            getIn(touched, 'joining_details.notice_period_of_current_emp') && getIn(errors, 'joining_details.notice_period_of_current_emp')
                                                                                                ? getIn(errors, 'joining_details.notice_period_of_current_emp')
                                                                                                : ''
                                                                                        }
                                                                                        InputProps={{ inputProps: { min: 0 } }}
                                                                                    />
                                                                                </TableCell>
                                                                            </TableRow>
                                                                            <TableRow>
                                                                                <TableCell sx={{ width: '35%' }}>Location Preference, if any</TableCell>
                                                                                <TableCell sx={{ width: '65%' }} >
                                                                                    <TextField
                                                                                        name={`joining_details.preferred_location`}
                                                                                        fullWidth
                                                                                        size="small"
                                                                                        type="text"
                                                                                        value={getIn(values, 'joining_details.preferred_location') || ''}
                                                                                        onChange={(e) => {
                                                                                            setFieldValue('joining_details.preferred_location', e.target.value);
                                                                                        }}
                                                                                        onBlur={(e) => {
                                                                                            setFieldTouched(e.target.name, true);
                                                                                        }}
                                                                                        error={Boolean(getIn(touched, 'joining_details.preferred_location') && getIn(errors, 'joining_details.preferred_location'))}
                                                                                        helperText={
                                                                                            getIn(touched, 'joining_details.preferred_location') && getIn(errors, 'joining_details.preferred_location')
                                                                                                ? getIn(errors, 'joining_details.preferred_location')
                                                                                                : ''
                                                                                        }
                                                                                        InputProps={{ inputProps: { min: 0 } }}
                                                                                    />
                                                                                </TableCell>
                                                                            </TableRow>
                                                                            <TableRow>
                                                                                <TableCell sx={{ width: '35%' }}>Location Constraint, if any</TableCell>
                                                                                <TableCell sx={{ width: '65%' }} >
                                                                                    <TextField
                                                                                        name={`joining_details.preferred_location`}
                                                                                        fullWidth
                                                                                        size="small"
                                                                                        type="text"
                                                                                        value={getIn(values, 'joining_details.constant_location') || ''}
                                                                                        onChange={(e) => {
                                                                                            setFieldValue('joining_details.constant_location', e.target.value);
                                                                                        }}
                                                                                        onBlur={(e) => {
                                                                                            setFieldTouched(e.target.name, true);
                                                                                        }}
                                                                                        error={Boolean(getIn(touched, 'joining_details.constant_location') && getIn(errors, 'joining_details.constant_location'))}
                                                                                        helperText={
                                                                                            getIn(touched, 'joining_details.constant_location') && getIn(errors, 'joining_details.constant_location')
                                                                                                ? getIn(errors, 'joining_details.constant_location')
                                                                                                : ''
                                                                                        }
                                                                                        InputProps={{ inputProps: { min: 0 } }}
                                                                                    />
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        </TableBody>
                                                                    </Table>
                                                                </TableContainer>
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
                                                                    19. References (Other than Family)
                                                                </Typography>

                                                                <TableContainer component={Paper} sx={{ mb: 2 }}>
                                                                    <Table size="small">
                                                                        <TableBody>
                                                                            {[
                                                                                { level: 'Name of the Reference', name: 'name_of_reference', type: 'text' },
                                                                                { level: 'Designation / Organisation', name: 'designation_organization', type: 'text' },
                                                                                { level: 'Email', name: 'email', type: 'email' },
                                                                                { level: 'Relationship with self', name: 'relation_ship_with_self', type: 'text' },
                                                                                { level: 'Contact No.', name: 'contact_number', type: 'text' },
                                                                            ].map((item, idx) => (
                                                                                <TableRow key={idx}>
                                                                                    {/* Column for Reference 1 */}
                                                                                    <TableCell sx={{ width: '20%' }}>{item.level}</TableCell>

                                                                                    <TableCell sx={{ width: '30%' }}>
                                                                                        <TextField
                                                                                            fullWidth
                                                                                            size="small"
                                                                                            type={item.type}
                                                                                            name={`reference[0].${item.name}`}
                                                                                            value={getIn(values, `reference[0].${item.name}`) || ''}
                                                                                            onChange={(e) => setFieldValue(e.target.name, e.target.value)}
                                                                                            onBlur={(e) => setFieldTouched(e.target.name, true)}
                                                                                            error={Boolean(
                                                                                                getIn(touched, `reference[0].${item.name}`) &&
                                                                                                getIn(errors, `reference[0].${item.name}`)
                                                                                            )}
                                                                                            helperText={
                                                                                                getIn(touched, `reference[0].${item.name}`) &&
                                                                                                    getIn(errors, `reference[0].${item.name}`) ? getIn(errors, `reference[0].${item.name}`) : ''
                                                                                            }
                                                                                        />
                                                                                    </TableCell>

                                                                                    <TableCell sx={{ width: '20%' }}>{item.level}</TableCell>

                                                                                    {/* Column for Reference 2 */}
                                                                                    <TableCell sx={{ width: '30%' }}>
                                                                                        <TextField
                                                                                            fullWidth
                                                                                            size="small"
                                                                                            type={item.type}
                                                                                            name={`reference[1].${item.name}`}
                                                                                            value={getIn(values, `reference[1].${item.name}`) || ''}
                                                                                            onChange={(e) => setFieldValue(e.target.name, e.target.value)}
                                                                                            onBlur={(e) => setFieldTouched(e.target.name, true)}
                                                                                            error={Boolean(
                                                                                                getIn(touched, `reference[1].${item.name}`) &&
                                                                                                getIn(errors, `reference[1].${item.name}`)
                                                                                            )}
                                                                                            helperText={
                                                                                                getIn(touched, `reference[1].${item.name}`) &&
                                                                                                    getIn(errors, `reference[1].${item.name}`) ? getIn(errors, `reference[1].${item.name}`) : ''
                                                                                            }
                                                                                        />
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            ))}
                                                                        </TableBody>
                                                                    </Table>
                                                                    {errors.reference && typeof errors.reference === 'string' && (
                                                                        <Typography variant="caption" color="error" sx={{ ml: 1, display: 'block', mb: 1 }}>
                                                                            {errors.reference}
                                                                        </Typography>
                                                                    )}
                                                                </TableContainer>
                                                                <DeclarationSection />
                                                            </Grid>
                                                        </Grid>
                                                    )
                                                }

                                                <StepNavigation
                                                    activeStep={activeStep}
                                                    steps={steps}
                                                    handleBack={handleBack}
                                                />

                                            </Form>
                                        )}
                                    </Formik>
                            }
                        </div>
                    </div>
                </div>
            </div>

            <ToastContainer
                position="top-right"
                autoClose={5000}
                theme="dark"
                limit={1}
            />
        </>

    );
};



export default ApplicationForm;