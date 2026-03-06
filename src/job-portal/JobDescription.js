
import React, { useMemo } from 'react';
import { FiCalendar } from "react-icons/fi";
import { GiSandsOfTime } from "react-icons/gi";
// import { MdOutlineCurrencyRupee } from "react-icons/md";
import { DateConverts , changeJobType } from '../utils/DateConvertion';
import ShareButton from './JobShareOption/ShareButton';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import config from '../Config/Config';
import { useSelector } from 'react-redux';
const Job_description = ({ jobs }) => {
    const jobTitle = jobs?.job_title;
    const jobDescription = jobs?.description;
    const webSetting = useSelector(state => state.jobs.webSettingData);

    let icons = useMemo(() => {
        return webSetting && webSetting?.data?.logo_image
    } , [webSetting])

    const jobImage = `${config.IMAGE_PATH}${icons}`;

    function convertHtmlToText(html) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || doc.body.innerText || '';
    }

    const jobUrl = `${config.FRONT_URL + 'job-details'}/${jobs?.job_title_slug}&title=${jobTitle}&description=${convertHtmlToText(jobDescription)}`;

    return (
        <>
            <Helmet>
                <title>{jobTitle}</title>
                <meta name="keywords" content={`${jobs?.job_title || ''} , ${jobs?.location?.map((item) => item?.name)?.join(', ') || ''} , ${changeJobType(jobs?.job_type) || ''} ,  ${jobs?.company || ''} ,  ${jobs?.total_vacancy} ,  ${moment(jobs?.deadline).format('DD/MM/YYYY')}`} />
                <meta name="title" content={`${jobs?.job_title || ''} , ${jobs?.location?.map((item) => item?.name)?.join(', ') || ''} ,  ${changeJobType(jobs?.job_type) || ''} ,  ${jobs?.company || ''} ,  ${jobs?.total_vacancy ? jobs?.total_vacancy : 0} ,  ${moment(jobs?.deadline).format('DD/MM/YYYY')}`} />
                <meta name="description" content={`${jobs?.job_title || ''} ,  ${convertHtmlToText(jobDescription)} ${jobs?.location?.map((item) => item?.name)?.join(', ') || ''} , ${changeJobType(jobs?.job_type) || ''}  ${jobs?.company || ''}  , ${jobs?.total_vacancy ? jobs?.total_vacancy : 0} ,  ${moment(jobs?.deadline).format('DD/MM/YYYY')}`} />
                <meta name="url" content={jobUrl} />

                {/* Twitter OG */}
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content={jobTitle} />
                <meta name="twitter:description" content={convertHtmlToText(jobDescription)} />
                <meta name="twitter:url" content={jobUrl} />
                <meta property="twitter:image" content={jobImage} />

                {/* Facebook OG */}
                <meta property="og:locale" content="en_US" />
                <meta property="og:title" content={jobTitle} />
                <meta property="og:description" content={convertHtmlToText(jobDescription)} />
                <meta property="og:url" content={jobUrl} />
                <meta property="og:site_name" content={config.FRONT_URL} />
                <meta property="og:type" content="website" />
                <meta property="og:image" content={jobImage} />

                {/* LinkedIn OG */}
                <meta property="linkedin:title" content={jobTitle} />
                <meta property="linkedin:description" content={convertHtmlToText(jobDescription)} />
                <meta property="linkedin:type" content="website" />
                <meta property="linkedin:site_name" content={config.FRONT_URL} />
                <meta property="linkedin:url" content={jobUrl} />
                <meta property="linkedin:image" content={jobImage} />
            </Helmet>
            <div className="detailsbox">
                <div className="dtlheadr">
                    <div className="job_postn">
                        <span className="work_loc">{changeJobType(jobs?.job_type)}</span>
                        <h3>{jobTitle}</h3>
                        <b>{jobs?.project_name}</b>
                        <p>{jobs?.designation}</p>
                        {/* <span>{jobs?.location?.map((item) => item.name)?.join(',')}</span> */}
                    </div>
                    <div className="job_summry">
                        <div className="jbsum">
                            <span>Job Type</span>
                            <p><FiCalendar /> {changeJobType(jobs?.job_type)}</p>
                        </div>
                        {/* <div className="jbsum">
                            <span>Max Monthly Salary</span>
                            <p><MdOutlineCurrencyRupee /> {MonthlySalary(jobs?.salary_range)}</p>
                        </div> */}
                        <div className="jbsum">
                            <span>Deadline</span>
                            <p><GiSandsOfTime /> {DateConverts(jobs?.deadline)}</p>
                        </div>
                        <div className="apply_share">
                            <div className="btn_date">
                                <Link className='sitebtn jobsearch bgblue' type='submit' to={`/apply/${jobs?._id}`}>Apply Now</Link>
                                <span>{moment().format('DD/MM/YYYY, h:mm a')}</span>
                            </div>
                            <ShareButton Job_description={jobs} />
                        </div>
                    </div>
                </div>
                <div className="dtl_body">
                    <div className="job_benfit">
                        <h5>Job Location(s)</h5>
                        <ul className="benefits">
                            {jobs?.location?.map((loc, index) => (
                                <li key={index}>{loc.name}</li>
                            ))}
                        </ul>
                        <h5>Benefits</h5>
                        <ul className="benefits">
                            {jobs?.benefits?.map((benefit, index) => (
                                <li key={index}>{benefit.name}</li>
                            ))}
                        </ul>
                    </div>
                    <div className='job_description' dangerouslySetInnerHTML={{ __html: jobs?.description }} />
                </div>
            </div>
        </>
    );
};

export default Job_description;
