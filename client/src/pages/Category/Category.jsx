import React, { useContext, useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Avatar,
    Button,
    TablePagination,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
} from '@mui/material'
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryParents,
} from '@services/categoryService'
import { uploadImage } from '@services/uploadService'
import { ToastContext } from '@context/ToastContext'

const CategoryPage = () => {
    const [categories, setCategories] = useState([])
    const [parentCategories, setParentCategories] = useState([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)

    const [openModal, setOpenModal] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [form, setForm] = useState({
        name: '',
        description: '',
        image: '',
        parentId: '',
    })
    const [uploading, setUploading] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState({ open: false, category: null })

    const { toast } = useContext(ToastContext)

    const fetchCategories = async (pageIndex, pageSize) => {
        try {
            const res = await getCategories({ page: pageIndex + 1, limit: pageSize })
            setCategories(res.data.metadata)
            setTotal(res.data.pagination.totalDocuments)
        } catch (err) {
            toast.error(err.response?.data?.message || 'Lỗi khi tải danh mục')
        }
    }

    const fetchParentCategories = async () => {
        try {
            const res = await getCategoryParents()
            setParentCategories(res.data.metadata)
        } catch (err) {
            toast.error('Lỗi khi tải danh mục cha')
        }
    }

    useEffect(() => {
        fetchCategories(page, rowsPerPage)
        fetchParentCategories()
    }, [page, rowsPerPage])

    const handleChangePage = (_, newPage) => setPage(newPage)
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const openAddModal = () => {
        setEditMode(false)
        setForm({ name: '', description: '', image: '', parentId: '' })
        setOpenModal(true)
    }

    const openEditModal = (category) => {
        setEditMode(true)
        setSelectedCategory(category)
        setForm({
            name: category.name,
            description: category.description,
            image: category.image,
            parentId: category.parentId || '',
        })
        setOpenModal(true)
    }

    const handleUploadImage = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        setUploading(true)
        try {
            const res = await uploadImage(file)
            setForm((prev) => ({ ...prev, image: res.data.metadata.imageUrl }))
        } catch (err) {
            toast.error('Lỗi upload ảnh')
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async () => {
        try {
            if (editMode) {
                await updateCategory(selectedCategory._id, form)
                toast.success('Cập nhật thành công')
            } else {
                await createCategory(form)
                toast.success('Thêm danh mục thành công')
            }
            setOpenModal(false)
            fetchCategories(page, rowsPerPage)
            fetchParentCategories()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Lỗi xử lý')
        }
    }

    const handleDelete = async () => {
        try {
            await deleteCategory(confirmDelete.category._id)
            toast.success('Xóa thành công')
            fetchCategories(page, rowsPerPage)
            fetchParentCategories()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Lỗi xóa')
        } finally {
            setConfirmDelete({ open: false, category: null })
        }
    }

    return (
        <Paper sx={{ padding: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h5">Danh sách danh mục</Typography>
                <Button variant="contained" onClick={openAddModal}>
                    Thêm danh mục
                </Button>
            </Box>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Ảnh</TableCell>
                            <TableCell>Tên</TableCell>
                            <TableCell>Slug</TableCell>
                            <TableCell>Mô tả</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map((cat) => (
                            <TableRow key={cat._id}>
                                <TableCell>
                                    <Avatar variant="rounded" src={cat.image} alt={cat.name} />
                                </TableCell>
                                <TableCell>{cat.name}</TableCell>
                                <TableCell>{cat.slug}</TableCell>
                                <TableCell>{cat.description}</TableCell>
                                <TableCell>{cat.isActive ? 'Hoạt động' : 'Ẩn'}</TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button
                                            variant="contained"
                                            color="warning"
                                            onClick={() => openEditModal(cat)}
                                        >
                                            Sửa
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() =>
                                                setConfirmDelete({ open: true, category: cat })
                                            }
                                        >
                                            Xóa
                                        </Button>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={total}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
                labelRowsPerPage="Hiển thị"
            />

            {/* Modal Thêm / Sửa */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
                <DialogTitle>{editMode ? 'Cập nhật danh mục' : 'Thêm danh mục'}</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Tên danh mục"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Mô tả"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        margin="normal"
                        multiline
                        rows={3}
                    />
                    <TextField
                        select
                        fullWidth
                        label="Danh mục cha"
                        value={form.parentId}
                        onChange={(e) => setForm({ ...form, parentId: e.target.value })}
                        margin="normal"
                    >
                        <MenuItem value="">-- Không có --</MenuItem>
                        {parentCategories.map((parent) => (
                            <MenuItem key={parent._id} value={parent._id}>
                                {parent.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Box sx={{ mt: 2 }}>
                        <Button component="label" variant="outlined">
                            Chọn ảnh
                            <input hidden type="file" onChange={handleUploadImage} />
                        </Button>
                        {uploading && <Typography variant="body2">Đang tải ảnh...</Typography>}
                        {form.image && (
                            <Avatar
                                src={form.image}
                                alt="preview"
                                variant="rounded"
                                sx={{ width: 120, height: 120, mt: 1 }}
                            />
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModal(false)}>Hủy</Button>
                    <Button variant="contained" onClick={handleSubmit}>
                        {editMode ? 'Cập nhật' : 'Thêm'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal Xác nhận Xóa */}
            <Dialog
                open={confirmDelete.open}
                onClose={() => setConfirmDelete({ open: false, category: null })}
            >
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <Typography>
                        Bạn có chắc chắn muốn xóa danh mục{' '}
                        <strong>{confirmDelete.category?.name}</strong> không?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDelete({ open: false, category: null })}>
                        Hủy
                    </Button>
                    <Button variant="contained" color="error" onClick={handleDelete}>
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    )
}

export default CategoryPage
