const ChatModel = require("../model/chat.model");
const MessageModel = require("../model/message.model");
const NotificationModel = require("../model/notification.model");
const UserModel = require("../model/user.model");
const ErrorClass = require("../utils/errorClass");

exports.getAllChats = async (req, res) => {
  try {
    let chat = await ChatModel.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users")
      .populate("groupAdmin")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });
    chat = await UserModel.populate(chat, {
      path: "latestMessage.sender",
      select: "name, email, picture",
    });

    res.status(200).json({
      success: true,
      totalResutlts: chat.length,
      data: chat,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

exports.accessOneChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "A bad request. Bad user id" });
  }

  let isChat = await ChatModel.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await UserModel.populate(isChat, {
    path: "latestMessage.sender",
    select: "name, email, picture",
  });

  if (isChat.length > 0) {
    res.status(200).json(isChat[0]);
  } else {
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await ChatModel.create(chatData);
      const newChat = await ChatModel.findOne({
        _id: createdChat._id,
      }).populate("users", "-password");

      res.status(200).json(newChat);
    } catch (err) {
      res.status(401).json({
        success: false,
        message: err.message,
      });
    }
  }
};

exports.createGroupChat = async (req, res, next) => {
  if (!req.body.users || !req.body.name) {
    return next(new ErrorClass("Please fill all the fields", 400));
  }

  let usersArray = [...req.body.users, req.user];

  // let usersArray = JSON.parse(req.body.users);
  if (req.body.users.length < 2) {
    return res.status(401).json({
      success: false,
      message: "minimum 3 users required including you",
    });
  }
  // usersArray.push(req.user);

  try {
    const newGroup = await ChatModel.create({
      chatName: req.body.name,
      users: usersArray,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const groupChatInfo = await ChatModel.findById(newGroup._id)
      .populate("users")
      .populate("groupAdmin");

    res.status(200).json({
      success: true,
      total: groupChatInfo.length,
      data: groupChatInfo,
      message: "Group creation successfull",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

exports.renameGroup = async (req, res) => {
  const { chatName, chatId } = req.body;

  const updatedChat = await ChatModel.findByIdAndUpdate(
    chatId,
    { chatName },
    { new: true }
  )
    .populate("users")
    .populate("groupAdmin");

  if (!updatedChat) {
    return next(new ErrorClass("can not update the name", 401));
  } else {
    res.status(200).json({
      success: true,
      data: updatedChat,
    });
  }
};

exports.addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  const userAdded = await ChatModel.findByIdAndUpdate(
    chatId,
    { $push: { users: userId } },
    { new: true }
  )
    .populate("users")
    .populate("groupAdmin");

  res.send(userAdded);
};

exports.removeFormGroup = async (req, res, next) => {
  const { chatId, userId } = req.body;
  let message;
  const targetGroup = await ChatModel.findById(chatId);
  if (targetGroup?.groupAdmin._id.toString() !== req.user._id.toString()) {
    message = "Successfully leave from the group";
  } else {
    message = "Successfully removed from the group";
  }

  const removeUser = await ChatModel.findByIdAndUpdate(
    chatId,
    { $pull: { users: userId } },
    { new: true }
  )
    .populate("users")
    .populate("groupAdmin");

  res.status(200).json({ success: true, message });
};

exports.deleteGroup = async (req, res, next) => {
  const { chatId } = req.body;
  const targetChat = await ChatModel.findById(chatId);

  if (targetChat.groupAdmin.toString() !== req.user._id.toString()) {
    return next(new ErrorClass("Only Admin can delete this group", 403));
  }
  const deleteMessages = await MessageModel.deleteMany({ chat: chatId });
  const deleteNotifications = await NotificationModel.deleteMany({
    chatId: chatId,
  });
  const deleteGroup = await ChatModel.findByIdAndDelete(chatId);

  res.status(200).json({
    success: true,
    message: "Succesfully deleted the group",
  });
};
