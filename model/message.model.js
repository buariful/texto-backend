const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "ChatModel" },
    notifications: [
      { type: mongoose.Schema.Types.ObjectId, ref: "NotificationModel" },
    ],
  },
  {
    timestamps: true,
  }
);

const MessageModel = mongoose.model("MessageModel", messageSchema);
module.exports = MessageModel;
