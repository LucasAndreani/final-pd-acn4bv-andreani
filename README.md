# Gestor de Tareas - Parcial 2

Aplicación full-stack para gestión de tareas desarrollada con Express (backend) y React (frontend).

## Estructura de Carpetas

```
parcial-2-pd-acn4bv-andreani/
├── backend/
│   ├── data.json              # Archivo de persistencia de datos (JSON)
│   ├── index.js               # Servidor Express principal
│   ├── package.json           # Dependencias del backend
│   └── node_modules/          # Dependencias instaladas
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Componente principal de la aplicación
│   │   ├── main.jsx           # Punto de entrada de React
│   │   ├── index.css          # Estilos personalizados
│   │   └── components/
│   │       ├── Form.jsx       # Componente de formulario para agregar tareas
│   │       └── List.jsx       # Componente para listar y gestionar tareas
│   ├── index.html             # HTML principal
│   ├── package.json           # Dependencias del frontend
│   ├── vite.config.js         # Configuración de Vite
│   └── node_modules/          # Dependencias instaladas
│
└── README.md                   # Este archivo
```

## Flujo General de la Aplicación

### 1. Inicialización

**Backend:**
- El servidor Express se inicia en el puerto 3000
- Se configuran middlewares: CORS y JSON parser
- Se aplica middleware de logging para registrar todas las solicitudes
- El servidor queda escuchando peticiones HTTP

**Frontend:**
- React se monta en el DOM
- El componente `App` se renderiza
- Al montarse, se ejecuta `useEffect` que realiza un `GET /tasks` al backend
- Las tareas obtenidas se almacenan en el estado `tasks`

### 2. Visualización de Tareas

1. El usuario abre la aplicación en el navegador
2. `App.jsx` renderiza el componente `List` pasando las tareas como prop
3. `List.jsx` mapea el array de tareas y muestra cada una con botones de editar y eliminar
4. Si no hay tareas, se muestra un mensaje indicando que no hay tareas

### 3. Agregar Nueva Tarea

1. El usuario escribe en el formulario (`Form.jsx`)
2. Al enviar, se valida que el título tenga al menos 3 caracteres y máximo 100
3. Si es válido, se ejecuta `addTask` en `App.jsx`
4. Se realiza un `POST /tasks` al backend con el título
5. El backend valida, crea la tarea con un ID único (timestamp) y la guarda en `data.json`
6. El backend responde con la tarea creada
7. El frontend actualiza el estado agregando la nueva tarea
8. Se muestra un mensaje de éxito y la lista se actualiza automáticamente

### 4. Editar Tarea

1. El usuario hace clic en "Editar" en una tarea
2. Se activa el modo edición: el texto se reemplaza por un input
3. El usuario modifica el texto y hace clic en "Guardar" o presiona Enter
4. Se ejecuta `saveEdit` que realiza un `PUT /tasks/:id` al backend
5. El backend busca la tarea por ID, actualiza el título y guarda en `data.json`
6. El backend responde con la tarea actualizada
7. El frontend actualiza el estado y muestra un mensaje de éxito

### 5. Eliminar Tarea

1. El usuario hace clic en "Eliminar" en una tarea
2. Se ejecuta `deleteTask` que realiza un `DELETE /tasks/:id` al backend
3. El backend busca la tarea, la elimina del array y guarda en `data.json`
4. El backend responde con un mensaje de confirmación
5. El frontend actualiza el estado filtrando la tarea eliminada
6. Se muestra un mensaje de éxito y la lista se actualiza

## Ejemplos de Intercambio de Datos (JSON)

### GET /tasks - Obtener todas las tareas

**Request:**
```http
GET http://localhost:3000/tasks
```

**Response (200 OK):**
```json
[
  {
    "id": 1764047602606,
    "title": "Primera Task!"
  },
  {
    "id": 1764106739255,
    "title": "Segunda Task!"
  }
]
```

### POST /tasks - Crear nueva tarea

**Request:**
```http
POST http://localhost:3000/tasks
Content-Type: application/json

{
  "title": "Nueva tarea de ejemplo"
}
```

**Response (201 Created):**
```json
{
  "id": 1764112345678,
  "title": "Nueva tarea de ejemplo"
}
```

**Response Error (400 Bad Request):**
```json
{
  "error": "El campo 'title' es obligatorio"
}
```

### PUT /tasks/:id - Actualizar tarea

**Request:**
```http
PUT http://localhost:3000/tasks/1764047602606
Content-Type: application/json

{
  "title": "Tarea actualizada"
}
```

**Response (200 OK):**
```json
{
  "id": 1764047602606,
  "title": "Tarea actualizada"
}
```

**Response Error (404 Not Found):**
```json
{
  "error": "Task no encontrada"
}
```

### DELETE /tasks/:id - Eliminar tarea

**Request:**
```http
DELETE http://localhost:3000/tasks/1764047602606
```

**Response (200 OK):**
```json
{
  "message": "Task eliminada correctamente"
}
```

**Response Error (404 Not Found):**
```json
{
  "error": "Task no encontrada"
}
```

## Instalación y Ejecución

### Prerrequisitos
- Node.js (v14 o superior)
- npm

### Backend

1. Navegar a la carpeta backend:
```bash
cd backend
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar el servidor:
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

### Frontend

1. Navegar a la carpeta frontend:
```bash
cd frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173` (o el puerto que Vite asigne)


## Endpoints del Backend

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Verificación de estado del servidor |
| GET | `/tasks` | Obtener todas las tareas |
| POST | `/tasks` | Crear una nueva tarea |
| PUT | `/tasks/:id` | Actualizar una tarea existente |
| DELETE | `/tasks/:id` | Eliminar una tarea |

## Middlewares

- **CORS**: Permite solicitudes desde el frontend
- **express.json()**: Parsea el cuerpo de las solicitudes JSON
- **Logging**: Registra todas las solicitudes con timestamp, método y URL
- **validateTask**: Valida que el campo `title` esté presente y no esté vacío
