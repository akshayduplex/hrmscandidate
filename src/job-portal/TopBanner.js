import React, { forwardRef, useImperativeHandle } from "react";
import JobSearchForm from "./JobSearchForm/JobSearchForm";
import { useSelector } from "react-redux";



const TopBanner = forwardRef((props, ref) => {
    const webSetting = useSelector(state => state.jobs.webSettingData);
    const [clearForm, setClearForm] = React.useState(false);

    useImperativeHandle(ref, () => ({
        clearForm: () => setClearForm(true)
    }));

    React.useEffect(() => {
        if (clearForm) {
            setClearForm(false);
        }
    }, [clearForm]);

    return (
        <>
            <div className="container-fluid topbanner">
                <div className="container">
                    <div className="jobbanner">
                        <h4>Find Job on {webSetting.status === 'succeeded' && webSetting?.data?.organization_name} </h4>
                        <p className="my-4">Search Jobs opening for which we are hiring right now.</p>
                        <JobSearchForm clearForm={clearForm} />
                    </div>
                </div>
            </div>
        </>
    )
});

export default TopBanner;