import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    IconButton,
    Box,
} from '@mui/material'
import { Visibility, Edit, Delete } from '@mui/icons-material'

export default function TableCommon({
    columns,
    rows,
    page,
    limit,
    total,
    onPageChange,
    onLimitChange,
    onView,
    onEdit,
    onDelete,
}) {
    const renderCell = (value) => {
        if (Array.isArray(value)) {
            return value.map((v) => (typeof v === 'object' ? v.name : v)).join(', ')
        }
        if (typeof value === 'object' && value !== null) {
            return value.name ?? JSON.stringify(value)
        }
        return value
    }

    return (
        <Paper>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>STT</TableCell>
                            {columns.map((col) => (
                                <TableCell key={col.field}>{col.headerName}</TableCell>
                            ))}
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, idx) => (
                            <TableRow key={row._id || idx}>
                                <TableCell>{(page - 1) * limit + idx + 1}</TableCell>
                                {columns.map((col) => (
                                    <TableCell key={col.field}>{renderCell(row[col.field])}</TableCell>
                                ))}
                                <TableCell align="left">
                                    <Box display="flex">
                                        <IconButton color="primary" onClick={() => onView?.(row)}>
                                            <Visibility />
                                        </IconButton>
                                        <IconButton color="secondary" onClick={() => onEdit?.(row)}>
                                            <Edit />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => onDelete?.(row)}>
                                            <Delete />
                                        </IconButton>
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
                page={page - 1}
                rowsPerPage={limit}
                onPageChange={(e, newPage) => onPageChange(newPage + 1)}
                onRowsPerPageChange={(e) => onLimitChange(parseInt(e.target.value, 10))}
            />
        </Paper>
    )
}
