import HeaderSidebar from '@components/layout/Sidebar/HeaderSidebar'
import { CiHeart } from 'react-icons/ci'

function WishList() {
    return (
        <div>
            <HeaderSidebar icon={<CiHeart />} title={'WishList'} />
        </div>
    )
}

export default WishList
