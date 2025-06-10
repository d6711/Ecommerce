import { Search } from 'lucide-react'
import React from 'react'

const Header = () => {
    return (
        <div className="bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center space-x-4">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        Dashboard
                    </h2>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Search Bar */}
                    <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2">
                        <Search size={18} className="text-gray-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-transparent outline-none text-sm w-64"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header
