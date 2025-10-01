import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import RegisterForm from "./RegisterForm";
import ContactForm from "./ContactForm";
import LoginForm from "./LoginForm";
import logo from "../assets/img/logo.jpg";
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Button,
    Container,
    Grid,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
} from "@mui/material";
import WhyChoose from "./WhyChooseUs";

const LandingPage = ({ onLoginSuccess }) => {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [showContact, setShowContact] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleSwitchToRegister = () => {
        setShowLogin(false);
        setShowRegister(true);
    };

    const handleSwitchToLogin = () => {
        setShowRegister(false);
        setShowLogin(true);
    };

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "white" }}>
            {/* Header */}
            <AppBar position="sticky" color="inherit" elevation={1}>
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    {/* Logo */}
                    <Box display="flex" alignItems="center" gap={2}>
                        <img src={logo} alt="Relief Hub Logo" width={40} height={40} />
                        <Box>
                            <Typography variant="h6" fontWeight="bold" color="primary">
                                Relief Hub
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Financial Relief Solutions
                            </Typography>
                        </Box>
                    </Box>

                    {/* Desktop Nav */}
                    <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
                        <Button onClick={() => setShowLogin(true)} color="primary">
                            Login
                        </Button>
                        <Button
                            onClick={() => setShowRegister(true)}
                            variant="gold"
                        >
                            Register
                        </Button>
                        <Button onClick={() => setShowContact(true)} color="inherit">
                            Contact Us
                        </Button>
                    </Box>

                    {/* Mobile Menu Button */}
                    <IconButton
                        onClick={() => setMobileMenuOpen(true)}
                        sx={{ display: { xs: "block", md: "none" } }}
                    >
                        <Menu />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Mobile Drawer */}
            <Drawer
                anchor="right"
                open={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
            >
                <Box sx={{ width: 240, p: 2 }}>
                    <Box display="flex" justifyContent="flex-end">
                        <IconButton onClick={() => setMobileMenuOpen(false)}>
                            <X />
                        </IconButton>
                    </Box>
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => { setShowLogin(true); setMobileMenuOpen(false); }}>
                                Login
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => { setShowRegister(true); setMobileMenuOpen(false); }}>
                                Register
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => { setShowContact(true); setMobileMenuOpen(false); }}>
                                Contact Us
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>

            {/* Hero Section */}
            <Box
                sx={{
                    bgcolor: "primary.main",
                    color: "white",
                    py: { xs: 10, md: 16 },
                    textAlign: "center",
                }}
            >
                <Container maxWidth="md">
                    <Typography variant="h3" fontWeight="bold" gutterBottom>
                        Get Financial Relief Solutions
                    </Typography>
                    <Typography variant="h6" color="blue.100" mb={4}>
                       Your comprehensive SASSA grant management solution with AI-powered assistance
                    </Typography>
                    <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={2} justifyContent="center">
                        <Button variant="gold" size="large" onClick={() => setShowRegister(true)}>
                            Get Started
                        </Button>
                        <Button
                            size="large"
                            sx={{
                                border: "2px solid",
                                borderColor: "secondary.main",
                                color: "white",
                                "&:hover": { bgcolor: "secondary.main", color: "primary.main" },
                            }}
                            onClick={() => setShowLogin(true)}
                        >
                            Sign In
                        </Button>
                    </Box>
                </Container>
            </Box>
            <WhyChoose/>

            <Box py={12} bgcolor="primary.main" textAlign="center">
                <Container>
                    <Typography variant="h4" fontWeight="bold" color="white" gutterBottom>
                        Ready to Get Financial Relief?
                    </Typography>
                    <Typography variant="h6" color="gold" mb={4}>
                        Join thousands who have found financial assistance through our platform
                    </Typography>
                    <Button variant="gold" size="large" onClick={() => setShowRegister(true)}>
                        Create Your Account
                    </Button>
                </Container>
            </Box>

            {/* Footer */}
            <Box bgcolor="grey.900" color="grey.300" py={8}>
                <Container>
                    <Grid container spacing={6}>
                        <Grid item xs={12} md={4}>
                            <Box display="flex" alignItems="center" gap={2} mb={2}>
                                <Box
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        bgcolor: "grey.100",
                                        borderRadius: 1,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <img src={logo} alt="Relief Hub Logo" width={40} height={40} />
                                </Box>
                                <Typography variant="h6" color="primary">
                                    Relief Hub
                                </Typography>
                            </Box>
                            <Typography variant="body2">
                                Making financial assistance accessible and streamlined for everyone in need.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                                Quick Links
                            </Typography>
                            <Box display="flex" flexDirection="column" gap={1}>
                                <Button onClick={() => setShowLogin(true)} color="inherit">
                                    Login
                                </Button>
                                <Button onClick={() => setShowRegister(true)} color="inherit">
                                    Register
                                </Button>
                                <Button onClick={() => setShowContact(true)} color="inherit">
                                    Contact
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                                Contact Info
                            </Typography>
                            <Typography variant="body2">1-800-RELIEF-1</Typography>
                            <Typography variant="body2">support@reliefhub.com</Typography>
                            <Typography variant="body2">Financial District</Typography>
                        </Grid>
                    </Grid>
                    <Box mt={6} pt={4} borderTop="1px solid" borderColor="grey.800" textAlign="center">
                        <Typography variant="body2">&copy; 2025 Relief Hub. All rights reserved.</Typography>
                    </Box>
                </Container>
            </Box>

            <LoginForm
                onLoginSuccess={onLoginSuccess}
                isOpen={showLogin}
                onClose={() => setShowLogin(false)}
                onSwitchToRegister={handleSwitchToRegister}
            />
            <RegisterForm
                isOpen={showRegister}
                onClose={() => setShowRegister(false)}
                onSwitchToLogin={handleSwitchToLogin}
            />
            <ContactForm isOpen={showContact} onClose={() => setShowContact(false)} />
        </Box>
    );
};

export default LandingPage;
