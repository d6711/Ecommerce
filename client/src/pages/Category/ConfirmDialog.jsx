// src/components/ConfirmDialog.jsx
import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material'

const ConfirmDialog = ({ open, onClose, onConfirm, title, description }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{description}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Hủy</Button>
                <Button variant="contained" color="error" onClick={onConfirm}>
                    Xóa
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmDialog
