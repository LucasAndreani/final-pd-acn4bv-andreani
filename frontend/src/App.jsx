import { useState, useEffect } from "react";
import List from "./components/List";
import Form from "./components/Form";

function App() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/tasks")
        .then(res => res.json())
        .then(data => setTasks(data))
        .catch(err => console.error("Error al cargar tasks", err))
    }, [])


    const addTask = async (title) => {
        const response = await fetch("http://localhost:3000/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title })
        });

        const newTask = await response.json()

        setTasks(prev => [...prev, newTask]);

    }


    return (
        <div style={{ padding: "20px" }}>
            <h1>Mis Tasks</h1>

            <Form onAdd={addTask} />

            <List tasks={tasks}/>
        </div>
    )
}

export default App;