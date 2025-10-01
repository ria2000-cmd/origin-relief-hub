import React from 'react';
import {
    Card,
    CardContent,
    Box,
    Typography
} from '@mui/material';

const DashboardCard = ({ title, icon, children }) => {
    return (
        <Card sx={{
            borderRadius: 3,
            boxShadow: 2,
            transition: 'all 0.2s ease',
            '&:hover': {
                boxShadow: 4,
                transform: 'translateY(-2px)'
            }
        }}>
            <CardContent sx={{ p: 3 }}>
                {/* Card Header with Icon */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: '#fef3c7',
                        color: '#d97706',
                        mr: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {icon}
                    </Box>
                    <Typography variant="h6" fontWeight="600">
                        {title}
                    </Typography>
                </Box>

                {/* Card Content */}
                {children}
            </CardContent>
        </Card>
    );
};

export default DashboardCard;