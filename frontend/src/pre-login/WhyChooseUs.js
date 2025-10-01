import React from "react";
import { Box, Container, Typography, Paper } from "@mui/material";
import { LayoutDashboard, CreditCard, ArrowRightLeft} from "lucide-react";

const features = [
    {
        icon: <LayoutDashboard size={32} className="text-yellow-600" />,
        title: "Dashboard",
        desc: "View your grant status, payment history, and account overview in one convenient location",
    },
    {
        icon: <CreditCard size={32} className="text-blue-600" />,
        title: "Payment",
        desc: "Make secure payments, schedule transfers and manage your financial transactions",
    },
    {
        icon: <ArrowRightLeft size={32} className="text-yellow-600" />,
        title: "Transfer",
        desc: "Send money to family members, pay bills or transfer funds between accounts ",
    },
];

const WhyChoose = () => {
    return (
        <Box py={12} bgcolor="grey.50">
            <Container>
                <Box textAlign="center" mb={8}>
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        gutterBottom
                        color="primary.main"
                    >
                        Why Choose Relief Hub?
                    </Typography>
                    <Typography variant="h6" color="text.secondary" maxWidth="600px" mx="auto">
                        A comprehensive financial assistance platform designed to support your needs
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        gap: { xs: 3, md: 4 },
                        justifyContent: 'center',
                        alignItems: 'stretch',
                        flexDirection: { xs: 'column', md: 'row' },
                        flexWrap: 'nowrap',
                        maxWidth: { xs: '400px', md: '100%' },
                        mx: 'auto',
                        '& > *': {
                            flex: { xs: 'none', md: '1 1 0' }
                        }
                    }}
                >
                    {features.map((f, i) => (
                        <Paper
                            key={i}
                            elevation={4}
                            sx={{
                                p: { xs: 3, md: 4 },
                                textAlign: "center",
                                borderRadius: 3,
                                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                "&:hover": {
                                    transform: "translateY(-8px)",
                                    boxShadow: 8,
                                },
                                minWidth: 0,
                            }}
                        >
                            <Box
                                sx={{
                                    width: { xs: 60, md: 70 },
                                    height: { xs: 60, md: 70 },
                                    borderRadius: "50%",
                                    mx: "auto",
                                    mb: { xs: 2, md: 3 },
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    bgcolor: i % 2 === 0 ? "secondary.light" : "primary.light",
                                    '& svg': {
                                        width: { xs: 28, md: 32 },
                                        height: { xs: 28, md: 32 }
                                    }
                                }}
                            >
                                {f.icon}
                            </Box>
                            <Typography
                                variant="h6"
                                fontWeight="600"
                                mb={1}
                                color="text.primary"
                                sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}
                            >
                                {f.title}
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                {f.desc}
                            </Typography>
                        </Paper>
                    ))}
                </Box>
            </Container>
        </Box>
    );
};

export default WhyChoose;