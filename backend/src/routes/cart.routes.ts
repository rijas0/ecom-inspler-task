import { Router } from "express";

import {getCart,addToCart,updateCartItem,removeCartItem} from '../controller/cart.controller';

import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/",authenticate,getCart);
router.post("/",authenticate,addToCart);
router.patch("/:id",authenticate,updateCartItem);
router.delete("/:id",authenticate,removeCartItem);

export default router;