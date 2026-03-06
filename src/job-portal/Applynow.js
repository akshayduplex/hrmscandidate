import React from "react";
import Applyform from "./Applyform";
import { FiCalendar } from "react-icons/fi";
import { GiSandsOfTime } from "react-icons/gi";
import { MdOutlineCurrencyRupee } from "react-icons/md";
// import { useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchRecordsById } from "../Redux/Slices/JobListApi";
import { InfinitySpin } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { changeJobType, DateConverts, MonthlySalary } from "../utils/DateConvertion";
// import { camelCaseHandle } from "../utils/DateConvertion";

function ApplyNow() {

    const jobs = useSelector((state) => state.jobs.jobRecordsById)
    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-sm-4">
                        <div className="applyhdr">
                            {
                                jobs.status === 'loading' ?
                                    <InfinitySpin
                                        visible={true}
                                        width="400"
                                        color="#30A9E2"
                                        ariaLabel="infinity-spin-loading"
                                    /> :
                                    <>
                                        <div className="job_postn">
                                            <span className="work_loc">{changeJobType(jobs.data?.job_type)}</span>
                                            <h3>{jobs.data.job_title} </h3>
                                            <span>{jobs.status === 'succeeded' && jobs.data.location[0].name}</span>
                                        </div>
                                        <div className="job_summry">
                                            <div className="jbsum">
                                                <span>Job Type</span>
                                                <p><FiCalendar />  {changeJobType(jobs.data.job_type)}</p>
                                            </div>
                                            <div className="jbsum">
                                                <span>Max Monthly Salary</span>
                                                <p><MdOutlineCurrencyRupee /> {MonthlySalary(jobs?.data?.salary_range)}</p>
                                            </div>
                                            <div className="jbsum">
                                                <span>Deadline</span>
                                                <p><GiSandsOfTime /> {DateConverts(jobs.data.deadline)}</p>
                                            </div>
                                        </div>
                                        <div className="job_benfit">
                                            <h5>Benefits</h5>
                                            <ul className="benefits">
                                                {
                                                    Object.entries(jobs.data)?.length > 0 && jobs.data.benefits.map((benefits, index) => {
                                                        return <li key={index}>{benefits.name}</li>
                                                    })
                                                }
                                            </ul>
                                        </div>
                                    </>
                            }
                        </div>
                    </div>
                    <div className="col-sm-8">
                        <Applyform />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ApplyNow;