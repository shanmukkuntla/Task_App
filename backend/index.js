import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/tasks", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (err) => {
    console.error(err);
});

db.once("open", () => {
    console.log("Connected to MongoDB");
});

// Define the user schema
const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4,
    },
    username: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
});

// Create the user model
const User = mongoose.model("User", userSchema);

// Define the task schema
const taskSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    userId: {
        type: String,
        required: true,
    },
});

// Create the task model
const Task = mongoose.model("Task", taskSchema);

// Input validation middleware
const validateTask = (req, res, next) => {
    const { title, description } = req.body;
    if (!title || !description) {
        return res.status(400).send("Title and description are required");
    }
    next();
};

// Authentication middleware
const authenticate = async (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).send("Access denied. No token provided.");
    }
    try {
        const decoded = jwt.verify(token, "secretkey");
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(400).send("Invalid token.");
    }
};

// GET /tasks: Fetch all tasks
app.get("/tasks", authenticate, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.send(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error occurred");
    }
});

// GET /tasks/:id: Fetch a specific task by ID
app.get("/tasks/:id", authenticate, async (req, res) => {
    try {
        const id = req.params.id;
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).send("Task not found");
        }
        if (task.userId !== req.user._id) {
            return res.status(403).send("Access denied. Task belongs to another user.");
        }
        res.send(task);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error occurred");
    }
});

// POST /tasks: Create a new task
app.post("/tasks", authenticate, validateTask, async (req, res) => {
    try {
        const { title, description } = req.body;
        const newTask = new Task({ title, description, userId: req.user._id });
        await newTask.save();
        res.send(newTask);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error occurred");
    }
});

// PUT /tasks/:id: Update an existing task by ID
app.put("/tasks/:id", authenticate, validateTask, async (req, res) => {
    try {
        const id = req.params.id;
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).send("Task not found");
        }
        if (task.userId !== req.user._id) {
            return res.status(403).send("Access denied. Task belongs to another user.");
        }
        const { title, description } = req.body;
        task.title = title;
        task.description = description;
        task.updatedAt = Date.now();
        await task.save();
        res.send(task);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error occurred");
    }
});

// DELETE /tasks/:id: Delete a task by ID
app.delete("/tasks/:id", authenticate, async (req, res) => {
    try {
        const id = req.params.id;
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).send("Task not found");
        }
        if (task.userId !== req.user._id) {
            return res.status(403).send("Access denied. Task belongs to another user.");
        }
        await task.remove();
        res.send("Task deleted successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error occurred");
    }
});

// User registration
app.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.send("User created successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error occurred");
    }
});

// User login
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).send("Invalid username or password");
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).send("Invalid username or password");
        }
        const token = jwt.sign({ _id: user._id }, "secretkey", {
            expiresIn: "1h",
        });
        res.send({ token });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error occurred");
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});