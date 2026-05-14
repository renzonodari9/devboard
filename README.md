# DevBoard - Developer Dashboard

DevBoard es una aplicación SaaS completa para desarrolladores que permite gestionar proyectos, tareas y notas técnicas en un solo lugar.

![DevBoard](https://via.placeholder.com/800x400/0a0a0a/22c55e?text=DevBoard)

## Características Principales

- **Autenticación Segura** - JWT con registro y login
- **Dashboard** - Métricas visuales y progreso
- **Proyectos** - CRUD con colores personalizados
- **Tareas** - Gestión por proyecto con prioridades (low/medium/high) y estados (pendiente/completada)
- **Notas Técnicas** - Notas con etiquetas y opción de pins
- **UI/UX** - Dark mode, skeleton loading, toasts, modales de confirmación

## Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS v3
- Zustand (State Management)
- React Router DOM
- Lucide React (icons)
- Axios

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Express Validator

## Getting Started

### Prerrequisitos

- Node.js 18+
- MongoDB (Atlas o local)

### Instalación

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend (otra terminal)
cd backend
npm install
npm run dev
```

### Variables de Entorno

**Backend** (`backend/.env`):
```env
MONGO_URI=tu_mongodb_uri
JWT_SECRET=tu_jwt_secret
PORT=5000
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000
```

## Demo

Demo live: [https://devboard-demo.vercel.app](https://devboard-demo.vercel.app)

> Reemplazar con tu URL de producción cuando hagas deploy

## Endpoints API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/auth/register | Registro de usuario |
| POST | /api/auth/login | Inicio de sesión |
| GET | /api/auth/me | Usuario actual |
| GET/POST | /api/projects | Listar/Crear proyectos |
| PUT/DELETE | /api/projects/:id | Actualizar/Eliminar proyecto |
| GET/POST | /api/tasks | Listar/Crear tareas |
| PUT/DELETE | /api/tasks/:id | Actualizar/Eliminar tarea |
| GET/POST | /api/notes | Listar/Crear notas |
| PUT/DELETE | /api/notes/:id | Actualizar/Eliminar nota |

## Deploy

### Frontend (Vercel)

1. Conectar repositorio a Vercel
2. Configurar variable `VITE_API_URL` con la URL del backend
3. Deploy automático en push a main

### Backend (Render/Railly)

1. Conectar repositorio
2. Root directory: `backend`
3. Build command: `npm install`
4. Start command: `npm run dev`
5. Configurar variables `MONGO_URI` y `JWT_SECRET`

## Estructura del Proyecto

```
devboard/
├── frontend/
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── pages/         # Páginas de la app
│   │   ├── store/         # Zustand stores
│   │   ├── services/      # API services
│   │   └── index.css      # Estilos globales
│   ├── vite.config.js
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── models/       # Modelos Mongoose
│   │   ├── routes/        # Rutas API
│   │   ├── middleware/   # Middleware Express
│   │   ├── config/        # Configuraciones
│   │   └── server.js      # Entry point
│   ├── .env
│   └── package.json
├── README.md
└── .gitignore
```

## Mejoras Futuras

- [ ] Drag & drop para tareas
- [ ] Subir archivos a notas
- [ ] Notificaciones en tiempo real
- [ ] Modo light
- [ ] Tests unitarios
- [ ] Autenticación con Google/GitHub

## Licencia

MIT - Desarrollado por Renzo Nodari © 2024