# Proyecto Minería - Juego Educativo sobre Sustancias Peligrosas

Aplicación web interactiva para aprender sobre pictogramas de seguridad y clasificación de sustancias peligrosas en minería. El proyecto consta de un frontend en React y un backend en Node.js con MongoDB.

## Descripción

Este proyecto es un juego educativo tipo quiz donde los participantes deben identificar correctamente pictogramas, colores y números de clasificación asociados a diferentes sustancias peligrosas utilizadas en el sector minero, siguiendo estándares de seguridad internacionales.

## Características Principales

- Creación de salas de juego con código PIN
- Selección personalizada de preguntas
- Tablero interactivo para responder
- Comunicación en tiempo real con Socket.io
- Sistema de puntuación basado en respuestas correctas y tiempo
- Panel de administración para gestionar preguntas

## Requisitos Previos

- Node.js (v14 o superior)
- npm o yarn
- MongoDB (local o Atlas)

## Estructura del Proyecto

```
proyecto-mineria/
│
├── frontend/                # Aplicación React + Vite
│   ├── public/              # Archivos estáticos
│   ├── src/                 # Código fuente
│       ├── assets/          # Imágenes y recursos
│       ├── components/      # Componentes React
│       ├── hooks/           # Custom hooks
│       ├── layouts/         # Plantillas de páginas
│       ├── pages/           # Páginas principales
│       └── services/        # Servicios (API, WebSocket)
│
└── backend/                 # Servidor Node.js
    ├── config/              # Configuraciones
    ├── controllers/         # Controladores
    ├── models/              # Modelos de datos MongoDB
    └── server.js            # Punto de entrada
```

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/anglyh/proyecto-mineria
cd proyecto-mineria
```

### 2. Instalar dependencias

```bash
# Instalar dependencias del frontend
cd frontend
npm install

# Instalar dependencias del backend
cd ../backend
npm install
```

## Configuración de MongoDB

### Opción 1: MongoDB Local

1. Asegúrate de tener MongoDB instalado y ejecutándose en tu máquina local
2. Crea un archivo `.env` en la carpeta `backend` con el siguiente contenido:

```
MONGODB_URI=mongodb://localhost:27017/mineria
```

### Opción 2: MongoDB Atlas (Recomendado para producción)

1. Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Configura un nuevo clúster
3. Obtén la URI de conexión y crea un archivo `.env` en la carpeta `backend`:

```
MONGODB_URI=mongodb+srv://<usuario>:<contraseña>@<cluster>.mongodb.net/mineria?retryWrites=true&w=majority
```

## Iniciar la Aplicación

### Desarrollo

```bash
# Iniciar el backend
cd backend
npm run dev

# En otra terminal, iniciar el frontend
cd frontend
npm run dev
```

### Producción

```bash
# Construir el frontend
cd frontend
npm run build

# Iniciar el servidor (que servirá el frontend)
cd ../backend
npm start
```

## Construcción del Frontend para Backend

El proyecto incluye un script en el backend para construir el frontend y copiarlo al backend para su despliegue:

```bash
# Desde la carpeta backend
npm run build:ui
```

Este comando:
1. Elimina la carpeta dist existente en el backend
2. Cambia al directorio del frontend y ejecuta la construcción
3. Copia la carpeta dist resultante al backend

## Funcionamiento del Juego

1. Administrador crea un juego y obtiene un PIN
2. Jugadores se unen usando el PIN
3. Al comenzar, se muestran preguntas sobre sustancias peligrosas
4. Jugadores seleccionan pictogramas, colores y números de clasificación
5. Se muestran resultados y puntuaciones finales

## Datos Iniciales

El sistema viene precargado con preguntas sobre sustancias peligrosas según estándares internacionales de seguridad. Esta información se carga automáticamente en la base de datos la primera vez que se ejecuta la aplicación.

## Nota Importante

Este repositorio sirve como guía de referencia para el desarrollo de aplicaciones educativas sobre seguridad minera. No se aceptarán pull requests. Si deseas adaptarlo a tus necesidades, te recomendamos hacer un fork del proyecto y personalizarlo según tus requerimientos específicos. 