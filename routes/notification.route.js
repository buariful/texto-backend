const {
  getAllNotification,
  deleteNotification,
} = require("../controller/notification.controller");
const { protect } = require("../middleware/authMiddleware");

const router = require("express").Router();
router
  .route("/notification")
  .get(protect, getAllNotification)
  .delete(protect, deleteNotification);
module.exports = router;
