function BoxIcon({ icon, name, count }) {
    console.log(count)
    return (
        <div className="relative flex-col flex-between rounded-2xl hover:bg-secondary p-2.5">
            <div>{icon}</div>
            <div className="mt-1.5 text-sm">{name}</div>
            {count >= 0 && (
                <span className="absolute text-[10px] px-1.5 text-white rounded-full bg-primary right-5">
                    {count}
                </span>
            )}
        </div>
    )
}

export default BoxIcon
