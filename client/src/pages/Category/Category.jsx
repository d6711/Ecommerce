// src/pages/CategoryPage.jsx
import React, { useContext, useEffect, useState } from 'react'
import { Paper, Box, Typography, Button } from '@mui/material'
import { getCategories, createCategory, updateCategory, deleteCategory, getCategoryParents } from '@services/categoryService'
import { uploadImage } from '@services/uploadService'
import { ToastContext } from '@context/ToastContext'

import CategoryTable from '@pages/Category/CategoryTable'
import PaginationBar from '@pages/Category/PaginationBar'
import CategoryFormModal from '@pages/Category/CategoryFormModal'
import ConfirmDialog from '@pages/Category/ConfirmDialog'
import CategoryDetailModal from '@pages/Category/CategoryDetailModal'

const CategoryPage = () => {
    const [categories, setCategories] = useState([])
    const [parentCategories, setParentCategories] = useState([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const [viewCategory, setViewCategory] = useState(null)
    const [openModal, setOpenModal] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [form, setForm] = useState({ name: '', description: '', image: '', parentId: '' })
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

    const handleUploadImage = async (file) => {
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
            parentId: category.parentId?._id || '',
        })
        setOpenModal(true)
    }

    useEffect(() => {
        fetchCategories(page, rowsPerPage)
    }, [page, rowsPerPage])

    useEffect(() => {
        fetchParentCategories()
    }, [])

    return (
        <Paper sx={{ padding: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h5">Danh sách danh mục</Typography>
                <Button variant="contained" onClick={openAddModal}>
                    Thêm danh mục
                </Button>
            </Box>

            <CategoryTable
                categories={categories}
                page={page}
                rowsPerPage={rowsPerPage}
                onView={setViewCategory}
                onEdit={openEditModal}
                onDelete={(cat) => setConfirmDelete({ open: true, category: cat })}
            />

            <PaginationBar
                total={total}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={(_, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10))
                    setPage(0)
                }}
            />

            <CategoryFormModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                editMode={editMode}
                form={form}
                setForm={setForm}
                parentCategories={parentCategories}
                uploading={uploading}
                onUploadImage={handleUploadImage}
                onSubmit={handleSubmit}
            />

            <ConfirmDialog
                open={confirmDelete.open}
                title="Xác nhận xóa"
                description={`Bạn có chắc chắn muốn xóa danh mục "${confirmDelete.category?.name}" không?`}
                onClose={() => setConfirmDelete({ open: false, category: null })}
                onConfirm={handleDelete}
            />

            <CategoryDetailModal open={!!viewCategory} onClose={() => setViewCategory(null)} category={viewCategory} />
        </Paper>
    )
}

export default CategoryPage
