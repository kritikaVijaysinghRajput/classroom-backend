import express from "express";
import {
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserById,
  getProfile,
  updateProfile,
} from "../controllers/UserController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", createUser);
router.put("/update/:userId", authMiddleware, updateUser);
router.delete("/delete/:userId", authMiddleware, deleteUser);

router.get("/users", authMiddleware, getAllUsers);
router.get("/users/:id", authMiddleware, getUserById);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

export default router;
