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
import { useTranslation } from 'react-i18next';

const PreferencesTab = ({
                            preferences,
                            onPreferencesChange,
                            onSavePreferences,
                            loading
                        }) => {
    const { t } = useTranslation();

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
                title={t('preferences.notifications')}
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
                                    {t('preferences.emailNotifications')}
                                </Box>
                            }
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                            {t('preferences.emailNotifications')}
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
                                    {t('preferences.smsNotifications')}
                                </Box>
                            }
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                            {t('preferences.smsNotifications')}
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
                            label={t('preferences.marketingEmails')}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                            {t('preferences.marketingEmails')}
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
                                    {t('preferences.securityAlerts')}
                                </Box>
                            }
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                            {t('preferences.securityAlerts')}
                        </Typography>
                    </Grid>
                </Grid>
            </PreferenceSection>

            {/* General Preferences */}
            <PreferenceSection
                title={t('preferences.generalPreferences')}
                icon={<Settings size={20} />}
            >
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>{t('preferences.language')}</InputLabel>
                            <Select
                                value={preferences.language}
                                label={t('preferences.language')}
                                name="language"
                                onChange={onPreferencesChange}
                                disabled={loading}
                                startAdornment={<Globe size={16} style={{ marginRight: 8 }} />}
                            >
                                <MenuItem value="en">{t('languages.en')}</MenuItem>
                                <MenuItem value="af">{t('languages.af')}</MenuItem>
                                <MenuItem value="zu">{t('languages.zu')}</MenuItem>
                                <MenuItem value="xh">{t('languages.xh')}</MenuItem>
                                <MenuItem value="st">{t('languages.st')}</MenuItem>
                                <MenuItem value="ts">{t('languages.ts')}</MenuItem>
                                <MenuItem value="ve">{t('languages.ve')}</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>{t('preferences.currency')}</InputLabel>
                            <Select
                                value={preferences.currency}
                                label={t('preferences.currency')}
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
                            <InputLabel>{t('preferences.theme')}</InputLabel>
                            <Select
                                value={preferences.theme}
                                label={t('preferences.theme')}
                                name="theme"
                                onChange={onPreferencesChange}
                                disabled={loading}
                                startAdornment={<Palette size={16} style={{ marginRight: 8 }} />}
                            >
                                <MenuItem value="light">{t('preferences.light')}</MenuItem>
                                <MenuItem value="dark">{t('preferences.dark')}</MenuItem>
                                <MenuItem value="auto">Auto (System)</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </PreferenceSection>

            {/* Security Preferences */}
            <PreferenceSection
                title={t('profile.security')}
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
                            label={t('preferences.twoFactorAuth')}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                            {t('preferences.twoFactorAuth')}
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
                    {loading ? t('common.loading') : t('preferences.savePreferences')}
                </Button>
            </Box>
        </Box>
    );
};

export default PreferencesTab;