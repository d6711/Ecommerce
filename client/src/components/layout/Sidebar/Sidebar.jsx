import Cart from '@components/layout/Sidebar/Cart'
import Compare from '@components/layout/Sidebar/Compare'
import Login from '@components/layout/Sidebar/Login'
import WishList from '@components/layout/Sidebar/WishLish'
import { SidebarContext } from '@contexts/SidebarContext'
import { useContext } from 'react'
import { TfiClose } from 'react-icons/tfi'

function SideBar() {
    const { isOpen, setIsOpen, type } = useContext(SidebarContext)
    const handleToggle = () => {
        setIsOpen(!isOpen)
    }
    const handleRenderContent = () => {
        switch (type) {
            case 'Login':
                return <Login />
            case 'Compare':
                return <Compare />
            case 'Favorites':
                return <WishList />
            case 'My Cart':
                return <Cart />
            default:
                return <Login />
        }
    }
    return (
        <div className="relative">
            {isOpen && (
                <>
                    <div className="fixed inset-0 bg-[#0000004d] z-[100] transition-all duration-500 ease-in-out"></div>
                </>
            )}
            <div
                className={`fixed top-0 right-0 w-[370px] bg-white h-full z-[101] transition-all duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : 'translate-x-[370px]'
                }`}
            >
                {isOpen && (
                    <div
                        className="absolute bg-white rounded-full flex-center w-[35px] h-[35px] top-2.5 left-[-50px]
                     hover:bg-light cursor-pointer transition-all duration-300 ease-in-out"
                        onClick={handleToggle}
                    >
                        <TfiClose />
                    </div>
                )}
                <div className="p-5">{handleRenderContent()}</div>
            </div>
        </div>
    )
}

export default SideBar
