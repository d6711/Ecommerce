import React, { useState, useEffect } from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input, Flex, message } from 'antd'
import { Link } from 'react-router-dom'
import styles from './styles.module.scss'
import { useMessageContext } from '@contexts/MessageContext'

const Login = () => {
  const { container, buttonLogin, convert, formLayout } = styles
  const [isLogin, setIsLogin] = useState(true)
  const [form] = Form.useForm()
  const message = useMessageContext()
  console.log(isLogin)

  const onFinish = (values) => {
    console.log('Form submitted:', values)
  }

  useEffect(() => {
    form.resetFields()
  }, [isLogin])

  return (
    <div className={container}>
      <div className={formLayout}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>{isLogin ? 'LOGIN' : 'REGISTER'}</h2>

        <Form
          form={form}
          name={isLogin ? 'LOGIN' : 'REGISTER'}
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          {!isLogin && (
            <Form.Item name="name" rules={[{ required: true, message: 'Vui lòng điền tên!' }]}>
              <Input prefix={<UserOutlined />} placeholder="Name" />
            </Form.Item>
          )}

          <Form.Item name="email" rules={[{ required: true, message: 'Vui lòng điền email!' }]}>
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng điền mật khẩu!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          {!isLogin && (
            <Form.Item
              name="confirm"
              dependencies={['password']}
              hasFeedback
              rules={[
                { required: true, message: 'Nhập lại mật khẩu' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) return Promise.resolve()
                    return Promise.reject(new Error('Mật khẩu không khớp!'))
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Confirm password" />
            </Form.Item>
          )}

          {isLogin && (
            <Form.Item>
              <Flex justify="space-between" align="center">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <Link to="/forgot-password">Forgot Password</Link>
              </Flex>
            </Form.Item>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {isLogin ? 'Log in' : 'Register'}
            </Button>
          </Form.Item>
        </Form>
        <div className={buttonLogin}>
          <div>{isLogin ? "Don't have an account?" : 'Already have an account?'}</div>
          <button className={convert} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Register' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
