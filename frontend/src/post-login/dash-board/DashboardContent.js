import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Button,
    Alert
} from '@mui/material';
import {
    Calendar,
    Activity,
    AlertCircle,
    MessageCircle,
    Phone,
    Bell
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DashboardCard from './DashboardCard';
import ProfileCompletionCard from './ProfileCompletionCard';
import ChatbotModal from '../../chatbot/ChatbotModal';
import CallCenterModal from '../../call-center/CallCenterModal';

const DashboardContent = ({ user, logout }) => {
    const { t } = useTranslation();
    const [chatbotOpen, setChatbotOpen] = useState(false);
    const [callCenterOpen, setCallCenterOpen] = useState(false);

    useEffect(() => {
        console.log('dashboard content', user);
    }, []);

    const handleOpenChatbot = () => {
        setChatbotOpen(true);
    };

    const handleCloseChatbot = () => {
        setChatbotOpen(false);
    };

    const handleOpenCallCenter = () => {
        setCallCenterOpen(true);
    };

    const handleCloseCallCenter = () => {
        setCallCenterOpen(false);
    };

    return (
        <Box
            sx={{
                p: 3,
                mt: { xs: 8, md: 0 },
                width: '100%',
                minHeight: '100vh',
                bgcolor: '#f8fafc'
            }}
        >
            {/* Welcome Header */}
            <Typography variant="h4" fontWeight="bold" sx={{ color: '#facc15', mb: 4 }}>
                {t('common.welcome')}, {user?.displayName || 'User'}!
            </Typography>

            {/* Profile Completion */}
            <ProfileCompletionCard />

            {/* Dashboard Cards Grid */}
            <Grid container spacing={3} sx={{ mb: 4 }}>

                {/* Next Payment Card */}
                <Grid item xs={12} md={6}>
                    <DashboardCard
                        title="Next Payment"
                        icon={<Calendar size={20} />}
                    >
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Your next payment is scheduled for 05 October 2025
                        </Typography>
                        <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>
                            R 480.00
                        </Typography>
                    </DashboardCard>
                </Grid>

                <Grid item xs={12} md={6}>
                    <DashboardCard
                        title="Recent Activity"
                        icon={<Activity size={20} />}
                    >
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Last withdrawal: R350 on 15 September 2025 via E-Number:
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>
                            EFT-234567890
                        </Typography>
                    </DashboardCard>
                </Grid>

                {/* Action Required Card */}
                <Grid item xs={12} md={6}>
                    <DashboardCard
                        title="Action Required"
                        icon={<AlertCircle size={20} />}
                    >
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Please verify your email address to complete your profile.
                        </Typography>
                        <Button
                            variant="gold"
                            sx={{ textTransform: 'none' }}
                        >
                            Verify Now
                        </Button>
                    </DashboardCard>
                </Grid>

                {/* Support Card */}
                <Grid item xs={12} md={6}>
                    <DashboardCard
                        title="Support"
                        icon={<MessageCircle size={20} />}
                    >
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Need help? Contact our AI chatbot or call center.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Button
                                variant="contained"
                                size="small"
                                startIcon={<MessageCircle size={16} />}
                                onClick={handleOpenChatbot}
                                sx={{
                                    bgcolor: '#10b981',
                                    '&:hover': { bgcolor: '#059669' },
                                    textTransform: 'none'
                                }}
                            >
                                Chat with AI
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<Phone size={16} />}
                                onClick={handleOpenCallCenter}
                                sx={{
                                    borderColor: 'primary.main',
                                    color: 'primary.main',
                                    textTransform: 'none'
                                }}
                            >
                                Call Center
                            </Button>
                        </Box>
                    </DashboardCard>
                </Grid>
            </Grid>

            <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
                Reminders
            </Typography>
            <Alert
                severity="warning"
                icon={<Bell size={20} />}
                sx={{
                    bgcolor: '#fefce8',
                    border: '1px solid #facc15',
                    borderRadius: 2,
                    '& .MuiAlert-icon': {
                        color: '#d97706'
                    },
                    '& .MuiAlert-message': {
                        width: '100%'
                    }
                }}
            >
                <Box>
                    <Typography variant="body2" sx={{ color: '#92400e', mb: 0.5 }}>
                        Your next grant collection date is approaching. Make sure to collect your grant within the specified period.
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#a16207' }}>
                        Due: 30 September 2025
                    </Typography>
                </Box>
            </Alert>

            {/* Modals */}
            <ChatbotModal open={chatbotOpen} onClose={handleCloseChatbot} />
            <CallCenterModal open={callCenterOpen} onClose={handleCloseCallCenter} />
        </Box>
    );
};

export default DashboardContent;