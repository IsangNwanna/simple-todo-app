# Daymark — Simple To-Do Application

A small full-stack to-do app built with React, Vite, Node.js, and Express. Tasks can be added, completed, filtered, and deleted. The API stores tasks in memory, so they reset when the server restarts.

## Requirements

- Node.js 18 or newer
- npm

## Run locally

1. Install dependencies from the project root:

   ```sh
   npm install
   ```

2. Start the Vite development server and Express API together:

   ```sh
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173). The development server forwards `/api` requests to Express on port 3001.

To run the API alone, use `npm run dev:server`. To create a production build, run `npm run build`, then run `npm start` and open [http://localhost:3001](http://localhost:3001). Set `PORT` to choose a different API port.

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/todos` | List all tasks |
| POST | `/api/todos` | Add a task with `{ "title": "..." }` |
| PUT | `/api/todos/:id` | Update a task with `title` and/or `completed` |
| DELETE | `/api/todos/:id` | Delete a task |

The Express server parses JSON and enables CORS. It serves the Vite build from `dist` in production. Task data lives only in the server process memory, as specified in the assignment.
