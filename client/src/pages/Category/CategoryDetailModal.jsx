// src/components/CategoryDetailModal.jsx
import React from 'react'
import { Dialog, DialogTitle, DialogContent, Typography, Box, Avatar, IconButton, Divider } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

const CategoryDetailModal = ({ open, onClose, category }) => {
    if (!category) return null

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            {/* Header */}
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                Chi tiết danh mục
                <IconButton edge="end" color="inherit" onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <Divider />

            <DialogContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar src={category.image} alt={category.name} sx={{ width: 64, height: 64 }} variant="square" />
                    <Box>
                        <Typography variant="h6">{category.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {category.slug}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'grid', gap: 1 }}>
                    <Typography variant="body1">
                        <strong>Mô tả:</strong> {category.description || '—'}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Danh mục cha:</strong> {category.parentId?.name || '—'}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Trạng thái:</strong> {category.isActive ? 'Đang hoạt động' : 'Tạm dừng'}
                    </Typography>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default CategoryDetailModal
