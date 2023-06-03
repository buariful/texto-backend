const mongoose = require("mongoose");
// mongoose.Schema.Types.ObjectId,
const notificationSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatModel",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
    },
    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MessageModel",
    },
  },
  {
    timeStamps: true,
  }
);

const NotificationModel = mongoose.model(
  "NotificationModel",
  notificationSchema
);
module.exports = NotificationModel;
