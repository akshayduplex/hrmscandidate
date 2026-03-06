import React, { useEffect } from "react";
import { MdOutlinePhone } from "react-icons/md";
import { MdOutlineEmail } from "react-icons/md";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function JobFooter() {
    const webSetting = useSelector(state => state.jobs.webSettingData);

    useEffect(() => {
        const adjustFooter = () => {
            const rootElement = document.getElementById('root');
            const rootHeight = rootElement ? rootElement.offsetHeight : 0;
            const viewportHeight = window.innerHeight;
            const footer = document.querySelector('footer');

            if (footer) {
                if (rootHeight < viewportHeight) {
                    footer.style.position = 'relative';
                    footer.style.bottom = '0';
                    footer.style.width = '100%';
                } else {
                    footer.style.position = 'static';
                }
            }
        };

        adjustFooter();
        window.addEventListener('resize', adjustFooter);
        return () => {
            window.removeEventListener('resize', adjustFooter);
        };
    }, []);

    return (
        <>
            <footer>

                <div className="container">
                    <div className="jobfooter">
                        <ul>
                            {
                                webSetting.status === 'succeeded' && webSetting?.data?.organization_mobile_no &&

                                <li>
                                    <a href={`tel:${webSetting.status === 'succeeded' && webSetting?.data?.organization_mobile_no}`}> <MdOutlinePhone /> +91 {webSetting.status === 'succeeded' && webSetting?.data?.organization_mobile_no}</a>
                                </li>
                            }
                            {
                                webSetting.status === 'succeeded' && webSetting?.data?.organization_email_id &&
                                <li>
                                    <a href={`mailto:${webSetting.status === 'succeeded' && webSetting?.data?.organization_email_id}`}> <MdOutlineEmail /> {webSetting.status === 'succeeded' && webSetting?.data?.organization_email_id} </a>
                                </li>
                            }
                        </ul>
                        <ul>
                            <li>
                                <Link to={'/'}>Home</Link>
                            </li>
                            <li>
                                <Link to={`/privacy-policy`}>Privacy Policy</Link>
                            </li>
                            <li>
                                <Link to={`/terms-conditions`}>Terms & Conditions</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </footer>
        </>
    );
}
export default JobFooter; 