/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Product } from "@/types/products";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();

  const { user, token, loading: authLoading } = useAuth();

  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!token || user?.role !== "admin") {
      router.push("/products");
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await api.get("/products");

        const products: Product[] = response.data.data;

        const foundProduct = products.find(
          (item) => item._id === productId
        );

        if (!foundProduct) {
          setError("Product not found");
          return;
        }

        setProduct(foundProduct);

        setName(foundProduct.name);
        setCategory(foundProduct.category);
        setPrice(String(foundProduct.price));
        setStock(String(foundProduct.stock));
        setImage(foundProduct.image);
      } catch (error: any) {
        setError(
          error.response?.data?.message ||
            "Failed to load product"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [authLoading, token, user, productId, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!token) {
      return;
    }

    setError("");

    if (!name || !category || !price || !stock || !image) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setSaving(true);

      await api.patch(
        `/products/${productId}`,
        {
          name,
          category,
          price: Number(price),
          stock: Number(stock),
          image,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      router.push("/admin/products");
    } catch (e: any) {
      setError(
        e.response?.data?.message ||
          "Failed to update product"
      );
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <p className="text-sm text-gray-500">
          Loading...
        </p>
      </div>
    );
  }

  if (!token || user?.role !== "admin") {
    return null;
  }

  if (!product) {
    return (
      <main className="max-w-xl mx-auto px-4 py-8">
        <p className="text-sm text-red-600">
          {error || "Product not found"}
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">
        Edit Product
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">
            Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">
            Category
          </label>

          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">
            Price
          </label>

          <input
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">
            Stock
          </label>

          <input
            type="number"
            min="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">
            Image URL
          </label>

          <input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="px-4 py-2 border rounded-md text-sm"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </main>
  );
}