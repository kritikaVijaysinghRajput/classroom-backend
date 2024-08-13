import User from "../models/User.js";
import Classroom from "../models/Classroom.js";
import bcrypt from "bcrypt";

export const createUser = async (req, res) => {
  try {
    const { fullname, email, password, role, classroomId } = req.body;

    if (role !== "teacher" && role !== "student") {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
      role,
      classroom: role === "student" ? classroomId : null,
    });

    const savedUser = await newUser.save();

    if (role === "teacher" && classroomId) {
      const classroom = await Classroom.findById(classroomId);
      if (classroom) {
        classroom.teacher = savedUser._id;
        await classroom.save();
      }
    }

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { fullname, email, role, classroomId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.fullname = fullname || user.fullname;
    user.email = email || user.email;
    user.role = role || user.role;

    if (role === "student" && classroomId) {
      user.classroom = classroomId;
    } else if (role === "teacher" && classroomId) {
      const classroom = await Classroom.findById(classroomId);
      if (classroom) {
        classroom.teacher = user._id;
        await classroom.save();
      }
    }

    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" });
    if (!students || students.length === 0) {
      return res.status(404).json({ message: "No Students found" });
    }
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { fullname, email },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" });
    if (!teachers || teachers.length === 0) {
      return res.status(404).json({ message: "No teachers found" });
    }
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    console.log("Deleting teacher with ID:", teacherId);

    const teacher = await User.findOneAndDelete({
      _id: teacherId,
      role: "teacher",
    });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    console.error("Delete teacher error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    console.log("Deleting student with ID:", studentId);

    const student = await User.findOneAndDelete({
      _id: studentId,
      role: "student",
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
