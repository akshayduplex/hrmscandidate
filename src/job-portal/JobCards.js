import React from "react";
import { IoLocationOutline } from "react-icons/io5";
// import { MdOutlineCurrencyRupee } from "react-icons/md";
import { FiCalendar } from "react-icons/fi";
import { changeJobType, DateConverts } from "../utils/DateConvertion"
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Tooltip from '@mui/material/Tooltip';



function JobCards({ jobs }) {
    const location = useLocation();

    console.log(location.pathname);
    return (
        <>
            <Link to={`/job-details/${jobs?.job_title_slug}`}>
                <div className="card jobcard" key={jobs?._id}>
                    <div className="card-body">
                        <div className="dflexbtwn">
                            <span className="date"><FiCalendar /> {jobs?.add_date?.split(',')[0]} </span>
                            <span className="date"><FiCalendar />{DateConverts(jobs.deadline)}</span>
                            <span className="type">{changeJobType(jobs?.job_type)}</span>
                        </div>
                        <h5 className="job_profile">{jobs?.job_title?.length > 30 ? jobs?.job_title?.slice(0, 30) + "..." : jobs?.job_title}</h5>
                        <div className="d-flex compny_site flex-column">
                            <p>{jobs?.project_name}</p>
                            <span className="date">Openings: {jobs?.total_vacancy}</span>
                        </div>
                        <div className="dflexbtwn">
                            {/* <div className="salry">
                                <span>Max Monthly Salary</span>
                                <p><MdOutlineCurrencyRupee />{MonthlySalary(jobs?.salary_range)}</p>
                            </div> */}
                            {
                                (() => {
                                    const joinedComma = jobs?.location?.map((item) => item.name)?.join(",") || '';
                                    const joinedPipe = jobs?.location?.map((item) => item.name)?.join(" | ") || '';
                                    const displayTextOthers = joinedPipe.length > 40 ? joinedPipe.slice(0, 40) + '...' : joinedPipe;


                                    if (location.pathname === '/') {
                                        const displayText = joinedComma.length > 40 ? joinedComma.slice(0, 40) + '...' : joinedComma;
                                        return (
                                            <div className="location">
                                                <span>Location</span>
                                                <Tooltip
                                                    title={joinedComma}
                                                    arrow
                                                    componentsProps={{
                                                        tooltip: {
                                                            sx: { bgcolor: 'primary.main', color: '#fff' }
                                                        }
                                                    }}
                                                >
                                                    <p><IoLocationOutline /> {displayText}</p>
                                                </Tooltip>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div className="location">
                                            <span>Location</span>
                                            <Tooltip
                                                title={joinedComma}
                                                arrow
                                                componentsProps={{
                                                    tooltip: {
                                                        sx: { bgcolor: 'primary.main', color: '#fff' }
                                                    }
                                                }}
                                            >
                                                <p><IoLocationOutline /> {displayTextOthers}</p>
                                            </Tooltip>
                                        </div>
                                    );
                                })()
                            }
                        </div>
                    </div>
                </div>
            </Link>
        </>
    );
}
export default JobCards;