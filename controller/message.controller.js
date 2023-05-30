const ErrorClass = require("../utils/errorClass");
const MessageModel = require("../model/message.model");
const UserModel = require("../model/user.model");
const ChatModel = require("../model/chat.model");

exports.sendMessage = async (req, res, next) => {
  const { content, chatId } = req.body;

  if (!content | !chatId) {
    return next(new ErrorClass("Invalid Request", 400));
  }

  const newMessage = {
    sender: req.user._id,
    content,
    chat: chatId,
  };
  try {
    let message = await MessageModel.create(newMessage);

    message = await message.populate("sender", "name picture");
    message = await message.populate("chat");
    message = await UserModel.populate(message, {
      path: "chat.users",
      select: "name picture email",
    });

    await ChatModel.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    res.status(200).json({ success: true, data: message });
  } catch (err) {
    return next(new ErrorClass(err.message, 400));
    // res.send(err);
  }
};

exports.getAllMessages = async (req, res, next) => {
  try {
    const messages = await MessageModel.find({
      chat: req.params.chatId,
    }).populate("sender", "name picture");
    // .populate("sender", "name picture email")
    // .populate("chat");

    if (messages.length === 0) {
      return next(
        new ErrorClass("There are not messages. Send your first Message", 400)
      );
    }

    res.status(200).json({
      success: true,
      totalMessage: messages.length,
      data: messages,
    });
  } catch (err) {
    return next(new ErrorClass(err.message, 200));
  }
};
