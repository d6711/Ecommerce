import { useContext, useState } from 'react'
import logo from '@assets/images/logo.png'
import { FaBars } from 'react-icons/fa'
import MainLayout from '@components/layout/MainLayout'
import { PiShoppingCart } from 'react-icons/pi'
import { Link } from 'react-router-dom'
import { FaRegUserCircle } from 'react-icons/fa'
import { StoreContext } from '@contexts/StoreContext'
import { IoIosLogOut } from 'react-icons/io'

function Header() {
    const [open, setOpen] = useState(false)
    const { userInfo, handleLogout } = useContext(StoreContext)
    console.log(userInfo?.name)

    return (
        <div className="bg-white border-b border-gray-300">
            <MainLayout>
                <nav className="relative flex items-center justify-between w-full py-4 transition-all">
                    <Link to="/">
                        <img src={logo} width={100} alt="logo" />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="items-center hidden gap-8 sm:flex">
                        <Link to="/">Home</Link>
                        <Link to="/shop">Shop</Link>
                        <Link to="/about">About</Link>
                        <Link to="/contact">Contact</Link>
                        <div className="items-center hidden gap-2 px-3 text-sm border border-gray-300 rounded-full lg:flex">
                            <input
                                className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
                                type="text"
                                placeholder="Search"
                            />
                        </div>
                        <div className="relative cursor-pointer">
                            <PiShoppingCart size={25} />
                            <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
                                3
                            </button>
                        </div>
                        {userInfo ? (
                            <div className="relative flex flex-col cursor-pointer gap-1.5 items-center group justify-center">
                                <FaRegUserCircle size={25} />
                                <div>{userInfo.name}</div>
                                <div
                                    className="absolute top-1/2 flex items-center px-2 py-1 rounded-sm opacity-0 bg-secondary translate-y-0.5 group-hover:translate-y-2 duration-300 transform transition-transform ease-in-out group-hover:opacity-100"
                                    onClick={handleLogout}
                                >
                                    <IoIosLogOut />
                                    <span>Logout</span>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <button className="px-8 py-2 text-white transition rounded-full cursor-pointer bg-primary hover:bg-primary/80">
                                    <Link to="/login">Login</Link>
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setOpen(!open)}
                        aria-label="Menu"
                        className="sm:hidden"
                    >
                        <FaBars />
                    </button>
                </nav>

                {/* Mobile Menu */}
                <div
                    className={`${
                        open ? 'flex' : 'hidden'
                    } md:hidden flex-col items-start gap-2 px-5 py-4 bg-white shadow-md text-sm w-full`}
                >
                    <Link to="/">Home</Link>
                    <Link to="/shop">Shop</Link>
                    <Link to="/about">About</Link>
                    <Link to="/contact">Contact</Link>
                    <Link to="/login">
                        <button className="px-6 py-2 mt-2 text-sm text-white transition rounded-full cursor-pointer bg-primary">
                            Login
                        </button>
                    </Link>
                </div>
            </MainLayout>
        </div>
    )
}

export default Header
