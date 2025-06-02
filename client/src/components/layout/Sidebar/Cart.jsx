import HeaderSidebar from '@components/layout/Sidebar/HeaderSidebar'
import { IoCartOutline } from 'react-icons/io5'

function Cart() {
    return (
        <div>
            <HeaderSidebar icon={<IoCartOutline />} title={'Cart'} />
        </div>
    )
}

export default Cart
