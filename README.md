# Task Manager - Simple CRUD App

A simple full-stack CRUD (Create, Read, Update, Delete) application built with:
- **Backend:** Node.js + Express
- **Database:** SQLite (via `better-sqlite3`) — no separate database server needed
- **Frontend:** Plain HTML, CSS, and JavaScript

## Features
- Create new tasks (title, description, status)
- View all tasks
- Edit/update existing tasks
- Delete tasks
- Data persists in a local `tasks.db` SQLite file

## Project Structure
```
crud-app/
├── package.json
├── server.js        # Express server + REST API routes
├── db.js            # SQLite database setup
├── tasks.db         # (created automatically on first run)
└── public/
    ├── index.html   # Frontend page
    ├── style.css    # Styling
    └── script.js    # Frontend logic (calls the API)
```

## Setup & Run

1. Make sure you have [Node.js](https://nodejs.org/) installed (v16 or later recommended).
2. Open a terminal in the `crud-app` folder.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. Open your browser and go to:
   ```
   http://localhost:3000
   ```

That's it — you can now add, edit, and delete tasks from the page.

## API Endpoints (for reference / testing with Postman)

| Method | Endpoint          | Description            |
|--------|-------------------|-------------------------|
| GET    | /api/tasks        | Get all tasks           |
| GET    | /api/tasks/:id    | Get a single task       |
| POST   | /api/tasks        | Create a new task       |
| PUT    | /api/tasks/:id    | Update an existing task |
| DELETE | /api/tasks/:id    | Delete a task           |

Example POST body:
```json
{
  "title": "Finish assignment",
  "description": "Complete the CRUD app project",
  "status": "in-progress"
}
```

## Notes for Your Assignment
- This project demonstrates all 4 CRUD operations through a REST API and a connected frontend.
- The SQLite database file (`tasks.db`) is created automatically the first time you run the server — no manual database setup required.
- Feel free to rename "tasks" to whatever entity your assignment requires (e.g., "students", "products") by adjusting the table name and fields in `db.js` and `server.js`.
