import { Router } from "express";
import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controller/product.controller';

import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.middleware";

const router = Router();

router.get("/",getProducts);
router.post("/",authenticate,requireAdmin,createProduct);
router.patch("/:id",authenticate,requireAdmin,updateProduct);
router.delete("/:id",authenticate,requireAdmin,deleteProduct);

export default router;