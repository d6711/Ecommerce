import { lazy } from 'react'

const routers = [
    {
        path: '/',
        component: lazy(() => import('@pages/HomePage/HomePage')),
    },
    {
        path: '/login',
        component: lazy(() => import('@pages/Login/Login')),
    },
]

export default routers
