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
// app.post("/api/upload", upload.single("image"), async (req, res) => {
//   try {
//     // Upload the image file to Cloudinary
//     const result = await cloudinary.uploader.upload(req.file.path);

//     // Retrieve the image URL from the Cloudinary response
//     const imageUrl = result.secure_url;

//     // Perform any additional operations with the image URL (e.g., save to database)

//     // Send the image URL back to the frontend
//     return res.json({ imageUrl, result });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Image upload failed" });
//   }
// });

app.use("/api/v1", chatRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", messageRoutes);
app.use("/api/v1", notificationRoutes);

app.get("/", (req, res) => {
  res.send("server is running so fast as Usain Bolt");
});

app.use(errorMiddleWare);

module.exports = app;
