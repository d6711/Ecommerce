import { FaChevronDown } from 'react-icons/fa6'

function Widget({ label, options }) {
    return (
        <div className="relative font-bold cursor-pointer group">
            <div className="flex-center gap-2.5">
                <span>{label}</span>
                <FaChevronDown />
            </div>

            {/* Dropdown menu */}
            <ul className="absolute z-10 invisible mt-4 text-black transition-all duration-300 ease-in-out translate-y-2 bg-white shadow-2xl opacity-0 top-full w-max group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
                {options.map((option, index) => (
                    <li
                        key={index}
                        className="pl-2 pr-5 py-1.5 hover:bg-light whitespace-nowrap"
                    >
                        {option}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Widget
