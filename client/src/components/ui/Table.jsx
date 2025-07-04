import { Paper, Table, TableContainer, TableRow } from '@mui/material'
import React from 'react'

const TableCustom = ({ rowName }) => {
    return (
        <div>
            <Paper>
                Hello
                <TableContainer>
                    <Table>
                        <TableRow>{rowName}</TableRow>
                    </Table>
                </TableContainer>
            </Paper>
        </div>
    )
}

export default TableCustom
