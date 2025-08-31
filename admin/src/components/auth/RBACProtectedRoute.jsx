import React from 'react'
import { Navigate } from 'react-router-dom'
import { usePermission } from '@src/context/PermissionContext'

const RBACProtectedRoute = ({ action, resource, role, children }) => {
    const { canAccess } = usePermission()

    if (!canAccess(action, resource, role)) {
        return <Navigate to="/403" replace />
    }

    return children
}

export default RBACProtectedRoute