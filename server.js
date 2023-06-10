const app = require("./app");
const dotenv = require("dotenv");
const connectDB = require("./config/database");

dotenv.config();
const port = process.env.PORT || 5000;

connectDB();

const server = app.listen(port, () => {
  console.log(`server is ok and running on port: ${port}`);
});
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CLIENT_SITE_URL,
  },
});

console.log(
  process.env.CLOUD_API_KEY,
  process.env.CLOUD_API_SECRET,
  process.env.CLIENT_SITE_URL
);
io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("typing", (room) => {
    socket.to(room).emit("typing", room);
  });

  socket.on("stop typing", (room) => {
    socket.to(room).emit("stop typing");
  });

  // socket.on("typing", (room) => socket.in(room).emit("typing"));
  // socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    let chat = newMessageRecieved.chat;
    if (!chat.users) {
      return console.log("chat.users no foundsssssss");
    }

    chat.users.forEach((user) => {
      if (user._id === newMessageRecieved.sender._id) return;
      socket.to(user._id).emit("message recieved", newMessageRecieved);
      socket.to(user._id).emit("stop typing", chat._id);
    });
  });
});
