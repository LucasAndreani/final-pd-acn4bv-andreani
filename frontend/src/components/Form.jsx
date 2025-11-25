import { useState } from "react";

export default function Form({ onAdd }) {
    const [title, setTitle] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) return

        await onAdd(title)

        setTitle("")
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Nueva Task..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <button type="submit">Agregar</button>
        </form>
    )
}