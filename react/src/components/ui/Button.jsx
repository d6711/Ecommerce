function Button({ content, isPrimary = false }) {
    const primaryClass = isPrimary
        ? 'bg-primary hover:text-black hover:bg-white'
        : 'bg-black hover:text-white hover:bg-primary'
    return (
        <button
            type="submit"
            className={`active:scale-95 w-full h-10 px-20 font-bold text-white transition-all duration-300 ease-in-out flex-center rounded-sm ${primaryClass}`}
        >
            {content}
        </button>
    )
}

export default Button
