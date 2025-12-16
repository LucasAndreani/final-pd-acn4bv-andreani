import { useState, useEffect } from "react";
import { Container, Alert, Nav, Button } from "react-bootstrap";
import { Form as BootstrapForm } from "react-bootstrap";
import {
    Routes,
    Route,
    Link,
    useParams,
    useNavigate,
    Navigate
} from "react-router-dom";

import List from "./components/List";
import TaskForm from "./components/Form";

function TaskDetailPage({ token }) {
    const { id } = useParams();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadTask = async () => {
            try {
                const res = await fetch(`http://localhost:3000/tasks/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (!res.ok) throw new Error("Error al cargar tarea");
                const data = await res.json();
                setTask(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadTask();
    }, [id, token]);

    if (loading) return <p>Cargando tarea...</p>;
    if (error) return <Alert variant="danger">{error}</Alert>;
    if (!task) return <p>No se encontró la tarea.</p>;

    return (
        <>
            <h2>Detalle de tarea</h2>
            <p><strong>ID:</strong> {task.id}</p>
            <p><strong>Título:</strong> {task.title}</p>
        </>
    );
}

function TasksPage({
    tasks,
    message,
    addTask,
    deleteTask,
    startEditing,
    editingId,
    editingText,
    setEditingText,
    saveEdit,
    cancelEdit
}) {
    return (
        <div className="card border">
            <div className="card-body p-4">
                <h1 className="text-center mb-4">Gestor de Tareas</h1>

                {message.text && (
                    <Alert
                        variant={message.type}
                        dismissible
                        onClose={message.onClose}
                    >
                        {message.text}
                    </Alert>
                )}

                <TaskForm onAdd={addTask} />

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
    );
}

function LoginPage({ onLogin, isLoading }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const ok = await onLogin(email, password, setError);
        if (ok) navigate("/");
    };

    return (
        <div className="card border">
            <div className="card-body p-4">
                <h2 className="text-center mb-3">Iniciar sesión</h2>

                {error && <Alert variant="danger">{error}</Alert>}

                <BootstrapForm onSubmit={handleSubmit}>
                    <BootstrapForm.Group className="mb-3">
                        <BootstrapForm.Label>Email</BootstrapForm.Label>
                        <BootstrapForm.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </BootstrapForm.Group>

                    <BootstrapForm.Group className="mb-3">
                        <BootstrapForm.Label>Password</BootstrapForm.Label>
                        <BootstrapForm.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </BootstrapForm.Group>

                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Cargando..." : "Entrar"}
                    </Button>
                </BootstrapForm>
            </div>
        </div>
    );
}

function RegisterPage({ onRegister, isLoading }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const ok = await onRegister(email, password, setError);
        if (ok) navigate("/");
    };

    return (
        <div className="card border">
            <div className="card-body p-4">
                <h2 className="text-center mb-3">Crear cuenta</h2>

                {error && <Alert variant="danger">{error}</Alert>}

                <BootstrapForm onSubmit={handleSubmit}>
                    <BootstrapForm.Group className="mb-3">
                        <BootstrapForm.Label>Email</BootstrapForm.Label>
                        <BootstrapForm.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </BootstrapForm.Group>

                    <BootstrapForm.Group className="mb-3">
                        <BootstrapForm.Label>Password</BootstrapForm.Label>
                        <BootstrapForm.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </BootstrapForm.Group>

                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Cargando..." : "Registrarme"}
                    </Button>
                </BootstrapForm>
            </div>
        </div>
    );
}

function App() {
    const [tasks, setTasks] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState("");
    const [message, setMessage] = useState({ type: "", text: "" });
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [userEmail, setUserEmail] = useState(localStorage.getItem("email") || "");
    const [authLoading, setAuthLoading] = useState(false);

    const authHeaders = () =>
        token ? { Authorization: `Bearer ${token}` } : {};

    const showMessage = (type, text) => {
        setMessage({
            type,
            text,
            onClose: () => setMessage({ type: "", text: "" })
        });
    };

    useEffect(() => {
        if (!token) {
            setTasks([]);
            return;
        }

        fetch("http://localhost:3000/tasks", {
            headers: authHeaders()
        })
            .then((res) => res.json())
            .then(setTasks)
            .catch(() => showMessage("danger", "Error al cargar tareas"));
    }, [token]);

    const saveSession = (t, email) => {
        setToken(t);
        setUserEmail(email);
        localStorage.setItem("token", t);
        localStorage.setItem("email", email);
    };

    const clearSession = () => {
        setToken("");
        setUserEmail("");
        localStorage.removeItem("token");
        localStorage.removeItem("email");
    };

    const login = async (email, password, setError) => {
        setAuthLoading(true);
        try {
            const res = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            saveSession(data.token, data.email);
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setAuthLoading(false);
        }
    };

    const register = async (email, password, setError) => {
        setAuthLoading(true);
        try {
            const res = await fetch("http://localhost:3000/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            saveSession(data.token, data.email);
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setAuthLoading(false);
        }
    };

    const addTask = async (title) => {
        const res = await fetch("http://localhost:3000/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...authHeaders()
            },
            body: JSON.stringify({ title })
        });
        const data = await res.json();
        setTasks((prev) => [...prev, data]);
    };

    const deleteTask = async (id) => {
        await fetch(`http://localhost:3000/tasks/${id}`, {
            method: "DELETE",
            headers: authHeaders()
        });
        setTasks((prev) => prev.filter((t) => t.id !== id));
    };

    const startEditing = (task) => {
        setEditingId(task.id);
        setEditingText(task.title);
    };

    const saveEdit = async () => {
        const res = await fetch(`http://localhost:3000/tasks/${editingId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...authHeaders()
            },
            body: JSON.stringify({ title: editingText })
        });
        const updated = await res.json();
        setTasks((prev) =>
            prev.map((t) => (t.id === editingId ? updated : t))
        );
        setEditingId(null);
        setEditingText("");
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditingText("");
    };

    return (
        <Container className="my-5">
            <Nav className="mb-4 gap-3">
                {token && <Nav.Link as={Link} to="/">Tareas</Nav.Link>}
                {!token && (
                    <>
                        <Nav.Link as={Link} to="/login">Login</Nav.Link>
                        <Nav.Link as={Link} to="/register">Registro</Nav.Link>
                    </>
                )}
                {token && (
                    <Nav.Link onClick={clearSession}>
                        Cerrar sesión ({userEmail})
                    </Nav.Link>
                )}
            </Nav>

            <Routes>
                <Route
                    path="/"
                    element={
                        token ? (
                            <TasksPage
                                tasks={tasks}
                                message={message}
                                addTask={addTask}
                                deleteTask={deleteTask}
                                startEditing={startEditing}
                                editingId={editingId}
                                editingText={editingText}
                                setEditingText={setEditingText}
                                saveEdit={saveEdit}
                                cancelEdit={cancelEdit}
                            />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
                <Route
                    path="/tasks/:id"
                    element={
                        token ? <TaskDetailPage token={token} /> : <Navigate to="/login" />
                    }
                />
                <Route
                    path="/login"
                    element={
                        token ? <Navigate to="/" /> : <LoginPage onLogin={login} isLoading={authLoading} />
                    }
                />
                <Route
                    path="/register"
                    element={
                        token ? <Navigate to="/" /> : <RegisterPage onRegister={register} isLoading={authLoading} />
                    }
                />
            </Routes>
        </Container>
    );
}

export default App;
