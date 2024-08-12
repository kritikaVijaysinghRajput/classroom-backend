import Classroom from "../models/Classroom.js";
import User from "../models/User.js";

const createClassroom = async (req, res) => {
  try {
    const { name, startTime, endTime, days } = req.body;

    if (!name || !startTime || !endTime || !days) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newClassroom = new Classroom({
      name,
      startTime,
      endTime,
      days,
    });

    const savedClassroom = await newClassroom.save();
    res.status(201).json(savedClassroom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllClassrooms = async (req, res) => {
  try {
    const classrooms = await Classroom.find();
    res.status(200).json(classrooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getClassroomById = async (req, res) => {
  try {
    const { id } = req.params;
    const classroom = await Classroom.findById(id);

    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    res.status(200).json(classroom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateClassroom = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedClassroom = await Classroom.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedClassroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    res.status(200).json(updatedClassroom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteClassroom = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedClassroom = await Classroom.findByIdAndDelete(id);

    if (!deletedClassroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    res.status(200).json({ message: "Classroom deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const assignTeacherToClassroom = async (req, res) => {
  try {
    const { classroomId, teacherId } = req.body;

    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    const teacher = await User.findById(teacherId);
    if (!teacher || !teacher.isTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    if (teacher.classroom) {
      return res
        .status(400)
        .json({ message: "Teacher is already assigned to a classroom" });
    }

    classroom.teacher = teacherId;
    await classroom.save();

    teacher.classroom = classroomId;
    await teacher.save();

    res.status(200).json({
      message: "Teacher assigned to classroom successfully",
      classroom,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  createClassroom,
  getAllClassrooms,
  getClassroomById,
  updateClassroom,
  deleteClassroom,
  assignTeacherToClassroom,
};
