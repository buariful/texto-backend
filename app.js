const express = require("express");
const chatRoutes = require("./routes/chat.route");
const userRoutes = require("./routes/user.route");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1", chatRoutes);
app.use("/api/v1", userRoutes);

app.get("/", (req, res) => {
  res.send("server is running so fast as Usain Bolt");
});

module.exports = app;
