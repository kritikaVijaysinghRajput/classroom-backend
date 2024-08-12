import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import User from "../models/User.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/database/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueFilename = Date.now() + ext;
    req.generatedFilename = uniqueFilename;
    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage: storage }).single("profile");

const register = async (req, res) => {
  try {
    const { fullname, email, password, role } = req.body;

    if (!fullname || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
      role,
    });

    const savedUser = await newUser.save();
    res
      .status(201)
      .json({ message: "User registered successfully", user: savedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user (example, if needed)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { upload, login, register };
