import AccountMenu from '@components/ui/Avatar'
import { Search } from 'lucide-react'
import React from 'react'

const Header = () => {
    return (
        <div className="bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center space-x-4">
                    <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
                </div>

                <div className="flex items-center space-x-4">
                    <AccountMenu />
                </div>
            </div>
        </div>
    )
}

export default Header
