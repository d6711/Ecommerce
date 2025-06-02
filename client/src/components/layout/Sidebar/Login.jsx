import HeaderSidebar from '@components/layout/Sidebar/HeaderSidebar'
import { useState } from 'react'
import { FaRegUser } from 'react-icons/fa'
function Login() {
    const [isLogin, setIsLogin] = useState(true)

    return (
        <div>
            <HeaderSidebar icon={<FaRegUser />} title={'Login'} />
            <div className="grid grid-cols-2 pb-2.5 cursor-pointer">
                <div className="flex-center" onClick={() => setIsLogin(true)}>
                    SIGN IN
                </div>
                <div className="flex-center" onClick={() => setIsLogin(false)}>
                    SIGN UP
                </div>
            </div>
            <div className="relative h-[2px] w-full bg-gray-300 pb-2.5">
                <div
                    className={`absolute h-[2px] bg-gray-700 transition-all duration-300 w-1/2 ${
                        isLogin ? ' left-0' : 'left-1/2'
                    }`}
                ></div>
            </div>
        </div>
    )
}

export default Login
