# Supermarket Frontend

Proyecto desarrollado para la Actividad Colaborativa II:
Taller Integrador – Frontend SPA del Supermercado.

## Integrantes

- María Alejandra López Ríos
- Valeria Ortiz Cubillos

## Descripción

Aplicación SPA para administrar productos, usuarios, proveedores y ventas del supermercado MarketSoft.

Cada módulo permite consultar, crear, editar y eliminar registros mediante solicitudes a la API REST del backend.

## Tecnologías

- React
- Vite
- Axios
- React Router DOM
- Bootstrap
- CSS

## Requisitos

- Node.js y npm instalados.
- Backend del supermercado configurado y ejecutándose.
- Base de datos PostgreSQL configurada según las instrucciones del backend.

## Instalación y ejecución

Clonar el repositorio:

```bash
git clone https://github.com/malr211097/Supermarket-frontend.git
```

Entrar en la carpeta de la aplicación:

```bash
cd Supermarket-frontend/supermarket
```

Instalar las dependencias:

```bash
npm install
```

Iniciar el frontend:

```bash
npm start
```

Abrir en el navegador la dirección que indique la terminal, normalmente:

```text
http://localhost:5173
```

El backend debe estar activo para consultar y modificar los registros.

Repositorio del backend:

https://github.com/malr211097/Supermarket-backend

## Conexión con el backend

La configuración de Axios se encuentra en:

`src/services/api.js`

La dirección base utilizada es:

```text
http://localhost:3000/api
```

Los servicios consumen los siguientes endpoints:

| Módulo | Endpoint |
| --- | --- |
| Productos | /api/product |
| Usuarios | /api/user |
| Proveedores | /api/provider |
| Ventas | /api/sale |

Las operaciones utilizan GET, POST, PUT y DELETE.
Para actualizar o eliminar un registro se incluye su identificador en la URL.

## Arquitectura

El código está organizado dentro de `src`:

| Carpeta o archivo | Responsabilidad |
| --- | --- |
| components/layout/MainLayout.jsx | Estructura principal, navegación y área de contenido |
| pages | Interfaces de los módulos y manejo de formularios |
| services | Configuración de Axios y solicitudes HTTP |
| styles | Estilos globales y estilos compartidos |
| App.jsx | Configuración de las rutas |
| main.jsx | Inicio de React e importación de los estilos |

Los componentes gestionan la presentación y la interacción del usuario.
Los servicios realizan las solicitudes a la API.
Las reglas de negocio y la persistencia de datos permanecen en el backend.

## Navegación

| Ruta | Página |
| --- | --- |
| / | Home |
| /products | Products |
| /users | Users |
| /providers | Providers |
| /sales | Sales |

## Formularios y estilos

Cada módulo incluye una tabla de registros, un botón de creación y acciones de edición y eliminación.

Los formularios de creación y edición se presentan mediante modales.

Bootstrap se utiliza para la distribución responsiva del layout.
Los archivos `global.css` y `products.css` complementan la presentación.
Los estilos de tablas, botones, formularios y modales se comparten entre los módulos.

## Reutilización de código

Se conservó la estructura desarrollada en clase y se redujo la duplicación dentro de cada módulo mediante la reutilización de la carga de datos, el manejador de inputs y el formulario de creación y edición.

Las solicitudes HTTP permanecen en los servicios y las reglas de negocio en el backend.

## Ventas

Los formularios de ventas permiten registrar y editar el usuario y la fecha.

El total se muestra en la tabla y su cálculo corresponde al backend a partir de los detalles de la venta.

## Compilación

Para generar la versión de producción:

```bash
npm run build
```

Los archivos generados se guardan en la carpeta `dist`.

## Control de versiones

El proyecto se administra mediante Git y GitHub.
Las dependencias de `node_modules` y los archivos generados de `dist` se excluyen mediante `.gitignore`.
