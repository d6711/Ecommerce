import HeaderSidebar from '@components/layout/Sidebar/HeaderSidebar'
import { BsFillBarChartFill } from 'react-icons/bs'

function Compare() {
    return (
        <div>
            <HeaderSidebar icon={<BsFillBarChartFill />} title={'Compare'} />
        </div>
    )
}

export default Compare
