import { useContext, useEffect, useState } from 'react'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { ToastContext } from '@contexts/ToastContext'
import Input from '@components/ui/Input'
import { getInfo, login, register } from '@services/authService'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { StoreContext } from '@contexts/StoreContext'

function Login() {
    const [isLogin, setIsLogin] = useState(true)
    const { toast } = useContext(ToastContext)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const { setUserId } = useContext(StoreContext)

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            name: Yup.string(),
            email: Yup.string()
                .email('Invalid email address')
                .required('Required'),
            password: Yup.string().required('Required'),
            cfmpassword: Yup.string().oneOf(
                [Yup.ref('password'), null],
                'Password not match',
            ),
        }),
        onSubmit: async (values) => {
            if (isLoading) return
            setIsLoading(true)
            if (isLogin) {
                try {
                    const res = await login(values)
                    toast.success(res.data.message)
                    const {
                        accessToken,
                        refreshToken,
                        userInfo: { userId },
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
                    toast.success(res.data.message)
                    setIsLoading(false)
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
        <div className="fixed inset-0 flex items-center justify-center bg-light">
            <div className="flex flex-col items-center justify-center px-10 py-5 mx-auto bg-white shadow-2xl rounded-2xl">
                <form
                    className="flex flex-col items-center justify-center md:w-96 w-80"
                    onSubmit={formik.handleSubmit}
                >
                    <h2 className="text-4xl font-medium text-gray-900">
                        {isLogin ? 'Login' : 'Sign up'}
                    </h2>
                    {!isLogin && (
                        <Input
                            id="name"
                            label="Name"
                            type="text"
                            formik={formik}
                        />
                    )}
                    <Input
                        id="email"
                        label="Email"
                        type="text"
                        formik={formik}
                    />
                    <Input
                        id="password"
                        label="Password"
                        type="password"
                        formik={formik}
                    />
                    {!isLogin && (
                        <Input
                            id="cfmpassword"
                            label="Confirm Password"
                            type="password"
                            formik={formik}
                        />
                    )}

                    <div className="flex items-center justify-between w-full mt-8 text-gray-500/80">
                        <div className="flex items-center gap-2">
                            <input className="h-5" type="checkbox" />
                            <label className="text-sm">Remember me</label>
                        </div>
                        <a className="text-sm underline">Forgot password?</a>
                    </div>
                    <button
                        type="submit"
                        className="w-full mt-8 text-white transition-opacity rounded-full cursor-pointer h-11 bg-primary hover:opacity-90"
                    >
                        {isLoading
                            ? 'Loading...'
                            : isLogin
                            ? 'Login'
                            : 'Register'}
                    </button>
                    <div className="flex mt-4 text-sm cursor-pointer text-gray-500/90">
                        {isLogin
                            ? "Don't have an account?"
                            : 'Have an account?'}
                        <div
                            className="text-primary ml-1.5"
                            onClick={() => handleResetForm()}
                        >
                            {isLogin ? 'Sign up' : 'Sign in'}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
