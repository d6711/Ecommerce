import InputCommon from '@components/ui/Input'
import { Box, Button, Checkbox, FormControlLabel } from '@mui/material'
import React, { useContext, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { ToastContext } from '@context/ToastContext'
import { login, register } from '@services/authService'
import { AuthContext } from '@context/AuthContext'
import Cookies from 'js-cookie'

const Login = () => {
    const [isLogin, setIsLogin] = useState(true)
    const { toast } = useContext(ToastContext)
    const [isLoading, setIsLoading] = useState(false)
    const { setUserId } = useContext(AuthContext)

    const navigate = useNavigate()
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            name: Yup.string(),
            email: Yup.string().email('Invalid email address').required('Required'),
            password: Yup.string().required('Required'),
            cfmpassword: Yup.string().oneOf([Yup.ref('password'), null], 'Password not match'),
        }),
        onSubmit: async (values) => {
            if (isLoading) return
            setIsLoading(true)
            if (isLogin) {
                try {
                    const res = await login(values)
                    toast.success(res?.data.message)
                    const {
                        accessToken,
                        refreshToken,
                        userInfo: { _id: userId },
                    } = res.data.metadata
                    setUserId(userId)
                    Cookies.set('accessToken', accessToken)
                    Cookies.set('refreshToken', refreshToken)
                    Cookies.set('userId', userId)
                    setIsLoading(false)
                    navigate('/')
                } catch (error) {
                    toast.error(error.response.data.message)
                    setIsLoading(false)
                }
            } else {
                try {
                    const res = await register(values)
                    toast.success(res?.data.message)
                    setIsLoading(false)
                    setIsLogin(true)
                } catch (error) {
                    toast.error(error.response.data.message)
                    setIsLoading(false)
                }
            }
        },
    })

    const handleResetForm = () => {
        setIsLogin(!isLogin)
        formik.resetForm()
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col p-5 border border-gray-300 shadow-2xl rounded-sm w-[350px]">
                <Box component="form" onSubmit={formik.handleSubmit}>
                    <div className="mb-5 text-2xl font-bold text-center">{isLogin ? 'SIGN IN' : 'SIGN UP'}</div>
                    {!isLogin && <InputCommon id="name" label="Name" type="text" formik={formik} />}
                    <InputCommon id="email" label="Email" type="text" formik={formik} />
                    <InputCommon id="password" label="Password" type="password" formik={formik} />
                    {!isLogin && <InputCommon id="cfmpassword" label="Confirm Password" type="password" formik={formik} />}
                    {isLogin && <FormControlLabel control={<Checkbox />} label="Remember me" />}
                    <Button type="submit" variant="contained" fullWidth>
                        {isLogin ? 'SIGN IN' : 'SIGN UP'}
                    </Button>
                    <div className="flex justify-center gap-2 mt-2">
                        <p>{isLogin ? "Don't have an account" : 'Already have an account?'}</p>
                        <p className="text-blue-600 cursor-pointer hover:underline" onClick={handleResetForm}>
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </p>
                    </div>
                </Box>
            </div>
        </div>
    )
}

export default Login
