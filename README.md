# API NGS (Node Graphql Sequelize )

Esta API está construida con **Node.js (v12)**, **TypeScript**, **Sequelize (MySQL)** y **GraphQL**.

El sistema permite gestionar usuarios (Anfitriones y Viajeros), propiedades, bloqueos de fechas y reservas con validación de solapamiento.

---
## Requisitos Previos

Asegurarse de tener instalado:

* **Node.js:** Versión 12.x (Requisito estricto por compatibilidad).
* **MySQL:** Base de datos relacional.
* **NPM:** Gestor de paquetes.
---

## 🚀 Instalación y Configuración

Pasos para levantar el entorno local:

### 1. Clonar e Instalar

```bash
npm install
```
### 2. Configurar Variables de Entorno

Crea un archivo .env en la raíz del proyecto con las siguientes variables:

```bash
# DATABASE (MySQL)
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=

# API PORT (Opcional)
PORT=

# JWT
JWT_SECRET=
JWT_EXPIRATION=
```

### 3. Crear la Base de Datos
Ingresa a tu cliente de MySQL (Workbench, DBeaver o Terminal) y crea la base de datos vacía.

SQL
```SQL
CREATE DATABASE tu_nombre_de_base_de_datos;
```

## Scripts de Ejecución
El proyecto cuenta con scripts para desarrollo y pruebas.

#### Iniciar Servidor (Modo Desarrollo)
Este comando levanta el servidor preservando los datos existentes en la base de datos.
```bash
npm run dev
```

#### Iniciar con Datos
Este comando borra la base de datos, crea las tablas nuevamente, inserta datos de prueba (Usuarios, Propiedades, Reservas) y levanta el servidor automáticamente

```bash
npm run dev:seed
```

## Acceso a la API

Servidor: http://localhost:4000
Playground: http://localhost:4000/graphql

### Datos de Prueba
Si ejecutaste npm run dev:seed, puedes usar estas credenciales pre-cargadas para probar el sistema inmediatamente:
| Rol | Email | Password | Descripción |
| :--- | :--- | :--- | :--- |
| **Owner** | `dilan@gmail.com` | `123` | Tiene 2 propiedades (Playa y Cabaña). |
| **Owner** | `sandra@gmail.com` | `123` | Tiene 1 propiedad (Casa Ciudad). |
| **Traveler** | `gybram@traveler.com` | `123` | Ya tiene reservas activas. |
| **Traveler** | `elkin@traveler.com` | `123` | Usuario para pruebas nuevas. |

## Estructura del Proyecto
El código sigue una arquitectura modular y limpia:
* **src/graphql:** Esquemas y Resolvers separados por dominio.
* **src/services:** Lógica de negocio pura (validaciones, cálculos).
* **src/models:** Definiciones de tablas (Sequelize).
* **src/db:** Configuración de conexión y scripts de Seeding.
* **src/utils:** Middlewares de permisos y helpers.