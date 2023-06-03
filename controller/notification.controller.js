const NotificationModel = require("../model/notification.model");
const ErrorClass = require("../utils/errorClass");

exports.getAllNotification = async (req, res, next) => {
  const notifications = await NotificationModel.find({ userId: req.user._id });
  if (!notifications || notifications.length === 0) {
    return next(new ErrorClass("No notification found", 400));
  }
  return res.status(200).json({
    success: true,
    total: (await notifications).length,
    data: notifications,
  });
};

exports.deleteNotification = async (req, res, next) => {
  const { chatId } = req.body;
  if (!chatId) {
    return next(new ErrorClass("Please provide enough information", 400));
  }

  let delQuery = {
    chatId,
    userId: req.user._id,
  };
  const notifications = await NotificationModel.deleteMany(delQuery);
  if (!notifications) {
    return next(new ErrorClass("No notification found", 400));
  }

  return res
    .status(200)
    .json({ success: true, message: "Deleted your desire notifications" });
};
