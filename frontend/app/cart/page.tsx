/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Cart } from "@/types/cart";

export default function CartPage() {
  const router = useRouter();

  const { token, loading: authLoading } = useAuth();

  const [cart, setCart] = useState<Cart | null>(null);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [itemError, setItemError] = useState<{
    id: string;
    message: string;
  } | null>(null);

  const fetchCart = async () => {
    if (!token) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.get("/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCart(response.data.data.cart);
      setTotal(response.data.data.total);
    } catch (e: any) {
      setError(e.response?.data?.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!token || quantity < 1) {
      return;
    }

    try {
      setItemError(null);

      await api.patch(
        `/cart/${itemId}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await fetchCart();
    } catch (error: any) {
      setItemError({
        id: itemId,
        message: error.response?.data?.message || "Failed to update quantity",
      });
    }
  };

  const removeItem = async (itemId: string) => {
    if (!token) {
      return;
    }

    try {
      setError("");

      await api.delete(`/cart/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchCart();
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to remove item");
    }
  };

  useEffect(() => {
    if (!authLoading && !token) {
      router.push("/login");
      return;
    }

    if (token) {
      fetchCart();
    }
  }, [token, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
        Loading cart...
      </div>
    );
  }

  if (!token) {
    return null;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-12 text-center">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Your Cart</h1>

        <p className="text-sm text-gray-500">Your cart is empty.</p>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Your Cart</h1>

      <div className="space-y-3">
        {cart.items.map((item) => (
          <div
            key={item._id}
            className="p-3 border rounded-lg bg-white shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded-md border"
                />

                <div>
                  <h2 className="text-sm font-medium text-gray-900">
                    {item.product.name}
                  </h2>

                  <p className="text-xs text-gray-500 mt-0.5">
                    ₹{item.product.price}
                  </p>
                </div>
              </div>

              <p className="text-sm font-semibold text-gray-900">
                ₹{item.product.price * item.quantity}
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  disabled={item.quantity === 1}
                  className="w-7 h-7 border rounded text-sm disabled:opacity-40"
                >
                  -
                </button>

                <span className="text-sm min-w-5 text-center">
                  {item.quantity}
                </span>

                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  disabled={item.quantity >= item.product.stock}
                  className="w-7 h-7 border rounded text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeItem(item._id)}
                className="text-xs text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </div>
            {itemError?.id === item._id && (
              <p className="text-xs text-red-600 mt-2">{itemError.message}</p>
            )}

            {item.quantity >= item.product.stock && (
              <p className="text-xs text-red-500 mt-2">
                Maximum available quantity reached
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-900">Total</span>

        <span className="text-base font-semibold text-gray-900">₹{total}</span>
      </div>
    </main>
  );
}