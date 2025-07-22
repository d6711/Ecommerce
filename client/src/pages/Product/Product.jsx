import { ToastContext } from '@context/ToastContext'
import { Delete, Edit, Visibility } from '@mui/icons-material'
import { Box, Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material'
import { getProducts } from '@services/productService'
import React, { useContext, useEffect, useState } from 'react'

const ProductPage = () => {
    const [products, setProducts] = useState([])

    const { toast } = useContext(ToastContext)

    const fetchProducts = async () => {
        try {
            const res = await getProducts()
            setProducts(res.data.metadata)
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || 'Lỗi khi tải sản phẩm')
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    return (
        <Paper sx={{ padding: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h5">Danh sách sản phẩm</Typography>
                <Button variant="contained">Thêm mới sản phẩm</Button>
            </Box>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>STT</TableCell>
                            <TableCell>Ảnh</TableCell>
                            <TableCell>Tên sản phẩm</TableCell>
                            <TableCell>Giá bán</TableCell>
                            <TableCell>Số lượng trong kho</TableCell>
                            {/* <TableCell>Số sao trung bình</TableCell> */}
                            {/* <TableCell>Số lượt đánh giá</TableCell> */}
                            {/* <TableCell>Mô tả</TableCell> */}
                            {/* <TableCell>Thông số kỹ thuật</TableCell> */}
                            <TableCell>Thương hiệu</TableCell>
                            {/* <TableCell>Tag</TableCell> */}
                            <TableCell>Danh mục sản phẩm</TableCell>
                            {/* <TableCell>Trạng thái</TableCell> */}
                            {/* <TableCell>Sản phẩm nổi bật</TableCell> */}
                            {/* <TableCell>Đã bán</TableCell> */}
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product._id}>
                                <TableCell>1</TableCell>
                                <TableCell>{product.images[0]}</TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.price}</TableCell>
                                <TableCell>{product.stock}</TableCell>
                                {/* <TableCell>{product.ratingAvg}</TableCell> */}
                                {/* <TableCell>{product.ratingCount}</TableCell> */}
                                {/* <TableCell>{product.description}</TableCell> */}
                                {/* <TableCell>{product.specification}</TableCell> */}
                                <TableCell>{product.brand}</TableCell>
                                {/* <TableCell>{product.tags.join(', ')}</TableCell> */}
                                <TableCell>{product.categoryId?.name}</TableCell>
                                {/* <TableCell>{product.isActive}</TableCell> */}
                                {/* <TableCell>{product.isFeatured}</TableCell> */}
                                {/* <TableCell>{product.soldCount}</TableCell> */}
                                <TableCell>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Tooltip title="Xem">
                                            <IconButton color="primary" onClick={() => openViewModal(cat)}>
                                                <Visibility />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Sửa">
                                            <IconButton color="warning" onClick={() => openEditModal(cat)}>
                                                <Edit />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Xóa">
                                            <IconButton color="error" onClick={() => setConfirmDelete({ open: true, category: cat })}>
                                                <Delete />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    )
}

export default ProductPage
