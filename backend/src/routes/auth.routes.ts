import { Router } from "express";
import { registerUser,login } from "../controller/auth.controller";

const router = Router();

router.post("/register",registerUser);
router.post("/login",login);

export default router;