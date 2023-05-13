const express = require("express");
const {
  getAllChats,
  getSingleChat,
} = require("../controller/chat.controller.js");
const router = express.Router();

router.route("/chat").get(getAllChats);
router.route("/chat/:id").get(getSingleChat);

module.exports = router;
