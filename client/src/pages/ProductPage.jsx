import FormDialog from '@components/ui/FormDialog'
import TableCommon from '@components/ui/TableCommon'
import usePaginatedFetch from '@hooks/usePaginatedFetch'
import { Button, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'

const columns = [
    { field: 'name', headerName: 'Name' },
    { field: 'price', headerName: 'Price' },
    { field: 'stock', headerName: 'Stock' },
    { field: 'ratingAvg', headerName: 'Rating Avg' },
    { field: 'ratingCount', headerName: 'Rating Count' },
    { field: 'description', headerName: 'Description' },
    { field: 'specification', headerName: 'Specification' },
    { field: 'brand', headerName: 'Brand' },
    { field: 'tags', headerName: 'Tags' },
    { field: 'categoryId', headerName: 'Category Id' },
    { field: 'isActive', headerName: 'Is Active' },
    { field: 'isFeatured', headerName: 'Is Featured' },
    { field: 'soldCount', headerName: 'Sold Count' },
]

const ProductPage = () => {
    // State cho dialog
    const [open, setOpen] = useState(false)
    const [mode, setMode] = useState('create') // "create" | "edit" | "view"
    const [selected, setSelected] = useState(null)

    const { data, total, page, setPage, limit, setLimit, loading } = usePaginatedFetch('/products')
    const handleView = (row) => {}
    const handleAdd = (row) => {}
    const handleEdit = (row) => {}
    const handleDelete = (row) => {}

    const handleOpen = (mode, row = null) => {
        setMode(mode)
        setSelected(row)
        setOpen(true)
    }

    const handleClose = () => setOpen(false)

    const handleSave = () => {
        if (mode === 'create') {
            // call API create
        } else if (mode === 'edit') {
            // call API update
        }
        setOpen(false)
    }

    return (
        <div>
            <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpen('create')}
                sx={{ mb: 2 }}
            >
                Thêm mới
            </Button>
            {loading ? (
                <p>Đang tải...</p>
            ) : (
                <TableCommon
                    columns={columns}
                    rows={data}
                    page={page}
                    limit={limit}
                    total={total}
                    onPageChange={setPage}
                    onLimitChange={setLimit}
                    onView={(row) => handleOpen('view', row)}
                    onEdit={(row) => handleOpen('edit', row)}
                    onDelete={(row) => alert(`Xoá: ${row.name}`)}
                />
            )}
            <FormDialog
                open={open}
                onClose={handleClose}
                onSave={handleSave}
                showSave={mode !== 'view'}
                title={
                    mode === 'create'
                        ? 'Thêm sản phẩm'
                        : mode === 'edit'
                        ? 'Sửa sản phẩm'
                        : 'Xem sản phẩm'
                }
            >
                {mode === 'view' ? (
                    <>
                        <Typography>
                            <strong>Tên:</strong> {selected?.name}
                        </Typography>
                        <Typography>
                            <strong>Giá:</strong> {selected?.price}
                        </Typography>
                        <Typography>
                            <strong>Tồn kho:</strong> {selected?.stock}
                        </Typography>
                    </>
                ) : (
                    <>
                        <TextField
                            fullWidth
                            label="Tên sản phẩm"
                            margin="dense"
                            defaultValue={selected?.name || ''}
                        />
                        <TextField
                            fullWidth
                            label="Giá"
                            margin="dense"
                            type="number"
                            defaultValue={selected?.price || ''}
                        />
                        <TextField
                            fullWidth
                            label="Tồn kho"
                            margin="dense"
                            type="number"
                            defaultValue={selected?.stock || ''}
                        />
                    </>
                )}
            </FormDialog>
        </div>
    )
}

export default ProductPage
