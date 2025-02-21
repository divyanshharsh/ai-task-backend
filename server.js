const { Server } = require("socket.io");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "https://ai-task-manager-ten.vercel.app/" })); // ✅ Allow frontend to connect

const server = app.listen(4000, () => {
  console.log("Server running on port 4000");
});

const io = new Server(server, {
  cors: { origin: "https://ai-task-manager-ten.vercel.app/" }, // ✅ Allow WebSocket connections from frontend
});

let tasks = []; // ✅ Ensure tasks persist for all clients

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.emit("taskList", tasks); // ✅ Send current tasks when a client connects

  socket.on("newTask", (task) => {
    tasks.push(task);
    io.emit("taskList", tasks); // ✅ Broadcast updated task list to all clients
  });

  socket.on("deleteTask", (taskId) => {
    tasks = tasks.filter((task) => task.id !== taskId);
    io.emit("taskList", tasks);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
