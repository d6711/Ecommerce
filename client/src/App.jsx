import MainLayout from '@components/layout/MainLayout'
import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

const App = () => {
    return (
        <Router>
            <MainLayout />
        </Router>
    )
}

export default App
