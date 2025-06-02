function Button({ content, isPrimary = false }) {
    const primaryClass = isPrimary
        ? 'bg-primary hover:text-primary hover:bg-white'
        : 'bg-black hover:text-white hover:bg-primary'
    return (
        <button
            className={`w-full h-10 px-20 font-bold text-white transition-all duration-300 ease-in-out flex-center rounded-xl ${primaryClass}`}
        >
            {content}
        </button>
    )
}

export default Button
