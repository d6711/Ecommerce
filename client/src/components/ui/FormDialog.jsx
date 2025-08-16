// components/FormDialog.jsx
import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'

function FormDialog({ open, onClose, title, children, onSave, showSave = true }) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent dividers>{children}</DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    Hủy
                </Button>
                {showSave && (
                    <Button onClick={onSave} variant="contained" color="primary">
                        Lưu
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    )
}

export default FormDialog
