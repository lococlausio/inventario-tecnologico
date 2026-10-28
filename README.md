# Sistema de Inventario de Equipamiento Tecnológico

Aplicación web cliente-servidor para registrar y administrar el equipamiento tecnológico de una institución. Permite mantener un inventario centralizado, consultar los equipos y actualizar su información.



## Tecnologías utilizadas

- **Frontend:** Vue.js 3 (Vite) y Bootstrap 5
- **Backend:** NestJS (TypeScript) con TypeORM
- **Base de datos:** MySQL (XAMPP / MariaDB)
- **Validación:** class-validator y class-transformer
- **Comunicación:** HTTP y JSON (`fetch`)

## Arquitectura

```
Vue.js / Vite  --fetch (HTTP · JSON)-->  NestJS REST API
                                           Controller -> Service -> TypeORM Repository -> MySQL
```

## Requisitos de instalación

- Node.js (desarrollado con v24) y npm
- Git
- XAMPP con el módulo MySQL (o cualquier servidor MySQL 8 / MariaDB)

## Configuración de la base de datos

1. Inicie el módulo **MySQL** desde el panel de XAMPP.
2. Abra phpMyAdmin (`http://localhost/phpmyadmin`) y cree la base de datos `inventario_tecnologico` con cotejamiento `utf8mb4_general_ci`.
3. No es necesario crear tablas a mano: TypeORM crea la tabla `equipos` automáticamente al iniciar el backend (`synchronize: true`, solo para desarrollo).

## Ejecución

### Backend

```bash
cd backend
npm install
cp .env.example .env     # en Windows: copy .env.example .env
npm run start:dev
```


### Frontend

```bash
cd frontend
npm install
npm run dev
```


### Datos de prueba

Con el backend en ejecución, el archivo `backend/datos-prueba.http` contiene 5 equipos de ejemplo. Puede enviarse con la extensión REST Client de VS Code (una petición por bloque) para poblar la base de datos.

## Variables de entorno

Archivo `backend/.env.example` (el archivo `.env` real no se publica):

| Variable | Descripción | Valor de ejemplo |
|---|---|---|
| `DB_HOST` | Servidor MySQL | `localhost` |
| `DB_PORT` | Puerto de MySQL | `3306` |
| `DB_USERNAME` | Usuario de MySQL | `root` |
| `DB_PASSWORD` | Contraseña de MySQL | (vacía en XAMPP) |
| `DB_NAME` | Nombre de la base de datos | `inventario_tecnologico` |

## Endpoints de la API

| Método | Endpoint | Función | Respuestas |
|---|---|---|---|
| GET | `/equipos` | Listar todos los equipos | 200 |
| GET | `/equipos/:id` | Obtener un equipo por ID | 200, 404 |
| POST | `/equipos` | Registrar un equipo | 201, 400 |
| PATCH | `/equipos/:id` | Actualizar un equipo | 200, 400, 404 |
| DELETE | `/equipos/:id` | Eliminar un equipo | 200, 404 |

### Reglas de validación

- `codigoInventario` y `nombre`: obligatorios, mínimo 3 caracteres.
- `tipo`, `marca`, `modelo` y `ubicacion`: obligatorios, no vacíos.
- `estado`: solo `Disponible`, `En uso`, `Mantención` o `Baja`.
- `fechaAdquisicion`: fecha válida (formato `AAAA-MM-DD`).
- `observaciones`: opcional.
- Los campos no declarados en el DTO se descartan (`whitelist`).

## Estructura del proyecto

```
inventario-tecnologico/
├── backend/
│   ├── src/
│   │   ├── equipos/
│   │   │   ├── dto/               # CreateEquipoDto y UpdateEquipoDto (validaciones)
│   │   │   ├── entities/          # Entidad Equipo (TypeORM)
│   │   │   ├── equipos.controller.ts
│   │   │   ├── equipos.service.ts
│   │   │   └── equipos.module.ts
│   │   ├── app.module.ts          # Conexión a MySQL y módulos
│   │   └── main.ts                # ValidationPipe y CORS
│   ├── pruebas.http               # Pruebas de la API
│   ├── datos-prueba.http          # 5 equipos de ejemplo
│   └── .env.example
└── frontend/
    └── src/
        ├── components/            # EquipoForm.vue y EquipoDetalle.vue
        ├── services/api.js        # Llamadas fetch a la API
        ├── constants.js
        ├── App.vue                # Listado, búsqueda y filtros
        └── main.js
```

## Declaración de uso de Inteligencia Artificial

| Herramienta | Parte del proyecto | Tipo de apoyo |
| Claude (Anthropic) | Planificación del proyecto | Explicación y organización por fases |
| Claude (Anthropic) | Backend |Explicación del codigo | Comprobación de endpoints y verificación de datos en phpmyadmin. |
| Claude (Anthropic) | Frontend Vue | Explicación del codigo y comprobación del flujo del frontend en el navegador |

## Pruebas realizadas

**API (REST Client, archivo `backend/pruebas.http`):**
- Crear, listar, obtener por ID, actualizar (PATCH parcial) y eliminar equipos.
- ID inexistente: responde 404.
- Datos inválidos (estado no permitido, nombre corto): responde 400 con los mensajes del DTO.
- Campo no declarado en el DTO: se descarta y no se guarda.
- Persistencia: los datos permanecen después de reiniciar el backend y se ven en phpMyAdmin.

**Frontend (manual, en el navegador):**
- Listado de equipos con indicador de carga.
- Registro de un equipo nuevo, con y sin errores de validación.
- Visualización del detalle y edición de un equipo existente.
- Eliminación con confirmación previa (probada cancelando y aceptando).
- Búsqueda por texto y filtro por estado.
- Mensaje de error comprensible con el backend apagado.
- La lista se actualiza después de crear, editar o eliminar.