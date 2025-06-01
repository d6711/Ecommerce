import { BsSearch } from 'react-icons/bs'

function InputSearch() {
    return (
        <div className="flex-center">
            <input
                type="text"
                className="w-[570px] border-2 border-r-0 border-light h-[47px] px-4 rounded-s-lg focus:outline-primary"
                placeholder="Search"
            />
            <button
                type="submit"
                className="w-12 h-12 cursor-pointer flex-center bg-primary rounded-e-lg"
            >
                <BsSearch size={25} color="white" />
            </button>
        </div>
    )
}

export default InputSearch
