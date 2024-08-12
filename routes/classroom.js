import express from "express";
import ClassroomController from "../controllers/ClassroomController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, ClassroomController.createClassroom);
router.get("/", authMiddleware, ClassroomController.getAllClassrooms);
router.get("/:id", authMiddleware, ClassroomController.getClassroomById);
router.put("/:id", authMiddleware, ClassroomController.updateClassroom);
router.delete("/:id", authMiddleware, ClassroomController.deleteClassroom);
router.post(
  "/assign",
  authMiddleware,
  ClassroomController.assignTeacherToClassroom
);

export default router;
