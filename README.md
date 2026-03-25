# User Management REST API

A lightweight, efficient REST API built with Node.js and Express for managing user data.

## Features
* **Full CRUD**: Create, Read, Update, and Delete users.
* **Filtering**: Search users by name or email using `?search=`.
* **Sorting**: Sort data dynamically using `?sort=name&order=asc`.
* **In-Memory Storage**: Fast execution without the need for external database setup.

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   npm run dev

I chose a Modular Monolith approach to prioritize speed and zero-dependency setup. By using Express middleware for JSON parsing and a clean array-based state, the API remains highly performant and easy to test without the overhead of an external database configuration.

## Live Demo
🔗 [View Live API](https://user-management-api-t3dy.onrender.com)

> **Note:** This API uses a free-tier hosting service. The instance may take ~30 seconds to "spin up" on the first request. Since the data is stored in-memory, the user list will reset to empty if the server restarts or goes into sleep mode.
