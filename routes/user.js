import express from "express";
import {
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserById,
  getStudents,
  updateProfile,
  getTeachers,
  deleteTeacher,
  deleteStudent,
} from "../controllers/UserController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", createUser);
router.put("/update/:userId", authMiddleware, updateUser);

router.get("/users", authMiddleware, getAllUsers);
router.get("/users/:id", authMiddleware, getUserById);
router.get("/students", authMiddleware, getStudents);
router.get("/teachers", authMiddleware, getTeachers);
router.delete("/teachers/:teacherId", authMiddleware, deleteTeacher);
router.delete("/students/:studentId", authMiddleware, deleteStudent);
router.put("/update/:teacherId", authMiddleware, updateUser);
router.put("/update/:studentId", authMiddleware, updateUser);

router.put("/profile", authMiddleware, updateProfile);

export default router;
