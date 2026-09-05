const Task = require("../models/taskModel");

function parseId(id) {
  const parsed = Number(id);

  if (Number.isInteger(parsed) && parsed > 0) {
    return parsed;
  }

  return null;
}

function parseBoolean(value) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value === 1;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "true" || normalized === "1";
  }

  return Boolean(value);
}

exports.createTask = async (req, res) => {
  try {
    const { title } = req.body || {};

    if (typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({error: "A valid title is required"});
    }

    const id = await Task.create(title.trim());

    return res.status(201).json({id});
  } catch (error) {
    console.error(error);

    return res.status(500).json({error: "Internal server error"});
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll();
    return res.status(200).json({
      tasks
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal server error"
    });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      return res.status(404).json({
        error: "There is no task at that id"
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        error: "There is no task at that id"
      });
    }

    return res.status(200).json(task);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal server error"
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      return res.status(404).json({
        error: "There is no task at that id"
      });
    }

    const existingTask = await Task.findById(id);

    if (!existingTask) {
      return res.status(404).json({
        error: "There is no task at that id"
      });
    }

    const body = req.body || {};

    const updates = {};

    if (body.title !== undefined) {
      if (typeof body.title !== "string" || body.title.trim() === "") {
        return res.status(400).json({
          error: "A valid title is required"
        });
      }

      updates.title = body.title.trim();
    }

    if (body.is_completed !== undefined) {
      updates.is_completed = parseBoolean(body.is_completed);
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        error: "At least one field must be updated"
      });
    }

    await Task.update(id, updates);

    return res.status(204).send();
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal server error"
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const id = parseId(req.params.id);

    if (id) {
      await Task.delete(id);
    }

    return res.status(204).send();
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal server error"
    });
  }
};