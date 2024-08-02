import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(cors());
app.use(express.json());

// In-memory task storage (replace with a database in a real application)
const tasks = [];

// Input validation middleware
const validateTask = (req, res, next) => {
    const { title, description } = req.body;
    if (!title || !description) {
        return res.status(400).send("Title and description are required");
    }
    next();
};

// GET /tasks: Fetch all tasks
app.get("/tasks", (req, res) => {
    try {
        res.send(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error occurred");
    }
});

// GET /tasks/:id: Fetch a specific task by ID
app.get("/tasks/:id", (req, res) => {
    try {
        const id = req.params.id;
        const task = tasks.find((task) => task.id === id);
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
app.post("/tasks", validateTask, (req, res) => {
    try {
        const { title, description } = req.body;
        const newTask = { id: uuidv4(), title, description };
        tasks.push(newTask);
        res.send(newTask);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error occurred");
    }
});

// PUT /tasks/:id: Update an existing task by ID
app.put("/tasks/:id", validateTask, (req, res) => {
    try {
        const id = req.params.id;
        const task = tasks.find((task) => task.id === id);
        if (!task) {
            return res.status(404).send("Task not found");
        }
        const { title, description } = req.body;
        task.title = title;
        task.description = description;
        res.send(task);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error occurred");
    }
});

// DELETE /tasks/:id: Delete a task by ID
app.delete("/tasks/:id", (req, res) => {
    try {
        const id = req.params.id;
        const taskIndex = tasks.findIndex((task) => task.id === id);
        if (taskIndex === -1) {
            return res.status(404).send("Task not found");
        }
        tasks.splice(taskIndex, 1);
        res.send("Task deleted");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error occurred");
    }
});

app.listen(5000, () => console.log("Server is running on port 5000"));