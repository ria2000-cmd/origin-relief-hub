import React from "react";
import { X, Mail, Phone, Map } from "lucide-react";
import {
    Box,
    Button,
    FormControl,
    TextField,
    Typography,
    IconButton,
    Grid,
} from "@mui/material";

const ContactForm = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <Box
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
            <Box
                className="bg-white rounded-lg p-6 w-full max-w-lg"
                sx={{ boxShadow: 6 }}
            >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h5" fontWeight="bold" color="text.primary">
                        Contact Us
                    </Typography>
                    <IconButton onClick={onClose} color="default">
                        <X size={24} />
                    </IconButton>
                </Box>

                {/* Grid Layout */}
                <Grid container spacing={4}>
                    {/* Contact Info */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" fontWeight="600" mb={2}>
                            Get in Touch
                        </Typography>
                        <Box display="flex" flexDirection="column" gap={2}>
                            <Box display="flex" alignItems="center" gap={1.5}>
                                <Phone size={20} className="text-blue-600" />
                                <Typography color="text.secondary">1-800-RELIEF-1</Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1.5}>
                                <Mail size={20} className="text-blue-600" />
                                <Typography color="text.secondary">support@reliefhub.com</Typography>
                            </Box>
                            <Box display="flex" alignItems="flex-start" gap={1.5}>
                                <Map size={20} className="text-blue-600" />
                                <Box>
                                    <Typography color="text.secondary">Relief Hub HQ</Typography>
                                    <Typography color="text.secondary">Financial District</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Message Form */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" fontWeight="600" mb={2}>
                            Send Message
                        </Typography>
                        <Box component="form" display="flex" flexDirection="column" gap={2}>
                            <FormControl fullWidth>
                                <TextField label="Your Name" variant="outlined" size="small" />
                            </FormControl>
                            <FormControl fullWidth>
                                <TextField label="Your Email" type="email" variant="outlined" size="small" />
                            </FormControl>
                            <FormControl fullWidth>
                                <TextField
                                    label="Your Message"
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                    size="small"
                                />
                            </FormControl>
                            <Button
                                variant="gold"
                                fullWidth
                            >
                                Send Message
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default ContactForm;
