import { getInfo, logout } from '@services/authService'
import Cookies from 'js-cookie'
import { createContext, useEffect, useState } from 'react'

export const StoreContext = createContext()

export const StoreProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null)
    const [userId, setUserId] = useState(Cookies.get('userId'))
    const handleLogout = async () => {
        await logout()
        Cookies.remove('accessToken')
        Cookies.remove('refreshToken')
        Cookies.remove('userId')
        setUserInfo(null)
        window.location.reload()
    }

    useEffect(() => {
        if (userId)
            getInfo()
                .then((res) => setUserInfo(res.data.metadata))
                .catch((err) => console.log(err))
    }, [userId])
    const values = { userInfo, setUserInfo, handleLogout, setUserId }
    return (
        <StoreContext.Provider value={values}>{children}</StoreContext.Provider>
    )
}
