function MainLayout({ children }) {
    return (
        <div className="flex justify-center">
            <div className="w-[1410px]">{children}</div>
        </div>
    )
}

export default MainLayout
