const pool = require("../db/db");

function formatTask(row) {
  return {id: row.id, title: row.title, is_completed: Boolean(row.is_completed)};
}

const Task = {
  async create(title) {
    const [result] = await pool.execute("INSERT INTO tasks (title, is_completed) VALUES (?, ?)", [title, false] );
    return result.insertId;
  },

  async findAll() {
    const [rows] = await pool.query( "SELECT id, title, is_completed FROM tasks ORDER BY id ASC");
    return rows.map(formatTask);
  },

  async findById(id) {
    const [rows] = await pool.execute("SELECT id, title, is_completed FROM tasks WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return null;
    }

    return formatTask(rows[0]);
  },

  async update(id, updates) {
    const fields = [];
    const values = [];

    if (updates.title !== undefined) {
      fields.push("title = ?");
      values.push(updates.title);
    }

    if (updates.is_completed !== undefined) {
      fields.push("is_completed = ?");
      values.push(updates.is_completed ? 1 : 0);
    }

    if (fields.length === 0) {
      return 0;
    }

    values.push(id);

    const query = `
      UPDATE tasks
      SET ${fields.join(", ")}
      WHERE id = ?
    `;

    const [result] = await pool.execute(query, values);

    return result.affectedRows;
  },

  async delete(id) {
    await pool.execute("DELETE FROM tasks WHERE id = ?", [id]);
  }
};

module.exports = Task;