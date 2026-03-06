import React from 'react';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { Form as BootstrapForm, Button, InputGroup, Col } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { setStream, setLocation, hasfilter, setFilterByTitle } from '../../Redux/Slices/JobFiltersSlices';
import { FetchJobsList, FetchJobsListTotal } from '../../Redux/Slices/JobListApi';
import CustomAsyncSelectField from './SelectComponents';
import DesignationSelectField from './designationSuggetion';
import { TextField } from '@mui/material';
import config from '../../Config/Config';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
// import SearchInput from './SearchInputs';

const validationSchema = Yup.object({
    what: Yup.string(),
    where: Yup.string(),
    search: Yup.string(),
});


const customStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: '#fff !important',
        borderColor: state.isFocused ? '#D2C9FF' : state.isHovered ? '#80CBC4' : provided.borderColor,
        boxShadow: state.isFocused ? '0 0 0 1px #D2C9FF' : 'none',
        '&:hover': {
            borderColor: '#D2C9FF',
        },
        // maxWidth: '250px',
        width: '250px',
        height: '44px',
        borderTopLeftRadius: '0',
        borderBottomLeftRadius: '0'
    }),
    menu: (provided) => ({
        ...provided,
        borderTop: '1px solid #D2C9FF',
    }),
    option: (provided, state) => ({
        ...provided,
        borderBottom: '1px solid #D2C9FF',
        color: state.isSelected ? '#fff' : '#000000',
        backgroundColor: state.isSelected ? '#4CAF50' : state.isFocused ? '#80CBC4' : provided.backgroundColor,
        '&:hover': {
            backgroundColor: '#80CBC4',
            color: '#fff',
        },
    }),
};

const JobSearchForm = ({ clearForm }) => {
    const ActionDispatch = useDispatch();
    const formikRef = React.useRef();

    const { id } = useParams();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (clearForm) {
            if (formikRef.current) {
                formikRef.current.resetForm();
            }
        }
    }, [clearForm]);

    return (
        <Formik
            innerRef={formikRef}
            initialValues={{ what: '', where: '', search: '' }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                ActionDispatch(setStream(values.what))
                ActionDispatch(setLocation(values.where))
                ActionDispatch(setFilterByTitle(values.search))
                ActionDispatch(FetchJobsList({ stream: values.what, location: values?.where, page_no: '1', job_type: '', salary_range: '', filterByTitle: values.search }))
                ActionDispatch(FetchJobsListTotal({ stream: values.what, location: values?.where, page_no: '1', job_type: '', salary_range: '', filterByTitle: values.search }))
                ActionDispatch(hasfilter(true))
                setSubmitting(false);
                if(id && config.duplex_build === 'no' ){
                    return navigate(`/`);
                }
            }}
        >
            {({ handleSubmit, isSubmitting, setFieldValue, values }) => (
                <BootstrapForm noValidate onSubmit={handleSubmit}>
                    <BootstrapForm.Group as={Col} controlId="formGridAddress1">
                        <div className="selectflex">
                            <InputGroup className="flex-nowrap input-group-no-wrap">
                                <InputGroup.Text>What</InputGroup.Text>
                                <Field
                                    name="what"
                                    component={DesignationSelectField}
                                    customStyles={customStyles}
                                />
                            </InputGroup>
                            <InputGroup className="flex-nowrap input-group-no-wrap">
                                <InputGroup.Text>Where</InputGroup.Text>
                                <Field
                                    name="where"
                                    component={CustomAsyncSelectField}
                                    customStyles={customStyles}
                                />
                                {/* <ErrorMessage name="where" component="div" className="text-danger" /> */}
                            </InputGroup>


                            <InputGroup className="flex-nowrap input-group-no-wrap">
                                <InputGroup.Text>Jobs</InputGroup.Text>

                                {/* <SearchInput 
                                 value={values.search}
                                 onChange={(e) => setFieldValue('search', e.target.value)}
                                 onClear={() => setFieldValue('search', '')}
                                /> */}
                                <TextField
                                    name="search"
                                    type="text"
                                    placeholder='Search'
                                    value={values.search}
                                    size="small"
                                    onChange={(e) => setFieldValue('search', e.target.value)}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            height: '42px',
                                            backgroundColor: 'white',
                                            // '& fieldset': {
                                            //     borderLeft: 'none',
                                            //     borderRight: 'none',
                                            //     borderTop: 'none',
                                            //     borderBottom: '1px solid #D2C9FF',
                                            // },
                                            // '&:hover fieldset': {
                                            //     borderBottom: '1px solid #80CBC4',
                                            // },
                                            // '&.Mui-focused fieldset': {
                                            //     borderBottom: '1px solid #D2C9FF',
                                            // },
                                        },
                                        '& .MuiInputBase-input': {
                                            height: '42px',
                                            padding: '8px 14px',
                                            boxSizing: 'border-box',
                                        },
                                    }}
                                />
                                {/* <ErrorMessage name="where" component="div" className="text-danger" /> */}
                            </InputGroup>

                            {/* <SearchInput 
                             value={values.search}
                             onChange={(e) => setFieldValue('search', e.target.value)}
                             onClear={() => setFieldValue('search', '')}
                            /> */}



                            <Button className="sitebtn jobsearch bgblue" type="submit" disabled={isSubmitting}>
                                Find Jobs
                            </Button>
                        </div>
                    </BootstrapForm.Group>
                </BootstrapForm>
            )}
        </Formik>
    );
};

export default JobSearchForm;
