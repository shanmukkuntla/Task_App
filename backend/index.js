import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";

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

// GET /tasks: Fetch all tasks
app.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.send(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error occurred");
    }
});

// GET /tasks/:id: Fetch a specific task by ID
app.get("/tasks/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).send("Task not found");
        }
        res.send(task);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error occurred");
    }
});

// POST /tasks: Create a new task
app.post("/tasks", validateTask, async (req, res) => {
    try {
        const { title, description } = req.body;
        const newTask = new Task({ title, description });
        await newTask.save();
        res.send(newTask);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error occurred");
    }
});

// PUT /tasks/:id: Update an existing task by ID
app.put("/tasks/:id", validateTask, async (req, res) => {
    try {
        const id = req.params.id;
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).send("Task not found");
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
app.delete("/tasks/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await Task.findByIdAndDelete(id);
        res.send("Task deleted");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error occurred");
    }
});

app.listen(5000, () => console.log("Server is running on port 5000"));