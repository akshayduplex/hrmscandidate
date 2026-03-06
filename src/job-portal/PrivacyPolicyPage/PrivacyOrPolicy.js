import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ConfigrationSetting, CMSPageSlug } from "../../Redux/Slices/JobListApi";
import { IoMdArrowRoundBack } from "react-icons/io";

import config from "../../Config/Config";
import { Helmet } from "react-helmet";


const PrivacyPolicy = () => {

    const [logo, setLogo] = useState('');
    const location = useLocation();
    const path = location.pathname;


    const dispatch = useDispatch()
    const webSetting = useSelector(state => state.jobs.webSettingData);
    const CmsPageData = useSelector(state => state.jobs.CmsPageSlug);

    useEffect(() => {
        dispatch(ConfigrationSetting({ domain: config.FRONT_URL }))
        let slug = ''
        if (path.includes('/privacy-policy')) {
            slug = 'privacy-policy'
        } else {
            slug = 'terms'
        }
        dispatch(CMSPageSlug({ page_slug: slug }))
    }, [dispatch, path])

    useEffect(() => {
        if (webSetting && webSetting?.data?.logo_image) {
            setLogo(webSetting?.data?.logo_image);
        }
    }, [webSetting]);

    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    console.log(CmsPageData, 'this is Cms Page Data');

    return (
        <>

            {/* using Helmet Here */}
            <Helmet>
                <title>{CmsPageData?.status === 'succeeded' && CmsPageData?.data?.meta_title}</title>
                <meta
                    name="keywords"
                    content={CmsPageData?.status === 'succeeded'
                        ? CmsPageData?.data?.meta_title || 'default, keywords, here'
                        : 'default, keywords, here'}
                />
                <meta name="title" content={CmsPageData?.status === 'succeeded'
                    ? CmsPageData?.data?.meta_title || 'default, keywords, here'
                    : 'default, keywords, here'} />
                <meta name="description" content={CmsPageData?.status === 'succeeded'
                    ? CmsPageData?.data?.meta_title || 'default, keywords, here'
                    : 'default, keywords, here'} />
            </Helmet>


            <div className="fullhdr">
                <div className="container dflexbtwn">
                    <div className=" topdashhdr d-flex align-items-center">
                        <div className="dashlogo">
                            <Link to={'/'}> {logo && <img src={config.IMAGE_PATH + logo} alt="logo" />} </Link>
                        </div>
                    </div>
                    <div className="">
                        <Link to={'/login'} className="sitebtn jobsearch bgblue" type="submit">
                            Login
                        </Link>
                    </div>
                </div>
            </div>

            {/* settal Header Data */}
            <div className="container-fluid topbanner">
                <div className="container gap-5">
                    <div
                        style={{
                            backgroundColor: ' #30a9e2', // Set the desired background color
                            padding: '10px', // Add some padding for better appearance
                            display: 'inline-block', // Make the div wrap tightly around the icon
                            borderRadius: '50%', // Optional: make it circular
                        }}
                        onClick={handleGoBack}
                    >
                        <IoMdArrowRoundBack style={{ color: '#fff', fontSize: '24px' }} />
                    </div>
                    <div
                        style={{
                            display: 'inline-block',
                            marginLeft: '2rem',
                            fontSize: '24px',
                            fontWeight: '300'
                        }}
                    >
                        <p><strong>{path?.includes('/privacy-policy') ? "Privacy Policy" : 'Terms And Conditions'} </strong></p>
                    </div>
                </div>
            </div>

            {/* Content Data to show the Privacy Policy result */}
            <div className="container">
                <div className="joblist_display mt-4">
                    <div className="row">
                        <div className="col-md-12">
                            <p dangerouslySetInnerHTML={{ __html: CmsPageData?.status === 'succeeded' ? CmsPageData?.data?.content_data : 'Loading....' }}>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PrivacyPolicy