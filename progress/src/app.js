import express from "express";

// import mainRouter from "./routes/index.js";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

// app.use("/", mainRouter);

app.use(async (err, req, res, next) => {
    res.status(500).json({ error: err.message });
});

export default app;
