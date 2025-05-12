import React, { useState } from "react";

const TaskInput = ({ onTaskAdded }) => {
  const [title, setTitle] = useState("");

  const getTasksFromCookies = () => {
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith("tasks="));
    if (match) {
      try {
        return JSON.parse(decodeURIComponent(match.split("=")[1]));
      } catch (err) {
        return [];
      }
    }
    return [];
  };

  const setTasksInCookies = (tasks) => {
    document.cookie = `tasks=${encodeURIComponent(
      JSON.stringify(tasks)
    )}; path=/; max-age=31536000`;
  };

  const handleAdd = async () => {
    if (!title.trim()) return;

    const tasks = getTasksFromCookies();
    const newTask = { title, id: Date.now() };
    const updatedTasks = [...tasks, newTask];

    if (updatedTasks.length === 50) {
      await fetch("http://localhost:8080/storeTasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks: updatedTasks }),
        credentials: "include",
      });
      setTasksInCookies([]);
    } else {
      setTasksInCookies(updatedTasks);
    }

    setTitle("");

    if (onTaskAdded) {
      onTaskAdded(); 
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
      <input
        type="text"
        placeholder="New Note..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          padding: "15px 10px",
          width: "60%",
          border: "none",
          marginRight: "10px",
          borderRadius: "4px",
          outline: "none",
        }}
      />
      <button
        onClick={handleAdd}
        style={{
          backgroundColor: "brown",
          color: "white",
          padding: "12px 20px",
          borderRadius: "6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          border: "none",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <img
          src="./add.png"
          alt="Add"
          style={{ width: "20px", height: "20px", marginRight: "10px" }}
        />
        <span style={{ fontSize: "14px" }}>Add</span>
      </button>
    </div>
  );
};

export default TaskInput;
