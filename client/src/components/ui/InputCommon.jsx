import { Visibility, VisibilityOff } from '@mui/icons-material'
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material'
import React, { useState } from 'react'

const InputCommon = ({ label, type, ...props }) => {
    const { formik, id } = props
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'
    const isShowPassword = isPassword && showPassword ? 'text' : type
    const isError = formik.touched[id] && formik.errors[id]
    const messageError = formik.errors[id]

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    }
    const endAdornment = isPassword ? (
        <InputAdornment position="end">
            <IconButton onClick={handleClickShowPassword} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
        </InputAdornment>
    ) : null

    return (
        <FormControl fullWidth size="small" className="mb-5" variant="outlined">
            <InputLabel>{label}</InputLabel>
            <OutlinedInput
                type={isShowPassword}
                endAdornment={endAdornment}
                label={label}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values[id]}
                {...props}
            />
            {isError && <div className="italic text-red-500">{messageError}</div>}
        </FormControl>
    )
}

export default InputCommon
