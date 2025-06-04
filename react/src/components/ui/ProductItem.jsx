import { useEffect, useState } from 'react'
import { FaStar } from 'react-icons/fa'
import { AiOutlineShoppingCart } from 'react-icons/ai'

function ProductItem() {
    const [products, setProducts] = useState([])
    const [counts, setCounts] = useState({}) // key: productId

    useEffect(() => {
        fetch('https://dummyjson.com/products')
            .then((res) => res.json())
            .then((data) => setProducts(data.products))
            .catch((err) => console.log(err))
    }, [])

    const handleAdd = (id) => {
        setCounts((prev) => ({ ...prev, [id]: 1 }))
    }

    const increase = (id) => {
        setCounts((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }))
    }

    const decrease = (id) => {
        setCounts((prev) => ({
            ...prev,
            [id]: Math.max((prev[id] || 1) - 1, 0),
        }))
    }

    return (
        <div className="flex flex-wrap gap-4">
            {products.map((product) => {
                const count = counts[product.id] || 0
                const offerPrice = (
                    product.price *
                    (1 - product.discountPercentage / 100)
                ).toFixed(2)

                return (
                    <div
                        key={product.id}
                        className="border border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white min-w-56 max-w-56 w-full"
                    >
                        <div className="group cursor-pointer flex items-center justify-center px-2">
                            <img
                                className="group-hover:scale-105 transition max-w-26 md:max-w-36"
                                src={product.thumbnail}
                                alt={product.title}
                            />
                        </div>
                        <div className="text-gray-500/60 text-sm">
                            <p>{product.category}</p>
                            <p className="text-gray-700 font-medium text-lg truncate w-full">
                                {product.title}
                            </p>
                            <div className="flex items-center gap-0.5">
                                {Array(5)
                                    .fill('')
                                    .map((_, i) =>
                                        product.rating > i ? (
                                            <div
                                                key={i}
                                                className="text-yellow-400"
                                            >
                                                <FaStar />
                                            </div>
                                        ) : (
                                            <FaStar
                                                key={i}
                                                className="text-gray-300"
                                            />
                                        ),
                                    )}
                                <p>({product.rating})</p>
                            </div>
                            <div className="flex items-end justify-between mt-3">
                                <p className="md:text-xl text-base font-medium text-primary">
                                    ${offerPrice}{' '}
                                    <span className="text-gray-500/60 md:text-sm text-xs line-through">
                                        ${product.price}
                                    </span>
                                </p>
                                <div className="text-indigo-500">
                                    {count === 0 ? (
                                        <button
                                            className="flex items-center justify-center gap-1 bg-indigo-100 border border-indigo-300 md:w-[80px] w-[64px] h-[34px] rounded text-indigo-600 font-medium"
                                            onClick={() =>
                                                handleAdd(product.id)
                                            }
                                        >
                                            <AiOutlineShoppingCart />
                                            Add
                                        </button>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-indigo-500/25 rounded select-none">
                                            <button
                                                onClick={() =>
                                                    decrease(product.id)
                                                }
                                                className="cursor-pointer text-md px-2 h-full"
                                            >
                                                -
                                            </button>
                                            <span className="w-5 text-center">
                                                {count}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    increase(product.id)
                                                }
                                                className="cursor-pointer text-md px-2 h-full"
                                            >
                                                +
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default ProductItem
