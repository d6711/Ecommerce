import HeaderSidebar from '@components/layout/Sidebar/HeaderSidebar'
import Button from '@components/ui/Button'
import Input from '@components/ui/Input'
import { useState } from 'react'
import { FaRegUser } from 'react-icons/fa'
function Login() {
    const [isLogin, setIsLogin] = useState(true)

    return (
        <div>
            <HeaderSidebar icon={<FaRegUser />} title={'Login'} />
            <div className="grid grid-cols-2 pb-2.5 cursor-pointer">
                <div className="flex-center" onClick={() => setIsLogin(true)}>
                    LOGIN
                </div>
                <div className="flex-center" onClick={() => setIsLogin(false)}>
                    REGISTER
                </div>
            </div>
            <div className="relative h-[2px] w-full bg-gray-300 mb-2.5">
                <div
                    className={`absolute h-[2px] bg-gray-700 transition-all duration-300 w-1/2 ${
                        isLogin ? ' left-0' : 'left-1/2'
                    }`}
                ></div>
            </div>

            {!isLogin && (
                <Input label={'Name'} isRequired={true} type={'text'} />
            )}
            <Input label={'Email'} isRequired={true} type={'text'} />
            <Input label={'Password'} isRequired={true} type={'password'} />
            {!isLogin && (
                <Input
                    label={'Confirm Password'}
                    isRequired={true}
                    type={'password'}
                />
            )}
            <Button content={isLogin ? 'Login' : 'Register'} />
        </div>
    )
}

export default Login
