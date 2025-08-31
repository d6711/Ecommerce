import { getInfo, logout } from '@src/services/authService'
import Cookies from 'js-cookie'
import { createContext, useEffect, useState } from 'react'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [userId, setUserId] = useState(Cookies.get('userId') || null)
    const [userInfo, setUserInfo] = useState(null)

    const handleLogin = (id, accessToken, refreshToken) => {
        Cookies.set('userId', id)
        Cookies.set('accessToken', accessToken)
        Cookies.set('refreshToken', refreshToken)
        setUserId(id) // trigger useEffect -> fetch userInfo
    }

    const handleLogout = async () => {
        try {
            await logout()
        } catch (e) {
            console.log('logout error', e)
        }

        Cookies.remove('accessToken')
        Cookies.remove('refreshToken')
        Cookies.remove('userId')

        setUserId(null)
        setUserInfo(null)
    }

    useEffect(() => {
        if (userId) {
            getInfo()
                .then((res) => setUserInfo(res.data.metadata))
                .catch((err) => console.log(err))
        }
    }, [userId])

    const values = { userId, userInfo, setUserId, setUserInfo, handleLogin, handleLogout }
    return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}
