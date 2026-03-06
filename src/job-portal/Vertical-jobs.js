import React, { useEffect, useState, useRef } from 'react';
import config from '../Config/Config';

const VerticalTabs = ({ tabs, selectedIndexValue }) => {
    const [activeTab, setActiveTab] = useState(0);
    const tabRefs = useRef([]);

    const handleTabClick = (index) => {
        setActiveTab(index);
    };

    useEffect(() => {
        if (selectedIndexValue !== undefined && selectedIndexValue !== null) {
            setActiveTab(selectedIndexValue);
        }
    }, [selectedIndexValue]);

    useEffect(() => {
        if (tabRefs.current[activeTab]) {
            tabRefs.current[activeTab].scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    }, [activeTab]);

    return (
        <div className="row vertical-tabs">

            {
                config.duplex_build === 'yes' && (
                    <div className="col-sm-4">
                        <div className="tab-list sidejob_cards">
                            {tabs.map((tab, index) => (
                                <div
                                    key={index}
                                    ref={(el) => (tabRefs.current[index] = el)}
                                    className={`tab ${index === activeTab ? 'active' : ''}`}
                                    onClick={() => handleTabClick(index)}
                                >
                                    {tab.title}
                                </div>
                            ))}
                        </div>
                    </div>
                )
            }
            <div className={`${config.duplex_build === 'yes' ? 'col-sm-8' : 'col-sm-12'}`}>
                <div className="tab-content detailsbox">
                    {tabs[activeTab].content}
                </div>
            </div>
        </div>
    );
};

export default VerticalTabs;
