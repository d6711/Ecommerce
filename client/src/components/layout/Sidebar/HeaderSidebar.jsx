function HeaderSidebar({ icon, title }) {
    return (
        <div className="flex justify-center gap-2.5 pb-3.5 mb-3.5 border-b border-b-light">
            <div className="text-2xl">{icon}</div>
            <div className="text-xl uppercase text-third">{title}</div>
        </div>
    )
}

export default HeaderSidebar
