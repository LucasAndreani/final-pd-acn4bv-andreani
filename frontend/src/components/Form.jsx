import { useState } from "react";
import { Form as BootstrapForm, Button, InputGroup } from "react-bootstrap";

export default function Form({ onAdd }) {
    const [title, setTitle] = useState("");
    const [error, setError] = useState("");

    // Valida el titulo de la tarea
    const validateTitle = (value) => {
        if (!value.trim()) {
            return "El título no puede estar vacío";
        }
        if (value.trim().length < 3) {
            return "El título debe tener al menos 3 caracteres";
        }
        if (value.trim().length > 100) {
            return "El título no puede exceder 100 caracteres";
        }
        return "";
    };

    // Maneja el envio del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validateTitle(title);
        if (validationError) {
            setError(validationError);
            return;
        }

        setError("");
        await onAdd(title);
        setTitle("");
    };

    // Maneja los cambios en el input
    const handleChange = (e) => {
        const value = e.target.value;
        setTitle(value);
        if (error) {
            setError(validateTitle(value));
        }
    };

    return (
        <BootstrapForm onSubmit={handleSubmit} className="mb-4">
            <BootstrapForm.Group>
                <InputGroup>
                    <BootstrapForm.Control
                        type="text"
                        placeholder="Escribir una nueva tarea..."
                        value={title}
                        onChange={handleChange}
                        isInvalid={!!error}
                        maxLength={100}
                    />
                    <Button variant="secondary" type="submit">
                        Agregar
                    </Button>
                </InputGroup>
                {error && (
                    <BootstrapForm.Text className="text-danger mt-2 d-block">
                        {error}
                    </BootstrapForm.Text>
                )}
            </BootstrapForm.Group>
        </BootstrapForm>
    );
}