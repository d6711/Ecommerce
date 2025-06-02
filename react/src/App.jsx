import React, { Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import routers from './routes'

function App() {
    return (
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
    )
}

export default App
