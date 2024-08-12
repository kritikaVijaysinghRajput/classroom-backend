import express from "express";
import { register, login } from "../controllers/Auth.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { getAllUsers } from "../controllers/UserController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/users", authMiddleware, getAllUsers);

export default router;
