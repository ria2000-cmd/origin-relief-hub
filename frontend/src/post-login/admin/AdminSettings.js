import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    TextField,
    Button,
    Switch,
    FormControlLabel,
    Divider,
    MenuItem,
    Alert,
    Snackbar,
    InputAdornment,
    Tabs,
    Tab
} from '@mui/material';
import {
    Settings,
    Shield,
    Mail,
    Globe,
    Database,
    Bell,
    Save,
    Lock,
    Server
} from 'lucide-react';

const AdminSettings = () => {
    const [currentTab, setCurrentTab] = useState(0);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // System Settings
    const [systemSettings, setSystemSettings] = useState({
        siteName: 'Relief Hub',
        siteUrl: 'https://reliefhub.co.za',
        maintenanceMode: false,
        registrationEnabled: true,
        maxLoginAttempts: 5,
        sessionTimeout: 30,
        timezone: 'Africa/Johannesburg',
        language: 'en'
    });

    // Security Settings
    const [securitySettings, setSecuritySettings] = useState({
        twoFactorAuth: true,
        passwordExpiry: 90,
        minPasswordLength: 8,
        requireSpecialChar: true,
        requireNumbers: true,
        requireUppercase: true,
        ipWhitelist: '',
        maxConcurrentSessions: 3
    });

    // Email Settings
    const [emailSettings, setEmailSettings] = useState({
        smtpHost: 'smtp.gmail.com',
        smtpPort: 587,
        smtpUsername: 'noreply@reliefhub.co.za',
        smtpPassword: '',
        fromEmail: 'noreply@reliefhub.co.za',
        fromName: 'Relief Hub',
        enableEmailNotifications: true
    });

    // Notification Settings
    const [notificationSettings, setNotificationSettings] = useState({
        emailOnNewUser: true,
        emailOnPayment: true,
        emailOnError: true,
        smsNotifications: false,
        pushNotifications: true,
        dailyReports: true,
        weeklyReports: false
    });

    // Database Settings
    const [databaseSettings, setDatabaseSettings] = useState({
        autoBackup: true,
        backupFrequency: 'daily',
        retentionDays: 30,
        lastBackup: '2025-10-17 22:00:00'
    });

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    const handleSystemSettingsChange = (field) => (event) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        setSystemSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleSecuritySettingsChange = (field) => (event) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        setSecuritySettings(prev => ({ ...prev, [field]: value }));
    };

    const handleEmailSettingsChange = (field) => (event) => {
        setEmailSettings(prev => ({ ...prev, [field]: event.target.value }));
    };

    const handleNotificationSettingsChange = (field) => (event) => {
        setNotificationSettings(prev => ({ ...prev, [field]: event.target.checked }));
    };

    const handleDatabaseSettingsChange = (field) => (event) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        setDatabaseSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveSettings = (settingsType) => {
        // Simulate API call
        setTimeout(() => {
            setSnackbar({
                open: true,
                message: `${settingsType} settings saved successfully!`,
                severity: 'success'
            });
        }, 500);
    };

    const handleRunBackup = () => {
        setSnackbar({
            open: true,
            message: 'Database backup initiated. You will be notified when complete.',
            severity: 'info'
        });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const SettingSection = ({ title, icon, children }) => (
        <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                {icon}
                <Typography variant="h6" fontWeight="600">
                    {title}
                </Typography>
            </Box>
            {children}
        </Paper>
    );

    return (
        <Box sx={{ p: 3, mt: { xs: 8, md: 0 }, minHeight: '100vh', bgcolor: '#f8fafc' }}>
            {/* Header */}
            <Typography variant="h4" fontWeight="bold" sx={{ color: '#facc15', mb: 1 }}>
                Admin Settings
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Configure system settings and preferences
            </Typography>

            {/* Tabs */}
            <Paper sx={{ mb: 3, borderRadius: 3 }}>
                <Tabs
                    value={currentTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        '& .MuiTab-root': { textTransform: 'none', fontWeight: 500 },
                        '& .Mui-selected': { color: '#facc15' },
                        '& .MuiTabs-indicator': { bgcolor: '#facc15' }
                    }}
                >
                    <Tab label="System" icon={<Settings size={18} />} iconPosition="start" />
                    <Tab label="Security" icon={<Shield size={18} />} iconPosition="start" />
                    <Tab label="Email" icon={<Mail size={18} />} iconPosition="start" />
                    <Tab label="Notifications" icon={<Bell size={18} />} iconPosition="start" />
                    <Tab label="Database" icon={<Database size={18} />} iconPosition="start" />
                </Tabs>
            </Paper>

            {/* System Settings Tab */}
            {currentTab === 0 && (
                <SettingSection title="System Configuration" icon={<Settings size={24} color="#facc15" />}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Site Name"
                                value={systemSettings.siteName}
                                onChange={handleSystemSettingsChange('siteName')}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Site URL"
                                value={systemSettings.siteUrl}
                                onChange={handleSystemSettingsChange('siteUrl')}
                                InputProps={{
                                    startAdornment: <Globe size={18} style={{ marginRight: 8 }} />
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                select
                                label="Timezone"
                                value={systemSettings.timezone}
                                onChange={handleSystemSettingsChange('timezone')}
                            >
                                <MenuItem value="Africa/Johannesburg">Africa/Johannesburg (SAST)</MenuItem>
                                <MenuItem value="UTC">UTC</MenuItem>
                                <MenuItem value="America/New_York">America/New_York (EST)</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                select
                                label="Default Language"
                                value={systemSettings.language}
                                onChange={handleSystemSettingsChange('language')}
                            >
                                <MenuItem value="en">English</MenuItem>
                                <MenuItem value="af">Afrikaans</MenuItem>
                                <MenuItem value="zu">Zulu</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Max Login Attempts"
                                value={systemSettings.maxLoginAttempts}
                                onChange={handleSystemSettingsChange('maxLoginAttempts')}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Session Timeout (minutes)"
                                value={systemSettings.sessionTimeout}
                                onChange={handleSystemSettingsChange('sessionTimeout')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={systemSettings.maintenanceMode}
                                        onChange={handleSystemSettingsChange('maintenanceMode')}
                                    />
                                }
                                label="Maintenance Mode (Temporarily disable user access)"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={systemSettings.registrationEnabled}
                                        onChange={handleSystemSettingsChange('registrationEnabled')}
                                    />
                                }
                                label="Enable User Registration"
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            startIcon={<Save size={18} />}
                            onClick={() => handleSaveSettings('System')}
                            sx={{
                                bgcolor: '#facc15',
                                color: '#1e3a8a',
                                textTransform: 'none',
                                '&:hover': { bgcolor: '#eab308' }
                            }}
                        >
                            Save System Settings
                        </Button>
                    </Box>
                </SettingSection>
            )}

            {/* Security Settings Tab */}
            {currentTab === 1 && (
                <SettingSection title="Security Configuration" icon={<Shield size={24} color="#10b981" />}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Password Policy
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Minimum Password Length"
                                value={securitySettings.minPasswordLength}
                                onChange={handleSecuritySettingsChange('minPasswordLength')}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Password Expiry (days)"
                                value={securitySettings.passwordExpiry}
                                onChange={handleSecuritySettingsChange('passwordExpiry')}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={securitySettings.requireSpecialChar}
                                        onChange={handleSecuritySettingsChange('requireSpecialChar')}
                                    />
                                }
                                label="Require Special Characters"
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={securitySettings.requireNumbers}
                                        onChange={handleSecuritySettingsChange('requireNumbers')}
                                    />
                                }
                                label="Require Numbers"
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={securitySettings.requireUppercase}
                                        onChange={handleSecuritySettingsChange('requireUppercase')}
                                    />
                                }
                                label="Require Uppercase"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                                Authentication
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={securitySettings.twoFactorAuth}
                                        onChange={handleSecuritySettingsChange('twoFactorAuth')}
                                    />
                                }
                                label="Enable Two-Factor Authentication"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Max Concurrent Sessions"
                                value={securitySettings.maxConcurrentSessions}
                                onChange={handleSecuritySettingsChange('maxConcurrentSessions')}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="IP Whitelist (comma-separated)"
                                value={securitySettings.ipWhitelist}
                                onChange={handleSecuritySettingsChange('ipWhitelist')}
                                placeholder="192.168.1.1, 10.0.0.1"
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            startIcon={<Save size={18} />}
                            onClick={() => handleSaveSettings('Security')}
                            sx={{
                                bgcolor: '#10b981',
                                color: 'white',
                                textTransform: 'none',
                                '&:hover': { bgcolor: '#059669' }
                            }}
                        >
                            Save Security Settings
                        </Button>
                    </Box>
                </SettingSection>
            )}

            {/* Email Settings Tab */}
            {currentTab === 2 && (
                <SettingSection title="Email Configuration" icon={<Mail size={24} color="#3b82f6" />}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="SMTP Host"
                                value={emailSettings.smtpHost}
                                onChange={handleEmailSettingsChange('smtpHost')}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="SMTP Port"
                                value={emailSettings.smtpPort}
                                onChange={handleEmailSettingsChange('smtpPort')}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="SMTP Username"
                                value={emailSettings.smtpUsername}
                                onChange={handleEmailSettingsChange('smtpUsername')}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="password"
                                label="SMTP Password"
                                value={emailSettings.smtpPassword}
                                onChange={handleEmailSettingsChange('smtpPassword')}
                                InputProps={{
                                    startAdornment: <Lock size={18} style={{ marginRight: 8 }} />
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="From Email"
                                value={emailSettings.fromEmail}
                                onChange={handleEmailSettingsChange('fromEmail')}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="From Name"
                                value={emailSettings.fromName}
                                onChange={handleEmailSettingsChange('fromName')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={emailSettings.enableEmailNotifications}
                                        onChange={handleEmailSettingsChange('enableEmailNotifications')}
                                    />
                                }
                                label="Enable Email Notifications"
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                            variant="outlined"
                            sx={{ textTransform: 'none' }}
                        >
                            Test Email
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<Save size={18} />}
                            onClick={() => handleSaveSettings('Email')}
                            sx={{
                                bgcolor: '#3b82f6',
                                textTransform: 'none',
                                '&:hover': { bgcolor: '#2563eb' }
                            }}
                        >
                            Save Email Settings
                        </Button>
                    </Box>
                </SettingSection>
            )}

            {/* Notifications Tab */}
            {currentTab === 3 && (
                <SettingSection title="Notification Preferences" icon={<Bell size={24} color="#f59e0b" />}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Admin Notifications
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={notificationSettings.emailOnNewUser}
                                        onChange={handleNotificationSettingsChange('emailOnNewUser')}
                                    />
                                }
                                label="Email on New User Registration"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={notificationSettings.emailOnPayment}
                                        onChange={handleNotificationSettingsChange('emailOnPayment')}
                                    />
                                }
                                label="Email on Payment Processing"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={notificationSettings.emailOnError}
                                        onChange={handleNotificationSettingsChange('emailOnError')}
                                    />
                                }
                                label="Email on System Errors"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={notificationSettings.smsNotifications}
                                        onChange={handleNotificationSettingsChange('smsNotifications')}
                                    />
                                }
                                label="SMS Notifications"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                                Reports
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={notificationSettings.dailyReports}
                                        onChange={handleNotificationSettingsChange('dailyReports')}
                                    />
                                }
                                label="Daily Activity Reports"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={notificationSettings.weeklyReports}
                                        onChange={handleNotificationSettingsChange('weeklyReports')}
                                    />
                                }
                                label="Weekly Summary Reports"
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            startIcon={<Save size={18} />}
                            onClick={() => handleSaveSettings('Notification')}
                            sx={{
                                bgcolor: '#f59e0b',
                                textTransform: 'none',
                                '&:hover': { bgcolor: '#d97706' }
                            }}
                        >
                            Save Notification Settings
                        </Button>
                    </Box>
                </SettingSection>
            )}

            {/* Database Tab */}
            {currentTab === 4 && (
                <SettingSection title="Database Management" icon={<Database size={24} color="#8b5cf6" />}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Alert severity="info" sx={{ mb: 2 }}>
                                Last backup: {databaseSettings.lastBackup}
                            </Alert>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={databaseSettings.autoBackup}
                                        onChange={handleDatabaseSettingsChange('autoBackup')}
                                    />
                                }
                                label="Enable Automatic Backups"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                select
                                label="Backup Frequency"
                                value={databaseSettings.backupFrequency}
                                onChange={handleDatabaseSettingsChange('backupFrequency')}
                                disabled={!databaseSettings.autoBackup}
                            >
                                <MenuItem value="hourly">Hourly</MenuItem>
                                <MenuItem value="daily">Daily</MenuItem>
                                <MenuItem value="weekly">Weekly</MenuItem>
                                <MenuItem value="monthly">Monthly</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Retention Period (days)"
                                value={databaseSettings.retentionDays}
                                onChange={handleDatabaseSettingsChange('retentionDays')}
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                            variant="outlined"
                            startIcon={<Server size={18} />}
                            onClick={handleRunBackup}
                            sx={{ textTransform: 'none' }}
                        >
                            Run Backup Now
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<Save size={18} />}
                            onClick={() => handleSaveSettings('Database')}
                            sx={{
                                bgcolor: '#8b5cf6',
                                textTransform: 'none',
                                '&:hover': { bgcolor: '#7c3aed' }
                            }}
                        >
                            Save Database Settings
                        </Button>
                    </Box>
                </SettingSection>
            )}

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AdminSettings;
