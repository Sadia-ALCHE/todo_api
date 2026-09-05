require("dotenv").config();

const express = require("express");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Task API is running"
  });
});

app.use("/v1/tasks", taskRoutes);

app.use((req, res) => {
  return res.status(404).json({
    error: "Endpoint not found"
  });
});

app.use((error, req, res, next) => {
  console.error(error);

  if (error.type === "entity.parse.failed") {
    return res.status(400).json({
      error: "Invalid JSON"
    });
  }

  return res.status(500).json({
    error: "Internal server error"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;