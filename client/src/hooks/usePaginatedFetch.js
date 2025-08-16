import axiosClient from '@config/axiosClient'
import { useEffect, useState } from 'react'

function usePaginatedFetch(url, params = {}) {
    const [data, setData] = useState([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(false)

    const [page, setPage] = useState(1) //  current page
    const [limit, setLimit] = useState(10) // row per page


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const res = await axiosClient.get(url, {
                    params: { page, limit, ...params }
                })
                setData(res.data.metadata) // data
                setTotal(res.data.pagination.totalDocuments) // record
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [url, page, limit, JSON.stringify(params)])

    return { data, total, loading, page, setPage, limit, setLimit }
}

export default usePaginatedFetch