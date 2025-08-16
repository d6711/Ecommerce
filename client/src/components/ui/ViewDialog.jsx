// components/ui/ViewDialog.jsx
import React from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Grid,
} from '@mui/material'

const ViewDialog = ({ open, onClose, title, data }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2}>
                    {Object.entries(data || {}).map(([key, value]) => (
                        <Grid item xs={6} key={key}>
                            <Typography variant="subtitle2" color="textSecondary">
                                {key}
                            </Typography>
                            <Typography variant="body1">
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ViewDialog
