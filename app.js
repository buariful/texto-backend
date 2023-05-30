const express = require("express");
const chatRoutes = require("./routes/chat.route");
const userRoutes = require("./routes/user.route");
const messageRoutes = require("./routes/messaage.route");
const cors = require("cors");
const errorMiddleWare = require("./middleware/errorHandler");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1", chatRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", messageRoutes);

app.get("/", (req, res) => {
  res.send("server is running so fast as Usain Bolt");
});

app.use(errorMiddleWare);

module.exports = app;
