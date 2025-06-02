import { useState } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'

function Input({ label, type, isRequired = false, ...props }) {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'
    const isShowPassword = isPassword && showPassword ? 'text' : type

    const handleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    return (
        <div className="mb-5">
            <div className="mb-1.5">
                {label} {isRequired && <span>*</span>}
            </div>
            <div className="relative">
                <input
                    type={isShowPassword}
                    className="h-10 px-4 border border-light focus:outline-third rounded-sm w-full"
                />
                {isPassword && (
                    <div
                        className="absolute top-2 right-2 cursor-pointer text-xl"
                        onClick={handleShowPassword}
                    >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Input
