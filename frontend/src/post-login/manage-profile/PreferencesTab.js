import React from 'react';
import {
    Box,
    Typography,
    Button,
    Grid,
    Switch,
    FormControlLabel,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    CircularProgress,
    Paper
} from '@mui/material';
import {
    Settings,
    Bell,
    Mail,
    MessageSquare,
    Shield,
    Globe,
    Palette
} from 'lucide-react';

const PreferencesTab = ({
                            preferences,
                            onPreferencesChange,
                            onSavePreferences,
                            loading
                        }) => {
    const PreferenceSection = ({ title, icon, children }) => (
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{
                    p: 1,
                    borderRadius: 1,
                    bgcolor: '#fef3c7',
                    color: '#d97706',
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    {icon}
                </Box>
                <Typography variant="h6" fontWeight="600">
                    {title}
                </Typography>
            </Box>
            {children}
        </Paper>
    );

    return (
        <Box>
            {/* Notification Preferences */}
            <PreferenceSection
                title="Notification Preferences"
                icon={<Bell size={20} />}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={preferences.emailNotifications}
                                    onChange={onPreferencesChange}
                                    name="emailNotifications"
                                    disabled={loading}
                                    color="primary"
                                />
                            }
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Mail size={16} />
                                    Email Notifications
                                </Box>
                            }
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                            Receive important updates via email
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={preferences.smsNotifications}
                                    onChange={onPreferencesChange}
                                    name="smsNotifications"
                                    disabled={loading}
                                    color="primary"
                                />
                            }
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <MessageSquare size={16} />
                                    SMS Notifications
                                </Box>
                            }
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                            Get text messages for urgent notifications
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={preferences.marketingEmails}
                                    onChange={onPreferencesChange}
                                    name="marketingEmails"
                                    disabled={loading}
                                    color="primary"
                                />
                            }
                            label="Marketing Emails"
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                            Receive promotional content and updates
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={preferences.securityAlerts}
                                    onChange={onPreferencesChange}
                                    name="securityAlerts"
                                    disabled={loading}
                                    color="primary"
                                />
                            }
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Shield size={16} />
                                    Security Alerts
                                </Box>
                            }
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                            Get notified about account security events
                        </Typography>
                    </Grid>
                </Grid>
            </PreferenceSection>

            {/* General Preferences */}
            <PreferenceSection
                title="General Preferences"
                icon={<Settings size={20} />}
            >
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Language</InputLabel>
                            <Select
                                value={preferences.language}
                                label="Language"
                                name="language"
                                onChange={onPreferencesChange}
                                disabled={loading}
                                startAdornment={<Globe size={16} style={{ marginRight: 8 }} />}
                            >
                                <MenuItem value="en">English</MenuItem>
                                <MenuItem value="af">Afrikaans</MenuItem>
                                <MenuItem value="zu">Zulu</MenuItem>
                                <MenuItem value="xh">Xhosa</MenuItem>
                                <MenuItem value="st">Sotho</MenuItem>
                                <MenuItem value="ts">Tsonga</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Currency</InputLabel>
                            <Select
                                value={preferences.currency}
                                label="Currency"
                                name="currency"
                                onChange={onPreferencesChange}
                                disabled={loading}
                            >
                                <MenuItem value="ZAR">ZAR (South African Rand)</MenuItem>
                                <MenuItem value="USD">USD (US Dollar)</MenuItem>
                                <MenuItem value="EUR">EUR (Euro)</MenuItem>
                                <MenuItem value="GBP">GBP (British Pound)</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Theme</InputLabel>
                            <Select
                                value={preferences.theme}
                                label="Theme"
                                name="theme"
                                onChange={onPreferencesChange}
                                disabled={loading}
                                startAdornment={<Palette size={16} style={{ marginRight: 8 }} />}
                            >
                                <MenuItem value="light">Light Theme</MenuItem>
                                <MenuItem value="dark">Dark Theme</MenuItem>
                                <MenuItem value="auto">Auto (System)</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </PreferenceSection>

            {/* Security Preferences */}
            <PreferenceSection
                title="Security & Privacy"
                icon={<Shield size={20} />}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={preferences.twoFactorAuth}
                                    onChange={onPreferencesChange}
                                    name="twoFactorAuth"
                                    disabled={loading}
                                    color="primary"
                                />
                            }
                            label="Two-Factor Authentication"
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                            Add an extra layer of security to your account
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ p: 2, bgcolor: '#fef3c7', borderRadius: 1, border: '1px solid #facc15' }}>
                            <Typography variant="body2" sx={{ color: '#92400e' }}>
                                <strong>Note:</strong> Enabling two-factor authentication will require you to enter a verification code from your phone each time you log in.
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </PreferenceSection>

            {/* Save Button */}
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="gold"
                    size="large"
                    startIcon={loading ? <CircularProgress size={16} /> : <Settings size={16} />}
                    onClick={onSavePreferences}
                    disabled={loading}
                    sx={{
                        textTransform: 'none',
                        px: 4,
                        py: 1.5
                    }}
                >
                    {loading ? 'Saving Preferences...' : 'Save All Preferences'}
                </Button>
            </Box>
        </Box>
    );
};

export default PreferencesTab;