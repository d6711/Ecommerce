import TableCommon from '@components/ui/TableCommon'
import usePaginatedFetch from '@hooks/usePaginatedFetch'
import React from 'react'

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

const OrderPage = () => {
    const { data, total, page, setPage, limit, setLimit, loading } = usePaginatedFetch('/products')
    return (
        <div>
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
                />
            )}
        </div>
    )
}

export default OrderPage
