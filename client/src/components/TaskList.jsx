import React, { useEffect, useState } from "react";

const TaskList = ({ refresh }) => {
    const [tasks, setTasks] = useState([]);

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

    const fetchTasks = async () => {
        try {
            const res = await fetch("http://localhost:8080/fetchAllTasks");
            const data = await res.json();
            const backendTasks = data.tasks || [];

            const cookieTasks = getTasksFromCookies();
            const merged = [...cookieTasks.map((t) => t.title || t), ...backendTasks];

            setTasks(merged);
        } catch (err) {
            console.error("Error fetching tasks:", err);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [refresh]);

    return (
        <div
            style={{
                height: "400px",
                position: "relative",
                overflow: "hidden",
                marginTop: "20px",
                paddingRight: "30px",
            }}
        >
            <h2>Notes</h2>
            <div
                style={{
                    height: "340px",
                    overflowY: "scroll",
                    paddingRight: "10px",
                }}
            >
                {tasks.map((task, index) => (
                    <div
                        key={index}
                        style={{
                            borderBottom: "1px solid #ccc",
                            padding: "15px",
                            background: "#f3f3f3",
                            marginBottom: "10px",
                            borderRadius: "6px",
                        }}
                    >
                        {typeof task === "string" ? task : task.title}
                    </div>
                ))}
            </div>



        </div>
    );
};

export default TaskList;
