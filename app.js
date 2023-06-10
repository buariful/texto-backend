const express = require("express");
const chatRoutes = require("./routes/chat.route");
const userRoutes = require("./routes/user.route");
const messageRoutes = require("./routes/messaage.route");
const notificationRoutes = require("./routes/notification.route");
const cors = require("cors");
const errorMiddleWare = require("./middleware/errorHandler");
const bodyParser = require("body-parser");

const app = express();
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use(express.json());

app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));
app.use(bodyParser.json({ limit: "5mb", extended: true }));

app.use(cors());

app.use("/api/v1", chatRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", messageRoutes);
app.use("/api/v1", notificationRoutes);

app.get("/", (req, res) => {
  res.send("server is running so fast as Usain Bolt");
});

app.use(errorMiddleWare);

module.exports = app;
