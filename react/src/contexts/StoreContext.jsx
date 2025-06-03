import { createContext, useState } from 'react'

export const StoreContext = createContext()

export const StoreProvider = ({ children }) => {
    const values = {}
    return (
        <StoreContext.Provider value={values}>{children}</StoreContext.Provider>
    )
}
