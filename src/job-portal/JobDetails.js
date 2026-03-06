import React, { useEffect } from "react";
import JobCards from "./JobCards";
import TopBanner from "./TopBanner";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { useSelector } from "react-redux";
import { InfinitySpin } from 'react-loader-spinner'
import { useDispatch } from "react-redux";
import { FetchJobsList } from "../Redux/Slices/JobListApi";
import notFoundImage from '../images/notFound.png'
import { fetchPackages } from "../Redux/Slices/JobListApi";
// import { JobTypes } from "../Redux/Slices/JobListApi";
import { useParams } from "react-router-dom";



import VerticalTabs from './Vertical-jobs';
import JobDescription from './JobDescription';
import DepartmentSelectField from "./JobSearchForm/departmentSuggetion";
import config from "../Config/Config";

function Job_details() {
    const selectedStream = useSelector(state => state.filter.selectedStream)
    const PackagesList = useSelector(state => state.jobs.packages)
    const Jobs = useSelector(state => state.jobs.jobsList);
    const { id } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchPackages())
        dispatch(FetchJobsList({ stream: '', location: '' , slug: config.duplex_build === 'no' ? id : '' }))
    }, [dispatch , id])

    const HOC = () => {
        if (Jobs.status === 'loading') {
            return <div className="d-flex align-items-center justify-content-center" role="status">
                <InfinitySpin
                    visible={true}
                    width="400"
                    color="#30A9E2"
                    ariaLabel="infinity-spin-loading"
                />
            </div>
        } else if (Jobs.status === 'failed') {
            return <div className="d-flex align-items-center justify-content-center" role="status">
                <h4 className="text-danger">Error: {Jobs.error}</h4>
            </div>
        } else {

            if (Jobs.data.length !== 0 && Jobs.data.data.length > 0) {
                const tabs = Jobs.data.data.map(jobs => ({
                    title: <JobCards jobs={jobs} />,
                    content: <JobDescription jobs={jobs} />
                }))
                let FindIndex = Jobs.data.data.findIndex(value => value?.job_title_slug === id);
                if (FindIndex === -1) {
                    FindIndex = 0;
                }
                return <VerticalTabs tabs={tabs} selectedIndexValue={FindIndex} />
            } else {
                return <div className="d-flex align-items-center justify-content-center">
                    <img className="" style={{ maxWidth: '200px', maxHeight: '200px' }} src={notFoundImage} alt="data not Found" />
                </div>
            }
        }
    }
    return (
        <>
            <TopBanner />

            <div className="container">
                <div className="joblist_display mt-4">

                    {
                        config.duplex_build === 'yes' && (
                            <div className="jobcounts dflexbtwn">
                                <h5><span>{Jobs?.data?.length === 0 ? 0 : Jobs.data.data.length}</span> Jobs Openings In {selectedStream === '' ? 'All' : selectedStream} Stream</h5>
                                <div className="filters">
                                    <DepartmentSelectField
                                        onChange={value => {
                                            dispatch(FetchJobsList({ stream: '', location: '', page_no: '', job_type: '', salary_range: '', days: '', relevant: value , slug: config.duplex_build === 'no' ? id : '' }))
                                        }}
                                    />
                                    <Form.Select aria-label="Default select example" onChange={(e) => {
                                        // setJobTypes(e.target.value)
                                        dispatch(FetchJobsList({ stream: '', location: '', page_no: '', job_type: e.target.value, salary_range: '' , slug: config.duplex_build === 'no' ? id : '' }))
                                    }}>
                                        <option value="">Job Type</option>
                                        {/* {
                                    jobTypes.status === 'succeeded' && 
                                    jobTypes.data.map((jobType, index) => {
                                        return <option key={index} value={jobType.name}>{jobType.name}</option>
                                    })
                                } */}
                                        <option value={"On Contract"}>On Consultant</option>
                                        <option value={"On Role"}>On Role</option>
                                    </Form.Select>
                                    <InputGroup>
                                        <InputGroup.Text><MdOutlineCurrencyRupee /></InputGroup.Text>
                                        <Form.Select defaultValue="Choose..." onChange={(e) => {
                                            dispatch(FetchJobsList({ stream: '', location: '', page_no: '', job_type: '', salary_range: e.target.value , slug: config.duplex_build === 'no' ? id : '' }))
                                        }}>
                                            <option> Salary Range </option>
                                            {
                                                PackagesList.status === 'loading' ?
                                                    <option> Loading.... </option>
                                                    : PackagesList.data.length > 0 && PackagesList.data.map((key, index) => {
                                                        return <option value={key.label} key={index}>{key.label}</option>
                                                    })
                                            }
                                        </Form.Select>
                                    </InputGroup>
                                    <Form.Select aria-label="Default select example" onChange={(e) => {
                                        dispatch(FetchJobsList({ stream: '', location: '', page_no: '', job_type: '', salary_range: '', days: e.target.value , slug: config.duplex_build === 'no' ? id : '' }))
                                    }}>
                                        <option value={''}>Days</option>
                                        <option value="7">7 days</option>
                                        <option value="15">15 days</option>
                                        <option value="30">30 days</option>
                                    </Form.Select>
                                </div>
                            </div>
                        )
                    }
                    <div className="row">
                        {
                            HOC()
                        }
                    </div>
                </div>
            </div>
        </>
    );
}
export default Job_details;