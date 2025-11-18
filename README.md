# 🏆 Copa 360 - Pagina Web de Historia de los Mundiales

**Copa 360** es un prototipo funcional de una red social y archivo histórico enfocado en la Copa Mundial de la FIFA. Permite a los usuarios explorar momentos históricos, interactuar con publicaciones y mantenerse al día con noticias del mundo del fútbol.

El proyecto simula una experiencia completa de "Single Page Application" (SPA) utilizando tecnologías web estándar, con gestión de roles (Usuario vs. Administrador) y carga dinámica de datos.

---

## Características Principales

### Experiencia de Usuario
* **Feed Interactivo:** Visualización de publicaciones con soporte multimedia (imágenes).
* **Interacción Social:** Sistema de "Me gusta", calificación por estrellas y comentarios simulados.
* **Filtrado Avanzado:** Búsqueda en tiempo real por Categoría, Año del Mundial, País Sede o Usuario.
* **Perfil Personal:** Panel de control para gestionar datos personales y visualizar estadísticas de impacto (Vistas/Likes) de las publicaciones propias.
* **Accesibilidad:** Herramientas integradas para ajuste de tamaño de fuente y lectura de texto por voz (Text-to-Speech).

### Panel de Administración (Rol: Admin)
* **Gestión de Contenido (CMS):** Interfaz para agregar nuevos Mundiales al archivo histórico.
* **Moderación:** Herramientas para eliminar comentarios inapropiados directamente desde el feed.
* **Curación de Contenido:** Panel de "Administración de Publicaciones" para aprobar o declinar contenido generado por usuarios antes de que se haga público.
* **Gestión de Taxonomía:** Capacidad para gestionar las categorías de filtrado.

---

## Tecnologías Utilizadas

* **HTML5:** Estructura semántica y maquetación.
* **CSS3:** Diseño responsivo, Grid Layout, Flexbox y animaciones (transiciones de modales).
* **JavaScript (Vanilla ES6+):** Lógica de negocio, manipulación del DOM, y manejo de datos asíncronos (`fetch`).
* **JSON:** Almacenamiento de datos estructurados para simular una base de datos (Publicaciones por categoría).
* **FontAwesome:** Iconografía para la interfaz de usuario.

---

## Instalación y Uso

Este proyecto no requiere instalación de dependencias (como Node.js). Para visualizarlo correctamente debido a las políticas de seguridad de los navegadores (CORS para archivos JSON):

1.  **Clonar o Descargar** este repositorio.
2.  Abrir la carpeta del proyecto en **Visual Studio Code**.
3.  Instalar la extensión **"Live Server"**.
4.  Hacer clic derecho en `index.html` y seleccionar **"Open with Live Server"**.

### Credenciales de Prueba (Simulación)

Para probar los diferentes roles del sistema:

* **Usuario Estándar:**
    * Simplemente inicia sesión sin marcar la casilla "Admin".
* **Administrador:**
    * En el login, marca la casilla **☑️ Admin**.
    * Esto desbloqueará el botón `+` en filtros, el botón "Agregar Mundial" y las opciones de moderación.

---

## Estructura del Proyecto

* `/Datos`: Contiene los archivos JSON que alimentan el feed (`Jugadas.json`, `Todo.json`, etc.).
* `/ImagenesProyecto`: Recursos gráficos, avatares y banderas.
* `index.html`: Estructura única de la aplicación.
* `style.css`: Estilos globales y temas (Claro/Oscuro).
* `Script.js`: Lógica de control, enrutamiento simulado y renderizado de componentes.

---

**Desarrollado para la materia de Interfaz y Experiencia de Usuario.**