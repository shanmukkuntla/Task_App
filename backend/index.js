import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/getData", (req, res) => {
    try {
        res.send("hello");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error occurred");
    }
});

app.listen(5000, () => console.log("Server is running on port 5000"));