import React, { Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import routers from './routes'
import { StoreProvider } from '@contexts/StoreContext'
import { ToastProvider } from '@contexts/ToastContext'

function App() {
    return (
        <ToastProvider>
            <StoreProvider>
                <BrowserRouter>
                    <Suspense>
                        <Routes fallback={<div>Loading...</div>}>
                            {routers.map((item, index) => {
                                return (
                                    <Route
                                        key={index}
                                        path={item.path}
                                        element={<item.component />}
                                    />
                                )
                            })}
                        </Routes>
                    </Suspense>
                </BrowserRouter>
            </StoreProvider>
        </ToastProvider>
    )
}

export default App
