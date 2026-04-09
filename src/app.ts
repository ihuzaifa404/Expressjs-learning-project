import express from "express";

const app = express();

//Routes

app.get("/", (req, res, next) => {
  res.json({ message: "Hello this is Product 1" });
});

export default app;
