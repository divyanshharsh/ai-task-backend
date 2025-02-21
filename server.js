const { Server } = require("socket.io");

const io = new Server(4000, {
  cors: { origin: "http://localhost:3000" },
});

let tasks = [
  { id: 1, title: "Complete UI Design", completed: false },
  { id: 2, title: "Integrate JWT Auth", completed: false },
  { id: 3, title: "Connect WebSockets", completed: true },
];

io.on("connection", (socket) => {
  console.log("New client connected");

  // Send initial task list
  socket.emit("taskList", tasks);

  // Handle new task
  socket.on("newTask", (task) => {
    tasks.push(task);
    io.emit("taskList", tasks); // Broadcast updated list
  });

  // Handle task deletion
  socket.on("deleteTask", (taskId) => {
    tasks = tasks.filter((task) => task.id !== taskId);
    io.emit("taskList", tasks); // Broadcast updated list
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

console.log("WebSocket server running on port 4000");
