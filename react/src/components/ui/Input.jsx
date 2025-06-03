import { useState } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'

function Input({ label, type, ...props }) {
    const { formik, id } = props
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'
    const isShowPassword = isPassword && showPassword ? 'text' : type
    const isError = formik.touched[id] && formik.errors[id]
    const messageError = formik.errors[id]

    return (
        <div className="w-full mb-5">
            <div className="relative">
                {label}
                <input
                    type={isShowPassword}
                    className="w-full h-[42px] text-sm border border-secondary rounded-sm px-2.5"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values[id]}
                    {...props}
                />
                {isPassword && (
                    <div
                        className="absolute top-9 right-2.5"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                    </div>
                )}
            </div>
            {isError && (
                <div className="italic text-red-500">{messageError}</div>
            )}
        </div>
    )
}

export default Input
