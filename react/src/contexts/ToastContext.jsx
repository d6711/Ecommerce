import { createContext } from 'react'
import toast, { Toaster } from 'react-hot-toast'

export const ToastContext = createContext()

export const ToastProvider = ({ children }) => {
    const value = { toast }
    return (
        <ToastContext.Provider value={value}>
            {children}
            <Toaster />
        </ToastContext.Provider>
    )
}
