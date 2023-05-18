const data = require("../data/data");
const ChatModel = require("../model/chat.model");
const UserModel = require("../model/user.model");

exports.getAllChats = async (req, res) => {
  try {
    let chat = await ChatModel.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
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

exports.createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    res.status(400).json({
      success: false,
      message: "Given information isn't enough",
    });
  }

  let usersArray = JSON.parse(req.body.users);
  if (req.body.users.length < 2) {
    return res.status(401).json({
      success: false,
      message: "minimum 2 users required",
    });
  }
  usersArray.push(req.user);

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
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
