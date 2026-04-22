import { useNavigate } from 'react-router-dom';
import { Card, Typography, Grid, CardActionArea, Box } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';

const JoiningKit = () => {
    const navigate = useNavigate();

    const joiningKitTabs = [
        { title: "Anexure", doc: "ANNUXURE 11 JOINING FORM" },
        { title: "SB Format", doc: "SB_FORMAT" },
        { title: "GPA", doc: "GMC" },
        { title: "Reference Testimonial", doc: "reference_testimonial" },
        { title: "ID Card", doc: "ID card format HLFPPT" },
        { title: "Insurance", doc: "insurance" }
    ];

    const DashboardCard = ({ title, path }) => (
        <Grid item xs={12} sm={6} md={4}>
            <Card
                data-aos="fade-up"
                sx={{
                    height: '100%',
                    transition: '0.3s',
                    '&:hover': { transform: 'scale(1.02)' }
                }}
            >
                <CardActionArea
                    onClick={() => navigate(path)}
                    sx={{ height: '100%', p: 2 }}
                >
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center'
                    }}>
                        <WorkIcon sx={{ fontSize: 40, color: '#1976d2', mb: 2 }} />
                        <Typography variant="h6" fontWeight="bold">
                            {title}
                        </Typography>
                    </Box>
                </CardActionArea>
            </Card>
        </Grid>
    );

    return (
        <div className="maincontent" style={{ padding: '20px' }}>
            <div className="container">
                <Grid container spacing={3}>
                    {joiningKitTabs.map((tab, index) => (
                        <DashboardCard
                            key={index}
                            title={tab.title}
                            path={`/approval-documents?doc_name=${tab.doc}`}
                        />
                    ))}
                </Grid>

            </div>
        </div>
    );
};

export default JoiningKit;
