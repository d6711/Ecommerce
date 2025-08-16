// components/ui/ConfirmDialog.jsx
import React from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from '@mui/material'

const ConfirmDialog = ({ open, onClose, onConfirm, title, message }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Typography>{message}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    Hủy
                </Button>
                <Button onClick={onConfirm} color="error" variant="contained">
                    Xóa
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmDialog
