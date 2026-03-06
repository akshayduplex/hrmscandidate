import React, { useState } from 'react';

const VerticalTabs = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabClick = (index) => {
        setActiveTab(index);
    };

    return (
        <div className="row vertical-tabs">
            <div className="col-sm-4">
                <div className="tab-list sidejob_cards">
                    {tabs.map((tab, index) => (
                        <div
                            key={index}
                            className={`tab ${index === activeTab ? 'active' : ''}`}
                            onClick={() => handleTabClick(index)}
                        >
                            {tab.title}
                        </div>
                    ))}
                </div>
            </div>
            <div className="col-sm-8">
                <div className="tab-content detailsbox">
                    {tabs[activeTab].content}
                </div>
            </div>
        </div>
    );
};

export default VerticalTabs;
