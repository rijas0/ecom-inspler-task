import Link from "next/link";

export default function Home() {
  return (
   <main className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-zinc-900">
          E-Commerce Store
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          Browse products and manage your cart.
        </p>

        <Link
          href="/products"
          className="inline-block mt-6 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Browse Products
        </Link>
      </div>
    </main>
  );
}
