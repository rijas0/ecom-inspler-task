import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

import { Cart } from "../models/Cart";
import { Product } from "../models/Product";

import { addToCartSchema, updateCartItemSchema } from "../schemas/cart.schema";

export const getCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const userId = req.user.userId;
    
    let cart = await Cart.findOne({
      user: userId,
    }).populate("items.product");

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [],
      });

      await cart.populate("items.product");
    }

    let total = 0;

    for (const item of cart.items) {
      const product = item.product as any;
      if (product) {
        total += product.price * item.quantity;
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        cart,
        total,
      },
    });
  } catch (e) {
    next(e);
  }
};

export const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const userId = req.user.userId;
    

    const data = addToCartSchema.parse(req.body);

    if (!mongoose.Types.ObjectId.isValid(data.productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(data.productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    if (product.stock == 0) {
      return res.status(400).json({
        success: false,
        message: "Product is out of stock",
      });
    }

    if (data.quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: "Requested quantity exceeds available stock",
      });
    }

    let cart = await Cart.findOne({
      user: userId,
    });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [
          {
            product: product._id,
            quantity: data.quantity,
          },
        ],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.product.toString() === data.productId,
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + data.quantity;

        if (newQuantity > product.stock) {
          return res.status(400).json({
            success: false,
            message: "Requested quantity exceeds available stock",
          });
        }

        existingItem.quantity = newQuantity;
      } else {
        cart.items.push({
          product: product._id,
          quantity: data.quantity,
        });
      }

      await cart.save();
      await cart.populate("items.product");
      return res.status(200).json({
        success: true,
        message: "Product added to cart",
        data: cart,
      });
    }
  } catch (e) {
    next(e);
  }
};

export const updateCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
   if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const userId = req.user.userId;
    
    const { id } = req.params;

    if (typeof id != "string" || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart item ID",
      });
    }

    const data = updateCartItemSchema.parse(req.body);

    const cart = await Cart.findOne({
      user: userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find((item) => item._id?.toString() === id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    const product = await Product.findById(item.product);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.stock === 0) {
      return res.status(400).json({
        success: false,
        message: "Product is out of stock",
      });
    }

    if (data.quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: "Requested quantity exceeds available stock",
      });
    }

    item.quantity = data.quantity;
    await cart.save();
    await cart.populate("items.product");
    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      data: cart,
    });
  } catch (e) {
    next(e);
  }
};

export const removeCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
   if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const userId = req.user.userId;
    
    const { id } = req.params;

    if (typeof id != "string" || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart item ID",
      });
    }

    const cart = await Cart.findOne({
      user: userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find((item) => item._id?.toString() === id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    cart.items = cart.items.filter((item) => item._id?.toString() !== id);

    await cart.save();

    await cart.populate("items.product");

    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: cart,
    });
  } catch (e) {
    next(e);
  }
};
