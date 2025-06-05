// components/InputField.js
import React from 'react'
import { Form, Input } from 'antd'

const InputField = ({ name, label, rules = [], ...rest }) => {
    return (
        <Form.Item label={label} name={name} rules={rules}>
            <Input {...rest} />
        </Form.Item>
    )
}

export default InputField
