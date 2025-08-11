// src/components/CategoryTable.jsx
import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableRow, IconButton, Avatar } from '@mui/material'
import { Visibility, Edit, Delete } from '@mui/icons-material'

const CategoryTable = ({ categories, page, rowsPerPage, onView, onEdit, onDelete }) => {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Ảnh</TableCell>
                    <TableCell>Tên danh mục</TableCell>
                    <TableCell>Mô tả</TableCell>
                    <TableCell>Danh mục cha</TableCell>
                    <TableCell align="right">Hành động</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {categories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((cat) => (
                    <TableRow key={cat._id}>
                        <TableCell>
                            <Avatar src={cat.image} alt={cat.name} sx={{ width: 64, height: 64 }} variant="square" />
                        </TableCell>
                        <TableCell>{cat.name}</TableCell>
                        <TableCell>{cat.description}</TableCell>
                        <TableCell>{cat.parentId?.name || '—'}</TableCell>
                        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                            <IconButton color="primary" onClick={() => onView(cat)}>
                                <Visibility />
                            </IconButton>
                            <IconButton color="secondary" onClick={() => onEdit(cat)}>
                                <Edit />
                            </IconButton>
                            <IconButton color="error" onClick={() => onDelete(cat)}>
                                <Delete />
                            </IconButton>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default CategoryTable
