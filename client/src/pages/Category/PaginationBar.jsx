// src/components/PaginationBar.jsx
import React from 'react'
import { TablePagination } from '@mui/material'

const PaginationBar = ({ total, page, rowsPerPage, onPageChange, onRowsPerPageChange }) => {
    return (
        <TablePagination component="div" count={total} page={page} onPageChange={onPageChange} rowsPerPage={rowsPerPage} onRowsPerPageChange={onRowsPerPageChange} rowsPerPageOptions={[5, 10, 25]} />
    )
}

export default PaginationBar
