/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Product } from "@/types/products";

export default function AdminProductsPage() {
  const router = useRouter();

  const { user, token, loading: authLoading } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/products");

      setProducts(response.data.data);
    } catch (e: any) {
      setError(
        e.response?.data?.message ||
          "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!token || user?.role !== "admin") {
      router.push("/products");
      return;
    }

    fetchProducts();
  }, [token, user, authLoading]);

  const deleteProduct = async (id: string) => {
    if (!token) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchProducts();
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Failed to delete product"
      );
    }
  };

  if (authLoading || loading) {
    return <p>Loading...</p>;
  }

  if (!token || user?.role !== "admin") {
    return null;
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">
          Manage Products
        </h1>

        <button
          onClick={() => router.push("/admin/products/new")}
          className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md"
        >
          Add Product
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 mb-4">
          {error}
        </p>
      )}

      <div className="space-y-3">
        {products.map((product) => (
          <div
            key={product._id}
            className="flex items-center justify-between border rounded-lg p-4"
          >
            <div>
              <h2 className="font-medium">
                {product.name}
              </h2>

              <p className="text-sm text-gray-500">
                {product.category} · ₹{product.price} · Stock:{" "}
                {product.stock}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() =>
                  router.push(
                    `/admin/products/${product._id}/edit`
                  )
                }
                className="px-3 py-1.5 border rounded text-sm"
              >
                Edit
              </button>

              <button
                onClick={() => deleteProduct(product._id)}
                className="px-3 py-1.5 text-red-600 border border-red-200 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}