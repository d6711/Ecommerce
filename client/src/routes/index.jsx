import { lazy } from 'react'

const routers = [
    {
        path: '/',
        component: lazy(() => import('@pages/HomePage/HomePage')),
    },
]

export default routers
