// PermissionContext.js
import axiosClient from '@src/config/axiosClient'
import React, { createContext, useContext, useState, useEffect } from 'react'

const PermissionContext = createContext()

export const PermissionProvider = ({ userId, children }) => {
    const [permissions, setPermissions] = useState([])
    const [roleName, setRoleName] = useState(null)

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                // Lấy roleName của user
                const res = await axiosClient.get(`/rbac/role/${userId}`)
                const role = res.data.metadata
                console.log(role)
                setRoleName(role)

                // Lấy permissions của role
                const perRes = await axiosClient.get(`/rbac/role/${role}/permissions`)
                console.log(perRes)
                setPermissions(perRes.data.metadata) // [{ role, action, resource, attributes }]
            } catch (err) {
                console.error('Error fetching permissions', err)
            }
        }
        if (userId) fetchPermissions()
    }, [userId])

    // Hàm check quyền + role
    const canAccess = (action, resource, role) =>
        permissions.some(
            (p) => p.action === action && p.resource === resource && p.role === (role || roleName), // nếu role truyền vào dùng role đó, nếu không dùng roleName của user
        )

    return <PermissionContext.Provider value={{ canAccess, roleName }}>{children}</PermissionContext.Provider>
}

export const usePermission = () => useContext(PermissionContext)
