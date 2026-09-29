/* eslint-disable @next/next/no-img-element */
import { Product } from "@/types/products";
import Image from "next/image";

interface ProductCardProps{
    product:Product
}
export default function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = product.stock === 0;

  return (
    <div className="border rounded-lg p-3 bg-white shadow-sm flex flex-col justify-between max-w-lg ">
      <div>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-28 object-cover rounded-md mb-2"
        />
        <span className="text-[10px] text-gray-400 uppercase tracking-wider">{product.category}</span>
        <h2 className="text-sm font-medium text-gray-900 truncate">{product.name}</h2>
        <p className="text-sm font-semibold text-gray-900 mt-0.5">₹{product.price}</p>
      </div>

      <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
        <span className="text-[11px] text-gray-500">
          {isOutOfStock ? "Out of stock" : `${product.stock} left`}
        </span>

        <button
          disabled={isOutOfStock}
          className="px-2.5 py-1 bg-gray-900 text-white text-[11px] font-medium rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isOutOfStock ? "Unavailable" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}