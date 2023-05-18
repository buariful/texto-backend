const data = require("../data/data");
const ChatModel = require("../model/chat.model");
const UserModel = require("../model/user.model");

exports.getAllChats = (req, res) => {
  res.send(data);
};

exports.getSingleChat = async (req, res) => {
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
