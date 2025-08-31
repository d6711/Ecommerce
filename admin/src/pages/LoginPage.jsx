import React, { useContext } from 'react'
import { Button, Checkbox, Form, Grid, Input, theme, Typography } from 'antd'
import { LockOutlined, MailOutlined, UserAddOutlined } from '@ant-design/icons'
import { useToast } from '@src/context/ToastContext'
import { AuthContext } from '@src/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { login, register } from '@src/services/authService'

const { useToken } = theme
const { useBreakpoint } = Grid
const { Text, Title } = Typography

function LoginPage() {
    const [isLogin, setIsLogin] = React.useState(true)
    const toast = useToast()
    const [isLoading, setIsLoading] = React.useState(false)

    const navigate = useNavigate()

    const { token } = useToken()
    const screens = useBreakpoint()

    const [form] = Form.useForm()

    const { setUserId, setUserInfo } = useContext(AuthContext)

    const onFinish = async (values) => {
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

                // Lưu token + userId vào cookie
                Cookies.set('accessToken', accessToken)
                Cookies.set('refreshToken', refreshToken)
                Cookies.set('userId', userId)

                setUserId(userId)

                // 👇 Gọi API getInfo luôn để cập nhật userInfo
                const info = await getInfo()
                setUserInfo(info.data.metadata)

                setIsLoading(false)
                navigate('/')
            } catch (error) {
                toast.error(error.response?.data?.message || 'Login failed')
                setIsLoading(false)
            }
        } else {
            try {
                const res = await register(values)
                toast.success(res?.data.message)
                setIsLoading(false)
                setIsLogin(true)
            } catch (error) {
                toast.error(error.response?.data?.message || 'Register failed')
                setIsLoading(false)
            }
        }
    }

    const styles = {
        container: {
            margin: '0 auto',
            padding: screens.md ? `${token.paddingXL}px` : `${token.sizeXXL}px ${token.padding}px`,
            width: '380px',
        },
        footer: {
            marginTop: token.marginLG,
            textAlign: 'center',
            width: '100%',
        },
        forgotPassword: {
            float: 'right',
        },
        header: {
            marginBottom: token.marginXL,
        },
        section: {
            alignItems: 'center',
            backgroundColor: token.colorBgContainer,
            display: 'flex',
            height: screens.sm ? '100vh' : 'auto',
            padding: screens.md ? `${token.sizeXXL}px 0px` : '0px',
        },
        text: {
            color: token.colorTextSecondary,
        },
        title: {
            fontSize: screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3,
        },
        toggleLink: {
            color: token.colorPrimary,
            cursor: 'pointer',
            marginLeft: 4,
        },
    }

    return (
        <section style={styles.section}>
            <div style={styles.container}>
                <div style={styles.header}>
                    <Title style={styles.title}>{isLogin ? 'Sign In' : 'Sign Up'}</Title>
                    <Text style={styles.text}>
                        {isLogin
                            ? 'Welcome back! Please sign in to your account.'
                            : 'Create your account and join us today.'}
                    </Text>
                </div>

                <Form
                    form={form}
                    name={isLogin ? 'login_form' : 'signup_form'}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    layout="vertical"
                    requiredMark="optional"
                >
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                type: 'email',
                                required: true,
                                message: 'Please input your Email!',
                            },
                        ]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Email" />
                    </Form.Item>

                    {!isLogin && (
                        <Form.Item
                            name="name"
                            rules={[
                                {
                                    type: 'string',
                                    required: true,
                                    message: 'Please input your Name!',
                                },
                            ]}
                        >
                            <Input prefix={<UserAddOutlined />} placeholder="Name" />
                        </Form.Item>
                    )}

                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Password!',
                            },
                        ]}
                        hasFeedback
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                    </Form.Item>

                    {/* Confirm password chỉ hiện khi signup */}
                    {!isLogin && (
                        <Form.Item
                            name="confirmPassword"
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Please confirm your Password!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve()
                                        }
                                        return Promise.reject(new Error('Passwords do not match!'))
                                    },
                                }),
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
                        </Form.Item>
                    )}

                    {isLogin && (
                        <Form.Item>
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>
                            <span style={styles.forgotPassword}>
                                <a href="#">Forgot password?</a>
                            </span>
                        </Form.Item>
                    )}

                    <Form.Item style={{ marginBottom: 0 }}>
                        <Button block type="primary" htmlType="submit">
                            {isLogin ? 'Log in' : 'Sign up'}
                        </Button>

                        <div style={styles.footer}>
                            <Text style={styles.text}>
                                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                            </Text>
                            <span
                                style={styles.toggleLink}
                                onClick={() => {
                                    setIsLogin(!isLogin)
                                    form.resetFields() // clear form khi đổi mode
                                }}
                            >
                                {isLogin ? 'Sign up now' : 'Sign in'}
                            </span>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </section>
    )
}

export default LoginPage
