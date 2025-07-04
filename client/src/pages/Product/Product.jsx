import {
    Box,
    Button,
    Paper,
    Table,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material'
import React from 'react'

const ProductPage = () => {
    const tableProducts = [
        { name: 'STT', value: 'index' },
        { name: 'Ảnh đại diện', value: 'images' },
        { name: 'Tên sản phẩm', value: 'name' },
        { name: 'Giá bán', value: 'price' },
        { name: 'Số lượng trong kho', value: 'stock' },
        { name: 'Số sao trung bình', value: 'ratingAvg' },
        { name: 'Số lượt đánh giá', value: 'ratingCount' },
        { name: 'Mô tả', value: 'description' },
        { name: 'Thông số kỹ thuật', value: 'specification' },
        { name: 'Thương hiệu', value: 'brand' },
        { name: 'Tag', value: 'tags' },
        { name: 'Danh mục', value: 'categoryId' },
        { name: 'Trạng thái', value: 'isActive' },
        { name: 'Sản phẩm nổi bật', value: 'isFeatured' },
        { name: 'Đã bán', value: 'soldCount' },
    ]

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
                            <TableCell>Số sao trung bình</TableCell>
                            <TableCell>Số lượt đánh giá</TableCell>
                            <TableCell>Mô tả</TableCell>
                            <TableCell>Thông số kỹ thuật</TableCell>
                            <TableCell>Thương hiệu</TableCell>
                            <TableCell>Tag</TableCell>
                            <TableCell>Danh mục sản phẩm</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Sản phẩm nổi bật</TableCell>
                            <TableCell>Đã bán</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                </Table>
            </TableContainer>
        </Paper>
    )
}

export default ProductPage
