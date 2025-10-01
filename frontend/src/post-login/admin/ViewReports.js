import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

const ViewReports = () => {
    return (
        <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Reports
            </Typography>
            <Typography variant="body2">
                Reports will show summary of user activities, payments, transfers, and other analytics.
            </Typography>
            {/* You can later integrate charts or tables here */}
        </Paper>
    );
};

export default ViewReports;
