import React from 'react';
import { Paper, Typography, Grid, Card, CardContent, CardActionArea, Box } from '@mui/material';
import {
    AccountBalance,
    LocalAtm,
    Description,
    Phone,
    Help,
    AssignmentTurnedIn,
    LocationOn,
    Article
} from '@mui/icons-material';

const QuickLinks = () => {
    const links = [
        {
            title: 'SASSA Main Portal',
            description: 'Official SASSA website and services',
            url: 'https://www.sassa.gov.za',
            icon: <AccountBalance fontSize="large" color="primary" />
        },
        {
            title: 'SRD Grant Status',
            description: 'Check your R370 SRD grant application status',
            url: 'https://srd.sassa.gov.za',
            icon: <LocalAtm fontSize="large" color="success" />
        },
        {
            title: 'Apply for SRD Grant',
            description: 'Apply for Social Relief of Distress grant',
            url: 'https://srd.sassa.gov.za/sc19/apply',
            icon: <AssignmentTurnedIn fontSize="large" color="primary" />
        },
        {
            title: 'Grant Payment Dates',
            description: 'View SASSA payment schedule',
            url: 'https://www.sassa.gov.za/payment-dates',
            icon: <Article fontSize="large" color="info" />
        },
        {
            title: 'Find SASSA Office',
            description: 'Locate your nearest SASSA office',
            url: 'https://www.sassa.gov.za/Pages/Regions.aspx',
            icon: <LocationOn fontSize="large" color="error" />
        },
        {
            title: 'SASSA Contact Centre',
            description: 'Get help and support from SASSA',
            url: 'https://www.sassa.gov.za/Pages/Contact-Us.aspx',
            icon: <Phone fontSize="large" color="warning" />
        },
        {
            title: 'Grant Types & Eligibility',
            description: 'Learn about available grants',
            url: 'https://www.sassa.gov.za/Pages/Services.aspx',
            icon: <Help fontSize="large" color="secondary" />
        },
        {
            title: 'Appeal SRD Decision',
            description: 'Appeal if your SRD application was declined',
            url: 'https://srd.sassa.gov.za/appeals',
            icon: <Description fontSize="large" color="primary" />
        }
    ];

    const handleLinkClick = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                Quick Links
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Access SASSA services and relief resources
            </Typography>

            <Grid container spacing={2}>
                {links.map((link, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card
                            sx={{
                                height: '100%',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4
                                }
                            }}
                        >
                            <CardActionArea
                                onClick={() => handleLinkClick(link.url)}
                                sx={{ height: '100%', p: 2 }}
                            >
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        {link.icon}
                                        <Typography
                                            variant="h6"
                                            component="div"
                                            sx={{ ml: 1, fontSize: '1rem' }}
                                        >
                                            {link.title}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        {link.description}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ mt: 3, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    SASSA Contact Information:
                </Typography>
                <Typography variant="body2">
                    📞 Toll-Free: 0800 60 10 11 | 📧 Email: grantsenquiries@sassa.gov.za
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                    💬 WhatsApp: 082 046 8553 | ⏰ Operating Hours: 08:00 - 16:00 (Mon-Fri)
                </Typography>
            </Box>

            <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                    ⚠️ <strong>Important:</strong> Never share your PIN, OTP, or banking details with anyone.
                    SASSA will never ask for payment to process your grant application.
                </Typography>
            </Box>
        </Paper>
    );
};

export default QuickLinks;