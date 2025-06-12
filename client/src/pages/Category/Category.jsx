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
} from '@mui/material'
import { getCategories } from '@services/categoryService'
import { ToastContext } from '@context/ToastContext'

const CategoryPage = () => {
    const [categories, setCategories] = useState([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
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

    useEffect(() => {
        fetchCategories(page, rowsPerPage)
    }, [page, rowsPerPage])

    const handleChangePage = (_, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    return (
        <Paper sx={{ padding: 2 }}>
            <Typography variant="h5" gutterBottom>
                Danh sách danh mục
            </Typography>
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
                                        <Button variant="contained" color="warning">
                                            Sửa
                                        </Button>
                                        <Button variant="contained" color="error">
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
        </Paper>
    )
}

export default CategoryPage
