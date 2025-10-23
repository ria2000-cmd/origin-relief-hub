import React, { useState, useRef, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    TextField,
    Button,
    Typography,
    IconButton,
    Paper
} from '@mui/material';
import { X, Send, Bot } from 'lucide-react';

const ChatbotModal = ({ open, onClose }) => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! I'm Thandi, your SASSA assistant. How can I help you today?",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Enhanced FAQ-based responses
    const getBotResponse = (userMessage) => {
        const message = userMessage.toLowerCase();

        // Password Reset
        if (message.includes('password') || message.includes('forgot password') || message.includes('reset password') || message.includes('change password')) {
            return "To reset your SASSA online account password:\n\n1. Go to the SASSA login page\n2. Click 'Forgot Password'\n3. Enter your ID number and registered email\n4. Check your email for reset link\n5. Create a new password\n\nIf you don't receive the email, check spam folder or call 0800 60 10 11 for assistance.";
        }
        // Account Login Issues
        else if (message.includes('login') || message.includes('sign in') || message.includes('account locked') || message.includes('cannot access')) {
            return "Login issues? Here's what to do:\n\n• Forgot password? Use 'Forgot Password' link\n• Account locked? Wait 30 minutes or call 0800 60 10 11\n• Wrong credentials? Ensure CAPS LOCK is off\n• Not registered? Register using your ID number\n\nFor security, accounts lock after 3 failed login attempts.";
        }
        // Registration and Application
        else if (message.includes('register') || message.includes('registration') || message.includes('apply') || message.includes('new application')) {
            return "To register for a SASSA grant:\n\n1. Visit your nearest SASSA office\n2. Bring your ID, proof of residence, and bank details\n3. Complete the application form\n4. Submit required documents\n\nFor disability grants, you'll also need a medical/doctor's report. The process takes 3 months for approval.";
        }
        // Online Account Registration
        else if (message.includes('online account') || message.includes('create account') || message.includes('signup') || message.includes('sign up')) {
            return "To create a SASSA online account:\n\n1. Visit www.sassa.gov.za\n2. Click 'Register'\n3. Enter your ID number\n4. Provide email and phone number\n5. Create a password\n6. Verify via SMS/Email\n\nYou must already be a SASSA beneficiary to register online.";
        }
        // Grant Types
        else if (message.includes('types of grant') || message.includes('which grant') || message.includes('grant types')) {
            return "SASSA offers several grants:\n\n• Old Age Grant (60+ years)\n• Disability Grant\n• Child Support Grant\n• Foster Care Grant\n• Care Dependency Grant\n• War Veterans Grant\n\nWhich grant would you like to know more about?";
        }
        // Eligibility
        else if (message.includes('eligible') || message.includes('eligibility') || message.includes('qualify')) {
            return "Eligibility requirements vary by grant type. Generally:\n\n• Must be a South African citizen/permanent resident\n• Must meet income/asset thresholds\n• Must not receive other social grants\n• Age requirements apply (e.g., 60+ for Old Age Grant)\n\nWhich specific grant are you interested in?";
        }
        // Child Support Grant
        else if (message.includes('child support') || message.includes('child grant')) {
            return "Child Support Grant:\n\n• For children under 18 years\n• R530 per child per month\n• Primary caregiver must apply\n• Income threshold: R5,500 (single) or R11,000 (married)\n\nRequired: Child's birth certificate, applicant's ID, proof of income.";
        }
        // Disability Grant
        else if (message.includes('disability')) {
            return "Disability Grant:\n\n• R2,190 per month\n• For persons 18-59 years with disabilities\n• Requires medical assessment\n• Can be temporary (6-12 months) or permanent\n\nBring: ID, medical reports, proof of residence, bank details.";
        }
        // Old Age Grant
        else if (message.includes('old age') || message.includes('pension')) {
            return "Old Age Grant:\n\n• R2,190 per month\n• For persons 60+ years\n• Income threshold: R9,390 (single) or R18,780 (married)\n\nRequired: ID, proof of marital status, bank details, proof of residence.";
        }
        // Payment and Collection
        else if (message.includes('payment') || message.includes('when will i get')) {
            return "Your next payment is scheduled for 25 September 2025 (R1,890.00). Payments are typically made on the first few days of each month. You'll receive an SMS notification before payment.";
        }
        else if (message.includes('collection') || message.includes('collect') || message.includes('withdraw')) {
            return "You can collect your grant at:\n\n• SASSA-approved pay points\n• Post Office branches\n• ATMs (if you have a SASSA card)\n• Direct bank deposit\n\nRemember to bring your ID or SASSA card for collection.";
        }
        // Documents
        else if (message.includes('document') || message.includes('what do i need') || message.includes('requirements')) {
            return "Required documents for most grants:\n\n✓ Valid South African ID\n✓ Proof of residence (not older than 3 months)\n✓ Bank account details\n✓ Proof of income (payslips/affidavit)\n\nAdditional documents may be needed depending on the grant type.";
        }
        // Application Status
        else if (message.includes('status') || message.includes('track') || message.includes('check application')) {
            return "To check your application status:\n\n1. SMS your ID number to 32551\n2. Call 0800 60 10 11\n3. Visit your nearest SASSA office\n\nApplications typically take up to 3 months to process.";
        }
        // Appeal/Rejection
        else if (message.includes('reject') || message.includes('appeal') || message.includes('denied')) {
            return "If your application was rejected:\n\n1. You have 90 days to appeal\n2. Visit your nearest SASSA office\n3. Request appeal forms\n4. Provide additional supporting documents\n\nYou'll receive a written explanation for the rejection.";
        }
        // Lost Card/PIN
        else if (message.includes('lost card') || message.includes('lost pin') || message.includes('forgot pin')) {
            return "For lost SASSA card or forgotten PIN:\n\n• Visit your nearest SASSA office immediately\n• Bring your ID\n• Report the card as lost/stolen\n• A replacement card will be issued\n\nTemporary payment arrangements can be made while waiting.";
        }
        // Change Details
        else if (message.includes('change') || message.includes('update') || message.includes('bank details')) {
            return "To update your details:\n\n1. Visit your nearest SASSA office\n2. Bring your ID\n3. Bring proof of changes (new address, bank details, etc.)\n4. Complete the change form\n\nChanges take 1-2 weeks to process.";
        }
        // Fraud Reporting
        else if (message.includes('fraud') || message.includes('report') || message.includes('scam')) {
            return "To report fraud or suspicious activity:\n\n📞 SASSA Fraud Hotline: 0800 60 10 11\n📧 Email: GrantEnquiries@sassa.gov.za\n\nNever share your PIN, OTP, or personal details with anyone. SASSA will never ask for payment to process grants.";
        }
        // Office Locations
        else if (message.includes('office') || message.includes('location') || message.includes('where') || message.includes('nearest')) {
            return "To find your nearest SASSA office:\n\n• Visit www.sassa.gov.za\n• Call 0800 60 10 11\n• Operating hours: Mon-Fri, 8:00 AM - 4:00 PM\n\nBring all required documents and arrive early to avoid long queues.";
        }
        // Default response
        else {
            return "I can help you with:\n\n✓ Password reset & login issues\n✓ Grant registration & applications\n✓ Grant types & eligibility\n✓ Payment schedules\n✓ Document requirements\n✓ Application status\n✓ Appeals & rejections\n✓ Lost cards/PINs\n✓ Updating details\n✓ Office locations\n\nWhat would you like to know?";
        }
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage = {
            id: messages.length + 1,
            text: inputMessage,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsTyping(true);

        // Simulate bot thinking time
        setTimeout(() => {
            const botMessage = {
                id: messages.length + 2,
                text: getBotResponse(inputMessage),
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMessage]);
            setIsTyping(false);
        }, 1000);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    height: '600px',
                    display: 'flex',
                    flexDirection: 'column'
                }
            }}
        >
            <DialogTitle sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: '#10b981',
                color: 'white'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Bot size={24} />
                    <Box>
                        <Typography variant="h6">Thandi</Typography>
                        <Typography variant="caption" sx={{ opacity: 0.9 }}>
                            SASSA AI Assistant
                        </Typography>
                    </Box>
                </Box>
                <IconButton onClick={onClose} sx={{ color: 'white' }}>
                    <X size={20} />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {messages.map((message) => (
                        <Box
                            key={message.id}
                            sx={{
                                display: 'flex',
                                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
                            }}
                        >
                            <Paper
                                elevation={1}
                                sx={{
                                    p: 1.5,
                                    maxWidth: '75%',
                                    bgcolor: message.sender === 'user' ? '#3b82f6' : '#f1f5f9',
                                    color: message.sender === 'user' ? 'white' : 'text.primary',
                                    borderRadius: 2
                                }}
                            >
                                <Typography variant="body2">{message.text}</Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        mt: 0.5,
                                        display: 'block',
                                        opacity: 0.7
                                    }}
                                >
                                    {message.timestamp.toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </Typography>
                            </Paper>
                        </Box>
                    ))}
                    {isTyping && (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <Paper
                                elevation={1}
                                sx={{
                                    p: 1.5,
                                    bgcolor: '#f1f5f9',
                                    borderRadius: 2
                                }}
                            >
                                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                    Thandi is typing...
                                </Typography>
                            </Paper>
                        </Box>
                    )}
                    <div ref={messagesEndRef} />
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
                <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Type your message..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isTyping}
                    />
                    <Button
                        variant="contained"
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() || isTyping}
                        sx={{
                            bgcolor: '#10b981',
                            '&:hover': { bgcolor: '#059669' },
                            minWidth: 'auto',
                            px: 2
                        }}
                    >
                        <Send size={20} />
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default ChatbotModal;