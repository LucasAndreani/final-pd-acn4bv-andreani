import { useState, useEffect } from "react";
import { Container, Alert } from "react-bootstrap";
import List from "./components/List";
import Form from "./components/Form";

function App() {
    const [tasks, setTasks] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState("");
    const [message, setMessage] = useState({ type: "", text: "" });

    // Carga las tareas al montar el componente
    useEffect(() => {
        const loadTasks = async () => {
            try {
                const res = await fetch("http://localhost:3000/tasks");
                if (!res.ok) throw new Error("Error al cargar tareas");
                const data = await res.json();
                setTasks(data);
            } catch (err) {
                console.error("Error al cargar tasks", err);
                showMessage("danger", "Error al cargar las tareas");
            }
        };
        loadTasks();
    }, []);

    // Muestra un mensaje temporal al usuario
    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    // Agrega una nueva tarea
    const addTask = async (title) => {
        try {
            const response = await fetch("http://localhost:3000/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ title })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Error al agregar tarea");
            }

            const newTask = await response.json();
            setTasks(prev => [...prev, newTask]);
            showMessage("success", "Tarea agregada correctamente");
        } catch (err) {
            console.error("Error al agregar tarea:", err);
            showMessage("danger", err.message || "Error al agregar la tarea");
        }
    };

    // Elimina una tarea
    const deleteTask = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/tasks/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Error al eliminar tarea");
            }

            setTasks(tasks.filter(t => t.id !== id));
            showMessage("success", "Tarea eliminada correctamente");
        } catch (err) {
            console.error("Error al eliminar tarea:", err);
            showMessage("danger", err.message || "Error al eliminar la tarea");
        }
    };

    // Activa el modo edicion para una tarea
    const startEditing = (task) => {
        setEditingId(task.id);
        setEditingText(task.title);
    };

    // Guarda los cambios de una tarea editada
    const saveEdit = async () => {
        try {
            const res = await fetch(`http://localhost:3000/tasks/${editingId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ title: editingText })
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Error al editar tarea");
            }

            const updated = await res.json();
            setTasks(tasks.map(t => (t.id === editingId ? updated : t)));
            setEditingId(null);
            setEditingText("");
            showMessage("success", "Tarea actualizada correctamente");
        } catch (err) {
            console.error("Error al editar:", err);
            showMessage("danger", err.message || "Error al editar la tarea");
        }
    };

    // Cancela el modo edicion
    const cancelEdit = () => {
        setEditingId(null);
        setEditingText("");
    };

    return (
        <Container className="my-5">
            <div className="card border">
                <div className="card-body p-4">
                    <h1 className="mb-4 text-center">
                        Gestor de Tareas
                    </h1>

                    {message.text && (
                        <Alert 
                            variant={message.type} 
                            dismissible 
                            onClose={() => setMessage({ type: "", text: "" })}
                            className="mb-4"
                        >
                            {message.text}
                        </Alert>
                    )}

                    <Form onAdd={addTask} />

                    <List
                        tasks={tasks}
                        deleteTask={deleteTask}
                        startEditing={startEditing}
                        editingId={editingId}
                        editingText={editingText}
                        setEditingText={setEditingText}
                        saveEdit={saveEdit}
                        cancelEdit={cancelEdit}
                    />
                </div>
            </div>
        </Container>
    );
}

export default App;
