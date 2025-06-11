import { getInfo, logout } from '@services/authService'
import Cookies from 'js-cookie'
import { createContext, useEffect, useState } from 'react'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [userId, setUserId] = useState(Cookies.get('userId'))
    const [userInfo, setUserInfo] = useState(null)

    const handleLogout = async () => {
        await logout()

        Cookies.remove('accessToken')
        Cookies.remove('refreshToken')
        Cookies.remove('userId')

        setUserInfo(null)
        window.location.reload()
    }

    useEffect(() => {
        if (userId) {
            getInfo()
                .then((res) => setUserInfo(res.data.metadata))
                .catch((err) => console.log(err))
        }
    }, [userId])

    const values = { setUserId, userInfo, setUserInfo, handleLogout }
    return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}
