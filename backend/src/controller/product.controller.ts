import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

import { Product } from "../models/Product";
import {
  createProductSchema,
  updateProductSchema,
} from "../schemas/product.schema";

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { search, minPrice, maxPrice, sort } = req.query;

    const queryFilter: any = {};
    if (search) {
      queryFilter.name = {
        $regex: search,
        $options: "i",
      };
    }

    if (minPrice || maxPrice) {
      queryFilter.price = {};

      if (minPrice) {
        queryFilter.price.$gte = Number(minPrice);
      }
      if (maxPrice) {
        queryFilter.price.$lte = Number(maxPrice);
      }
    }

    let sortBy: any = { createdAt: -1 };

    if (sort === "price_asc") {
      sortBy = { price: 1 };
    }
    if (sort === "price_desc") {
      sortBy = { price: -1 };
    }

    const products = await Product.find(queryFilter).sort(sortBy);
    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (e) {
    next(e);
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = createProductSchema.parse(req.body);
    const product = await Product.create(data);
    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (e) {
    next(e);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      });
    }
    const data = updateProductSchema.parse(req.body);
    const product = await Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (e) {
    next(e);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (e) {
    next(e);
  }
};
