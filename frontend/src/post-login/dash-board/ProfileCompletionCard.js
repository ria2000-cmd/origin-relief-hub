import React from 'react';
import {
    Paper,
    Box,
    Typography,
    LinearProgress
} from '@mui/material';

const ProfileCompletionCard = () => {
    return (
        <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                Profile Completion
            </Typography>
            <Box sx={{ mt: 2 }}>
                <LinearProgress
                    variant="determinate"
                    value={52}
                    sx={{
                        height: 8,
                        borderRadius: 4,
                        '& .MuiLinearProgress-bar': {
                            bgcolor: '#facc15',
                            borderRadius: 4,
                        },
                        bgcolor: '#e2e8f0'
                    }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    52% Complete
                </Typography>
            </Box>
        </Paper>
    );
};

export default ProfileCompletionCard;