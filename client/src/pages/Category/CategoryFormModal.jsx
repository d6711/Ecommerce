import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, CircularProgress } from '@mui/material'

const CategoryFormModal = ({ open, onClose, editMode, form, setForm, parentCategories, uploading, onUploadImage, onSubmit }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{editMode ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</DialogTitle>
            <DialogContent>
                <TextField fullWidth margin="normal" label="Tên danh mục" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
                <TextField fullWidth margin="normal" label="Mô tả" value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} />
                <TextField select fullWidth margin="normal" label="Danh mục cha" value={form.parentId} onChange={(e) => setForm((prev) => ({ ...prev, parentId: e.target.value }))}>
                    <MenuItem value="">— Không chọn —</MenuItem>
                    {parentCategories.map((p) => (
                        <MenuItem key={p._id} value={p._id}>
                            {p.name}
                        </MenuItem>
                    ))}
                </TextField>
                <Button variant="outlined" component="label" sx={{ mt: 2 }}>
                    {uploading ? <CircularProgress size={20} /> : 'Tải ảnh lên'}
                    <input hidden type="file" accept="image/*" onChange={(e) => onUploadImage(e.target.files[0])} />
                </Button>
                {form.image && <img src={form.image} alt="Preview" style={{ width: 100, marginTop: 10, display: 'block' }} />}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Hủy</Button>
                <Button variant="contained" onClick={onSubmit}>
                    {editMode ? 'Cập nhật' : 'Thêm mới'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default CategoryFormModal
