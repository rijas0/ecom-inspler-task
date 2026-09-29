/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const router = useRouter();

  const { user, token, logout } = useAuth();

  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {
    if (!token) {
      setCartCount(0);
      return;
    }

    try {
      const response = await api.get("/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const items = response.data.data.cart.items;

      const count = items.reduce(
        (total: number, item: any) => total + item.quantity,
        0
      );

      setCartCount(count);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, [token]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="border-b bg-white">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href="/products"
          className="font-semibold text-gray-900"
        >
          Store
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link
            href="/products"
            className="text-gray-600 hover:text-gray-900"
          >
            Products
          </Link>

          {token && (
            <Link
              href="/cart"
              className="text-gray-600 hover:text-gray-900"
            >
              Cart ({cartCount})
            </Link>
          )}

          {user ? (
            <>
              <span className="text-gray-500">
                {user.name}
              </span>

              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="text-gray-600 hover:text-gray-900"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}