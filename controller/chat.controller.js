const data = require("../data/data");

exports.getAllChats = (req, res) => {
  res.send(data);
};

exports.getSingleChat = (req, res) => {
  const chatId = req.params.id;
  const singleChat = data.find((d) => d._id === chatId);

  res.status(200).json(singleChat);
};
