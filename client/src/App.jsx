import { SidebarProvider } from '@contexts/SidebarContext'
import { Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import routers from './routes/index'
import SideBar from '@components/layout/Sidebar/Sidebar'

function App() {
    return (
        <SidebarProvider>
            <SideBar />
            <BrowserRouter>
                <Suspense>
                    <Routes fallback={<div>Loading...</div>}>
                        {routers.map((route, index) => (
                            <Route
                                key={index}
                                path={route.path}
                                element={<route.component />}
                            />
                        ))}
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </SidebarProvider>
    )
}

export default App
