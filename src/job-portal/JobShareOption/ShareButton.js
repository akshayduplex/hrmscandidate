

import React, { useMemo } from 'react';
import { Dropdown, ButtonGroup } from 'react-bootstrap';
import { IoShareSocialOutline, IoCopyOutline } from 'react-icons/io5';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    FacebookShareButton,
    TwitterShareButton,
    LinkedinShareButton,
    WhatsappShareButton,
} from 'react-share';
import './ShareButton.css';
import config from '../../Config/Config';
import { useSelector } from 'react-redux';

const ShareButton = (props) => {
    const { job_title, description, job_title_slug } = props.Job_description;
    const webSetting = useSelector(state => state.jobs.webSettingData);


    const removeHTMLTags = (str) => {
        const doc = new DOMParser().parseFromString(str, 'text/html');
        return doc.body.textContent || "";
    };

    const truncateDescription = (text, wordLimit) => {
        const words = text.split(' ');
        if (words.length > wordLimit) {
            return words.slice(0, wordLimit).join(' ') + '...';
        }
        return text;
    };


    let icons = useMemo(() => {
        return webSetting && webSetting?.data?.logo_image
    }, [webSetting])

    const jobImage = `${config.IMAGE_PATH}${icons}`;


    const plainTextDescription = removeHTMLTags(description);
    const truncatedDescription = truncateDescription(plainTextDescription, 10);
    // const baseUrl = `${config.FRONT_URL}job-details/${job_title_slug}?title=${job_title}&description=${truncatedDescription}`;
    const baseUrl = `${config.FRONT_URL}job-details/${job_title_slug}`;
    const title = `Job Title: ${job_title}\n Description: ${truncatedDescription}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(baseUrl)
            .then(() => {
                toast.info('Link copied to clipboard!', {
                    position: "top-right",
                    theme: "dark"
                });
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    };

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                theme="dark"
            />
            <Dropdown as={ButtonGroup}>
                <Dropdown.Toggle className="share">
                    <IoShareSocialOutline />
                </Dropdown.Toggle>

                <Dropdown.Menu className="dropdown-menu-center">
                    <Dropdown.Item onClick={handleCopy} className="dropdown-item-center">
                        <IoCopyOutline /> Copy Link
                    </Dropdown.Item>
                    <Dropdown.Divider />

                    <Dropdown.Item as="div" className="dropdown-item-center">
                        <FacebookShareButton url={baseUrl} quote={title} image={jobImage} className="dropdown-item-center">
                            <FaFacebookF /> Facebook
                        </FacebookShareButton>
                    </Dropdown.Item>
                    <Dropdown.Divider />

                    <Dropdown.Item as="div" className="dropdown-item-center">
                        <TwitterShareButton url={baseUrl} title={title} image={jobImage} className="dropdown-item-center">
                            <FaTwitter /> Twitter
                        </TwitterShareButton>
                    </Dropdown.Item>
                    <Dropdown.Divider />

                    <Dropdown.Item as="div" className="dropdown-item-center">
                        <LinkedinShareButton url={baseUrl} title={title} image={jobImage} className="dropdown-item-center">
                            <FaLinkedinIn /> LinkedIn
                        </LinkedinShareButton>
                    </Dropdown.Item>
                    <Dropdown.Divider />

                    <Dropdown.Item as="div" className="dropdown-item-center">
                        <WhatsappShareButton url={baseUrl} title={title} image={jobImage} className="dropdown-item-center">
                            <FaWhatsapp /> WhatsApp
                        </WhatsappShareButton>
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </>
    );
};

export default ShareButton;




