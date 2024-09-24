# Proyecto Final de BackEnd

Este es el proyecto final del curso de BackEnd, desarrollado en Node.js. El proyecto consiste en una API RESTful para gestionar productos, carritos de compras, usuarios, tickets, y un sistema de chat en tiempo real utilizando Socket.io.

## Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución.
- **Express.js**: Framework para la creación del servidor.
- **MongoDB**: Base de datos NoSQL utilizada para el almacenamiento de información.
- **Mongoose**: ODM para la interacción con MongoDB.
- **Passport.js**: Manejo de autenticación.
- **Socket.io**: Comunicación en tiempo real para el sistema de chat.
- **Multer**: Middleware para la carga de archivos.
- **Swagger**: Documentación de la API.
- **Handlebars**: Motor de plantillas para las vistas.
- **Mocha, Chai y Supertest**: Pruebas unitarias e integrales.

## Funcionalidades Principales

1. **Autenticación y Autorización**
   - Autenticación de usuarios mediante Passport.js.
   - Autorización basada en roles (admin, user, premium).
   - Ruta protegida para la gestión de productos y roles.

2. **Gestión de Productos**
   - CRUD de productos.
   - Los usuarios con rol `premium` pueden agregar y eliminar sus propios productos.
   - Los administradores pueden eliminar cualquier producto.
   - Notificaciones por correo electrónico a los usuarios premium cuando sus productos son eliminados.

3. **Carrito de Compras**
   - Añadir productos al carrito.
   - Visualizar el carrito y proceder con la compra.
   - Emisión de tickets tras finalizar la compra.

4. **Gestión de Usuarios**
   - Registro y login de usuarios.
   - Actualización de perfil y subida de documentos para convertir usuarios en premium.
   - El administrador puede ver y gestionar (actualizar rol o eliminar) usuarios.

5. **Sistema de Chat**
   - Sistema de chat en tiempo real entre usuarios utilizando Socket.io.
   - Los mensajes se almacenan y muestran en tiempo real a través de una interfaz basada en Handlebars.

6. **Documentación de API**
   - Documentación de los endpoints utilizando Swagger. Disponible en `/apidocs`.

7. **Pruebas**
   - Pruebas unitarias e integrales de los endpoints de la API usando Mocha, Chai y Supertest.

## Instalación

1. Clona este repositorio:

    ```bash
    git clone https://github.com/Srnaveira/Proyecto-final-de-BackEnd.git
2. Navega al directorio del proyecto:
    ```bash
    cd Proyecto-final-de-BackEnd
3. Instala las dependencias:
    ```bash
    npm install
4. Crea un archivo .env basado en el archivo .env.example con las siguientes variables de entorno:

5. Inicia el servidor:
    ```bash
    npm start
El servidor se iniciará en http://localhost:3000.

## Rutas y Endpoints
 ```bash
 - Autenticación
POST /register: Registro de nuevos usuarios.
POST /login: Inicio de sesión.

- Usuarios:
GET /api/users: Obtiene la lista de usuarios (solo administradores).
DELETE /api/users: Elimina usuarios inactivos.
GET /api/users/premium/:uid: Actualización de documentos para usuarios premium.

- Productos:
GET /api/products: Obtiene la lista de productos.
POST /api/products: Crea un nuevo producto (usuarios premium).
PUT /api/products/:pid: Actualiza un producto.
DELETE /api/products/:pid: Elimina un producto (usuarios premium para sus productos, admin para todos).

- Carrito:
GET /api/carts/:cid: Visualiza un carrito.
POST /api/carts/:cid/productos/:pid: Añade un producto al carrito.
DELETE /api/carts/:cid/productos/:pid: Elimina un producto del carrito.
POST /api/carts/:cid/checkout: Finaliza la compra y genera un ticket.

- Sistema de Chat:
GET /chat: Carga la vista del chat en tiempo real.

 - Documentación de la API:
La documentación de la API está disponible en la ruta /apidocs.

