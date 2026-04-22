import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Grid, CardActionArea, Box } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AOS from 'aos';
import { getCandidateById } from "../helper/Api_Helper";
import { getCandidateId, getSessionData } from "../helper/My_Helper";

const CandidatePanel = () => {
    const [candidateData, setCandidateData] = useState(null);
    const [candidateName, setCandidateName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCandidateData = async () => {
            try {
                const response = await getCandidateById({
                    _id: getCandidateId(),
                    scope_fields: ["onboarding_docs_stage"]
                });
                if (response && response.data) {
                    setCandidateData(response.data);
                }
            } catch (error) {
                console.error('Error fetching candidate data:', error);
            }
        };

        fetchCandidateData();
        const loginData = getSessionData('loginData') || { name: 'Guest' };
        setCandidateName(loginData.name);
        AOS.init({ duration: 800, once: true });
    }, []);
    const stage = candidateData?.onboarding_docs_stage;

    const canViewOfferLetter = stage === 'offerletter' || stage === 'complete';

    const canViewJoiningKit = stage === 'joiningkit' || stage === 'complete';


    // Reusable Card Component
    const DashboardCard = ({ title, icon: Icon, path, isLocked }) => (
        <Grid item xs={12} sm={6} md={4}>
            <Card
                data-aos="fade-up"
                sx={{
                    height: '100%',
                    position: 'relative',
                    transition: '0.3s',
                    '&:hover': { transform: isLocked ? 'none' : 'scale(1.02)' },
                    background: isLocked ? '#f5f5f5' : '#fff'
                }}
            >
                <CardActionArea
                    onClick={() => !isLocked && navigate(path)}
                    disabled={isLocked}
                    sx={{ height: '100%', p: 2 }}
                >
                    <Box sx={{
                        filter: isLocked ? 'blur(4px)' : 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center'
                    }}>
                        <Icon sx={{ fontSize: 40, color: isLocked ? 'gray' : '#1976d2', mb: 2 }} />
                        <Typography variant="h6" component="div" fontWeight="bold">
                            {title}
                        </Typography>
                    </Box>
                    {isLocked && (
                        <Box sx={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(255,255,255,0.3)',
                            zIndex: 1
                        }}>
                            {/* <Typography variant="caption" sx={{ color: '#d32f2f', fontWeight: 'bold', bgcolor: 'white', px: 1, borderRadius: 1 }}>
                                Available After Shortlisting
                            </Typography> */}
                        </Box>
                    )}
                </CardActionArea>
            </Card>
        </Grid>
    );

    return (
        <div className="maincontent" style={{ padding: '20px' }}>
            <div className="container">
                <Box mb={4} data-aos="fade-in">
                    <Typography variant="h5" gutterBottom fontWeight="bold">
                        Welcome, {candidateName}
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {/* Standard Pages */}
                    <DashboardCard title="Application Form" icon={DescriptionIcon} path="/application-form" />
                    <DashboardCard title="Uploded Documents" icon={DescriptionIcon} path="/your-document" />
                    <DashboardCard title="KYC Documents" icon={AccountCircleIcon} path="/upload-documents?doc=kyc" />
                    <DashboardCard title="Education Documents" icon={SchoolIcon} path="/upload-documents?doc=education" />
                    <DashboardCard title="Experience Documents" icon={WorkIcon} path="/upload-documents?doc=experience" />

                    {/* Restricted Pages  */}
                    <DashboardCard
                        title="Offer Letter"
                        icon={VerifiedUserIcon}
                        path="/approval-documents?status=offerletter"
                        isLocked={!canViewOfferLetter}
                    />
                    <DashboardCard
                        title="Joining Kit"
                        icon={DescriptionIcon}
                        path="/joining-kit"
                        isLocked={!canViewJoiningKit}
                    />
                </Grid>
            </div>
        </div>
    );
};

export default CandidatePanel;