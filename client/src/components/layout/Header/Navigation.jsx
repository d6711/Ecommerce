function Navigation({ name, link }) {
    return (
        <div className="flex-center">
            <a
                href={link}
                className="p-2.5 mx-2.5 hover:bg-white hover:text-primary rounded-sm transition-all duration-200 ease-in font-bold"
            >
                {name}
            </a>
        </div>
    )
}

export default Navigation
