import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Typography,
    IconButton,
    Button,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider
} from '@mui/material';
import { X, Phone, Clock, MapPin, Mail } from 'lucide-react';

const CallCenterModal = ({ open, onClose }) => {
    const handleCall = (number) => {
        window.location.href = `tel:${number}`;
    };

    const contactOptions = [
        {
            title: 'SASSA Toll-Free Number',
            number: '0800 60 10 11',
            description: 'Available Monday - Friday, 8:00 AM - 4:00 PM',
            icon: <Phone size={24} />
        },
        {
            title: 'SMS Service',
            number: '32551',
            description: 'Send your ID number to check grant status',
            icon: <Mail size={24} />
        }
    ];

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: '#3b82f6',
                color: 'white'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Phone size={24} />
                    <Typography variant="h6">Contact Call Center</Typography>
                </Box>
                <IconButton onClick={onClose} sx={{ color: 'white' }}>
                    <X size={20} />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Get help from our support team. Choose your preferred contact method below.
                </Typography>

                <List sx={{ width: '100%' }}>
                    {contactOptions.map((option, index) => (
                        <React.Fragment key={index}>
                            <ListItem
                                sx={{
                                    border: '1px solid #e2e8f0',
                                    borderRadius: 2,
                                    mb: 2,
                                    p: 2,
                                    '&:hover': {
                                        bgcolor: '#f8fafc',
                                        cursor: 'pointer'
                                    }
                                }}
                                onClick={() => handleCall(option.number)}
                            >
                                <ListItemIcon sx={{ color: '#3b82f6' }}>
                                    {option.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            {option.title}
                                        </Typography>
                                    }
                                    secondary={
                                        <Box>
                                            <Typography
                                                variant="h6"
                                                sx={{ color: '#3b82f6', my: 0.5 }}
                                            >
                                                {option.number}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {option.description}
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </ListItem>
                        </React.Fragment>
                    ))}
                </List>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ bgcolor: '#f1f5f9', p: 2, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Clock size={20} color="#64748b" />
                        <Typography variant="subtitle2" fontWeight={600}>
                            Operating Hours
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        Monday - Friday: 8:00 AM - 4:00 PM
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Closed on weekends and public holidays
                    </Typography>
                </Box>

                <Box sx={{ bgcolor: '#fef3c7', p: 2, borderRadius: 2, mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <MapPin size={20} color="#d97706" />
                        <Typography variant="subtitle2" fontWeight={600}>
                            Visit a SASSA Office
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        You can also visit your nearest SASSA office for in-person assistance.
                        Remember to bring your ID and any relevant documents.
                    </Typography>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} variant="outlined">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CallCenterModal;