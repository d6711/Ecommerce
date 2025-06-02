import { PiShoppingCart } from 'react-icons/pi'

function SideBar() {
    return (
        <div className="flex gap-10">
            <div className="relative cursor-pointer">
                <PiShoppingCart size={25} />
                <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
                    3
                </button>
            </div>
            <div className="relative cursor-pointer">
                <PiShoppingCart size={25} />
                <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
                    3
                </button>
            </div>
            <div className="relative cursor-pointer">
                <PiShoppingCart size={25} />
                <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
                    3
                </button>
            </div>
        </div>
    )
}

export default SideBar
