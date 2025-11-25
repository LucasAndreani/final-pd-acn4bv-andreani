import { ListGroup, Button, InputGroup, Form } from "react-bootstrap";

function List({
    tasks,
    deleteTask,
    startEditing,
    editingId,
    editingText,
    setEditingText,
    saveEdit,
    cancelEdit
}) {
    // Guarda los cambios al editar
    const handleSave = () => {
        if (!editingText.trim()) {
            return;
        }
        saveEdit();
    };

    if (tasks.length === 0) {
        return (
            <div className="text-center text-muted py-5">
                <p className="mb-0">
                    No hay tareas. Agrega una nueva tarea para comenzar.
                </p>
            </div>
        );
    }

    return (
        <ListGroup className="mt-3">
            {tasks.map(task => (
                <ListGroup.Item
                    key={task.id}
                    className="d-flex justify-content-between align-items-center py-3"
                >
                    {editingId === task.id ? (
                        <InputGroup style={{ flex: 1, maxWidth: "500px" }}>
                            <Form.Control
                                type="text"
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") handleSave();
                                    if (e.key === "Escape") cancelEdit();
                                }}
                                maxLength={100}
                            />
                            <Button variant="secondary" size="sm" onClick={handleSave}>
                                Guardar
                            </Button>
                            <Button variant="outline-secondary" size="sm" onClick={cancelEdit}>
                                Cancelar
                            </Button>
                        </InputGroup>
                    ) : (
                        <>
                            <span className="flex-grow-1">{task.title}</span>
                            <div>
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => startEditing(task)}
                                >
                                    Editar
                                </Button>
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => deleteTask(task.id)}
                                >
                                    Eliminar
                                </Button>
                            </div>
                        </>
                    )}
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
}

export default List;
