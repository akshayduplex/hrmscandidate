import React, { useState, useEffect } from "react";
import JobCards from "./JobCards";
import TopBanner from "./TopBanner";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from 'react-bootstrap';
import notFoundImage from '../images/notFound.png';
import connectionError from '../images/ConnectionError.jpg';
import { clearFilters, hasfilter } from '../Redux/Slices/JobFiltersSlices';
import { ConfigrationSetting } from "../Redux/Slices/JobListApi";
import config from "../Config/Config";
import { Helmet } from "react-helmet";
import { FetchJobsList, FetchJobsListTotal } from "../Redux/Slices/JobListApi";
import { InfinitySpin } from "react-loader-spinner";

function Job_listing() {
    const [currentPage, setCurrentPage] = useState(9);
    const [loadingMore, setLoadingMore] = useState(false); // Track loading for more jobs
    const dispatch = useDispatch();
    const topBannerRef = React.useRef();


    const selectedStream = useSelector((state) => state.filter.selectedStream);
    const selectedLocation = useSelector(state => state.filter.selectedLocation)

    const filterByTitle = useSelector((state) => state.filter.filterByTitle);
    const Jobs = useSelector(state => state.jobs.jobsList);
    const total = useSelector(state => state.jobs.totalCount);
    const appliedFilter = useSelector(state => state.filter.appliedFilter);
    const webSetting = useSelector(state => state.jobs.webSettingData);


    const handleViewMore = () => {

        setLoadingMore(true); // Set loading more to true
        const nextPage = currentPage + 6; // Calculate the next page count
        setCurrentPage(nextPage); // Update current page state
        dispatch(FetchJobsList({ stream: selectedStream || '', location: '', par_Page_record: `${nextPage}`, job_type: '', salary_range: '', days: '', filterByTitle: filterByTitle || "" }))
            .finally(() => setLoadingMore(false)); // Reset loading more state after fetch
    };

    const handleClearFilters = () => {
        dispatch(clearFilters());
        dispatch(FetchJobsList({ stream: '', location: '', par_Page_record: `${currentPage}`, job_type: '', salary_range: '', filterByTitle: '' }));
        dispatch(FetchJobsListTotal({ stream: '', location: '', par_Page_record: `${currentPage}`, job_type: '', salary_range: '', filterByTitle: '' }));
        if (topBannerRef.current) {
            topBannerRef.current.clearForm();
        }
        dispatch(hasfilter(false))
    };

    const hasMoreJobs = Jobs?.data?.data && Jobs.data.data.length >= currentPage;

    useEffect(() => {
        dispatch(ConfigrationSetting({ domain: config.FRONT_URL }))
    }, [dispatch])

    useEffect(() => {
        dispatch(FetchJobsList({ stream: selectedStream || '', location: selectedLocation || '', par_Page_record: `${currentPage}`, filterByTitle: filterByTitle || "" }));
        dispatch(FetchJobsListTotal({ stream: selectedStream || '', location:selectedLocation || '', par_Page_record: `${currentPage}`, filterByTitle: filterByTitle || "" }));
    }, [dispatch, currentPage]);

    // Manages Web Fab Icons Setting Using the Rile URL
    const changeFavicon = (newFavicon) => {
        const link = document.querySelector("link[rel*='icon']");
        if (link) {
            link.href = config.IMAGE_PATH + newFavicon;
        } else {
            const newLink = document.createElement("link");
            newLink.rel = "icon";
            newLink.href = newFavicon;
            document.head.appendChild(newLink);
        }
    };

    useEffect(() => {
        if (webSetting && webSetting?.data?.fav_icon_image) {
            changeFavicon(webSetting?.data?.fav_icon_image);
        }
    }, [webSetting]);


    return (
        <>
            <Helmet>
                <title>{webSetting && webSetting?.data?.site_title}</title>
                <meta name="title" content={webSetting && webSetting?.data?.meta_title} />
                <meta name="keywords" content={webSetting && webSetting?.data?.meta_description} />
                <meta name="description" content={webSetting && webSetting?.data?.meta_description} />
                {/* Twitter OG */}
                <meta name="twitter:card" content={webSetting && webSetting?.data?.site_title} />
                <meta name="twitter:title" content={webSetting && webSetting?.data?.site_title} />
                <meta name="twitter:description" content={webSetting && webSetting?.data?.meta_description} />
            </Helmet>
            <TopBanner ref={topBannerRef} />

            <div className="container">
                <div className="joblist_display mt-4">
                    <div className="jobcounts d-flex justify-content-between align-items-center">
                        <h5>
                            <span>{Jobs.data.length !== 0 ? Jobs.data.data.length : 0} of {total?.status === 'succcess' ? total?.data?.data : 0}</span> Jobs Openings In {selectedStream === '' ? 'All' : selectedStream} Stream
                        </h5>

                        {
                            appliedFilter && (
                                <div className="filter-controls">
                                    <Button variant="outline-secondary" onClick={handleClearFilters}>
                                        Clear Filters
                                    </Button>
                                </div>
                            )
                        }
                    </div>
                    <div className="row">
                        {Jobs.status === 'loading' && !loadingMore ? ( // Show spinner only during initial load
                            <div className="d-flex align-items-center justify-content-center" role="status">
                                <InfinitySpin
                                    visible={true}
                                    width="400"
                                    color="#30A9E2"
                                    ariaLabel="infinity-spin-loading"
                                />
                            </div>
                        ) : Jobs.status === 'failed' ? ( // Show error image
                            <div className="d-flex align-items-center justify-content-center">
                                <img className="" style={{ maxWidth: '200px', maxHeight: '200px' }} src={connectionError} alt="Data not found" />
                            </div>
                        ) : Jobs.data.length === 0 ? ( // Show not found image if data is empty after loading
                            <div className="d-flex align-items-center justify-content-center">
                                <img className="" style={{ maxWidth: '200px', maxHeight: '200px' }} src={notFoundImage} alt="Data not found" />
                            </div>
                        ) : (
                            Jobs.data.data.map((job) => (
                                <div className="col-sm-4" key={job._id}>
                                    <Link to={`/job-details/${job?.job_title_slug}`}>
                                        <JobCards jobs={job} />
                                    </Link>
                                </div>
                            ))
                        )}
                        {/* Adding pagination with dynamic page name */}
                        {(hasMoreJobs || loadingMore) && (
                            <div className="pagination">
                                <button
                                    className="page-button"
                                    onClick={handleViewMore}
                                    disabled={loadingMore} // Disable button while loading more
                                >
                                    {loadingMore ? (
                                        <div className="d-flex align-items-center">
                                            <span>Loading...</span>
                                        </div>
                                    ) : (
                                        "View More"
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Job_listing;
