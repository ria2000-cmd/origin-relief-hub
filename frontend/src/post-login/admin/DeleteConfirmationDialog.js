import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Alert
} from '@mui/material';
import { AlertTriangle } from 'lucide-react';

const DeleteConfirmDialog = ({ open, onClose, user, onConfirm, loading }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AlertTriangle size={24} color="#ef4444" />
                Confirm Delete
            </DialogTitle>
            <DialogContent>
                <Alert severity="warning" sx={{ mb: 2 }}>
                    This action cannot be undone!
                </Alert>
                <Typography>
                    Are you sure you want to delete the user <strong>{user?.displayName || user?.fullName}</strong>?
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Email: {user?.email}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color="error"
                    disabled={loading}
                >
                    Delete User
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteConfirmDialog;