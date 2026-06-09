

<h1 align="center">Ecomisión</h1>

<p align="center">
  Plataforma ecológica para reducir la huella de carbono mediante retos ambientales y visualización de árboles plantados en tiempo real.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Kotlin-7F52FF?style=for-the-badge&logo=kotlin&logoColor=white" />
  <img src="https://img.shields.io/badge/SQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" />
</p>

---

## 📖 Descripción

**Ecomisión** es una plataforma multiplataforma (web y Android) que fomenta hábitos ecológicos mediante retos ambientales. Los usuarios pueden completar retos del catálogo, plantar árboles y ver en un mapa interactivo los puntos exactos donde otros usuarios han plantado, construyendo así una comunidad comprometida con el planeta.

---

## ✨ Funcionalidades principales

- 🌿 **Banco de retos ecológicos** — catálogo de retos disponibles para completar y reducir tu huella de carbono
- 🌳 **Registro de árboles plantados** — registra la ubicación exacta de cada árbol plantado
- 🗺️ **Mapa comunitario** — visualiza en el mapa todos los árboles plantados por la comunidad
- 👤 **Sistema de cuentas** — registro e inicio de sesión con perfil de usuario
- 🏅 **Sistema de niveles** — progresa de nivel según tu actividad ecológica

---

## 🏗️ Arquitectura

```
┌─────────────────┐     ┌─────────────────┐
│   App Android   │     │    Web (React)   │
│    (Kotlin)     │     │  Bootstrap · JS  │
└────────┬────────┘     └────────┬────────┘
         │                       │
         └──────────┬────────────┘
                    │ HTTP / REST
         ┌──────────▼────────────┐
         │     API REST propia   │
         │  Node.js · Render     │
         │  https://ecomision-   │
         │  api.onrender.com/api │
         └──────────┬────────────┘
                    │
         ┌──────────▼────────────┐
         │     Base de datos     │
         │        SQL            │
         └───────────────────────┘
                    +
         ┌──────────────────────┐
         │      Maps API        │
         │  Geolocalización de  │
         │  árboles plantados   │
         └──────────────────────┘
```

---

## 🛠️ Stack tecnológico

### Frontend Web
| Tecnología | Uso |
|---|---|
| React | Framework de UI |
| Bootstrap | Estilos y componentes |
| JavaScript | Lógica de la aplicación |
| CSS | Estilos personalizados |

### App Android
| Tecnología | Uso |
|---|---|
| Kotlin | Lenguaje principal |
| Android nativo | SDK y componentes nativos |
| Maps API | Visualización del mapa |

### Backend
| Tecnología | Uso |
|---|---|
| Node.js | Runtime del servidor |
| REST API | Comunicación cliente-servidor |
| SQL | Base de datos |
| Render | Despliegue del servidor |

---

## 🚀 Repositorios

Este proyecto está dividido en dos repositorios:

| Repositorio | Descripción |
|---|---|
| [`ecomision-web`](https://github.com/dante312w/EcoMisionWeb.git) | Frontend web en React |
| [`ecomision-android`](https://github.com/dante312w/EcoMIsion.git) | App Android en Kotlin |
| |



---

## ⚙️ Instalación y uso local

### Requisitos previos
- Node.js v18+
- Android Studio (para la app móvil)
- API Keys: Maps API

### Web

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/ecomision-web.git
cd ecomision-web

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tu API key de mapas

# Correr en desarrollo
npm run dev
```

### Android

1. Clonar el repositorio de la app Android
2. Abrir el proyecto en Android Studio
3. Agregar tu API key de mapas en `local.properties`:
   ```
   MAPS_API_KEY=tu_api_key_aqui
   ```
4. Correr en emulador o dispositivo físico

### API

La API está desplegada en Render y disponible en:

```
https://ecomision-api.onrender.com/api
```

No es necesario correrla localmente para el frontend o la app.

---

## 📡 API Endpoints principales

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/api/auth/register` | Registro de usuario |
| `POST` | `/api/auth/login` | Inicio de sesión |
| `GET` | `/api/retos` | Obtener banco de retos |
| `POST` | `/api/arboles` | Registrar árbol plantado |
| `GET` | `/api/arboles` | Obtener todos los árboles (mapa) |
| `GET` | `/api/usuarios/:id` | Perfil y nivel del usuario |



---

## 👥 Equipo

| Nombre | Rol |
|---|---|
| Daniel Alejandro Acosta Silva| Desarrollo Android · Backend |
| Astrid Carolina Martinez Guzman | Desarrollo Web · Backend |

---

## 📄 Licencia

Este proyecto fue desarrollado con fines académicos.

---

<p align="center">
  Hecho con 🌱 para un planeta más verde
</p>
