import { createContext, useState } from 'react'

export const SidebarContext = createContext()

export const SidebarProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [type, setType] = useState('')
    const values = { isOpen, setIsOpen, type, setType }
    return (
        <SidebarContext.Provider value={values}>
            {children}
        </SidebarContext.Provider>
    )
}
