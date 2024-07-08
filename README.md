# Proyecto AV Challenge

Este proyecto es una API RESTful construida con NestJS, diseñada para manejar múltiples módulos de funcionalidad.

## Características

- **NestJS**: Framework para construir aplicaciones escalables y mantenibles en Node.js.
- **Mongoose**: ODM para manejar la persistencia de datos en MongoDB.
- **JWT**: Autenticación y autorización basada en tokens.
- **Docker y Docker Compose**: Contenerización de la aplicación para un despliegue simplificado.
- **Swagger**: Documentación de la API.

## Requisitos

- Docker
- Docker Compose

## Instalación

1. Clona el repositorio:
    ```bash
    git clone https://github.com/kenyilewis/Av2b10sCnjlXA9glc2u.7L04auSKw9xVzfbjFYHTNiG4RSvwz17LlJB6qaNti0.git
    cd Av2b10sCnjlXA9glc2u.7L04auSKw9xVzfbjFYHTNiG4RSvwz17LlJB6qaNti0
    ```

2. Construye y corre los contenedores:
    ```bash
    docker-compose build
    docker-compose up
    ```

3. La aplicación estará disponible en `http://localhost:8000`.

## Uso

- **Documentación de la API**: Visita `http://localhost:8000/docs` para ver la documentación generada por Swagger.

## Desarrollo

Para correr la aplicación en modo desarrollo:

```bash
npm run start:dev
