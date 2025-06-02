import MainLayout from '@components/layout/MainLayout'
import logo from '@assets/images/logo.webp'

import { FaRegUser } from 'react-icons/fa'
import { BsFillBarChartFill } from 'react-icons/bs'
import { CiHeart } from 'react-icons/ci'
import { IoCartOutline } from 'react-icons/io5'
import { FiPhoneCall } from 'react-icons/fi'
import BoxIcon from '@components/layout/Header/BoxIcon'
import InputSearch from '@components/layout/Header/InputSearch'
import Catalog from '@components/layout/Header/Catalog'
import Navigation from '@components/layout/Header/Navigation'
import Widget from '@components/layout/Header/Widget'
import { useContext } from 'react'
import { SidebarContext } from '@contexts/SidebarContext'

const boxIcon = [
    { icon: <FaRegUser size={22} />, name: 'Login' },
    { icon: <BsFillBarChartFill size={22} />, name: 'Compare', count: 1 },
    { icon: <CiHeart size={22} />, name: 'Favorites', count: 1 },
    { icon: <IoCartOutline size={22} />, name: 'My Cart', count: 0 },
]

const navigation = [
    { name: 'Home', link: '/' },
    { name: 'Shop', link: '/shop' },
    { name: 'Blog', link: '/blog' },
    { name: 'About', link: '/about' },
    { name: 'Contact', link: '/contact' },
]

const languages = ['Vietnamese', 'English']
const currencies = ['USD', 'VND']

function Header() {
    const { setIsOpen, setType } = useContext(SidebarContext)
    const handleOpenSideBar = (type) => {
        setIsOpen(true)
        setType(type)
    }
    return (
        <>
            <MainLayout>
                <div className="flex-between py-2.5">
                    {/* logo */}
                    <a href="">
                        <img src={logo} width={166} alt="logo" />
                    </a>
                    <InputSearch />
                    <div className="gap-3 py-2 px-3.5 rounded-xl border flex-center border-light">
                        <FiPhoneCall size={30} color="green" />
                        <div className="flex-col cursor-pointer flex-center">
                            <span className="text-third">
                                Need help ? Call us
                            </span>
                            <span>+1 1800 212 3434</span>
                        </div>
                    </div>

                    {/* BoxIcon */}
                    {boxIcon.map((boxIcon, index) => (
                        <div
                            className="gap-6 cursor-pointer flex-center"
                            key={index}
                            onClick={() => handleOpenSideBar(boxIcon.name)}
                        >
                            <BoxIcon
                                icon={boxIcon.icon}
                                name={boxIcon.name}
                                count={boxIcon.count}
                            />
                        </div>
                    ))}
                </div>
            </MainLayout>
            <div className="bg-secondary">
                <MainLayout>
                    <div className="py-2 flex-between">
                        <div className="gap-5 flex-center">
                            <Catalog />
                            <div className="flex-center">
                                {navigation.map((nav, index) => (
                                    <Navigation
                                        key={index}
                                        name={nav.name}
                                        link={nav.link}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="gap-5 flex-center">
                            <Widget label={'English'} options={languages} />
                            <Widget label={'VND'} options={currencies} />
                        </div>
                    </div>
                </MainLayout>
            </div>
        </>
    )
}

export default Header
