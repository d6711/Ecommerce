import { CiGrid41 } from 'react-icons/ci'
import { FaChevronDown } from 'react-icons/fa6'

function Catalog() {
    return (
        <div className="relative gap-2 group p-2 bg-white hover:bg-primary hover:text-white duration-300 ease-in-out flex items-center rounded-xl w-[240px]">
            <div className="p-1.5 bg-primary text-white rounded-xl">
                <CiGrid41 size={20} />
            </div>
            <span className="font-bold">All Categories</span>
            <div className="absolute right-2.5 group-hover:rotate-180 font-light transform transition-transform duration-300 ease-in-out">
                <FaChevronDown />
            </div>
        </div>
    )
}

export default Catalog
