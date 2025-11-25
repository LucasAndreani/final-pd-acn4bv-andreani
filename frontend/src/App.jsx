import { useState } from "react";
import List from "./components/List";

function App() {
    const [tasks, setTasks] = useState([]);

    return (
        <div style={{ padding: "20px" }}>
            <h1>Mis Tasks</h1>
            <List tasks={tasks}/>
        </div>
    )
}

export default App;