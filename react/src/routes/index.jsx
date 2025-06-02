import { lazy } from 'react'

const routers = [
    {
        path: '/',
        component: lazy(() => import('@pages/HomePage/index')),
    },
]

export default routers
