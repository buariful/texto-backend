const express = require("express");
const {
  getAllChats,
  accessOneChat,
  createGroupChat,
  renameGroup,
} = require("../controller/chat.controller.js");
const { protect } = require("../middleware/authMiddleware.js");
const router = express.Router();

router.route("/chats").get(protect, getAllChats);
router.route("/access-one-chat").post(protect, accessOneChat);
router.route("/group").post(protect, createGroupChat);
router.route("/rename-group").put(protect, renameGroup);

module.exports = router;
