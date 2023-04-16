const Post = require("../model/postModel");
const User = require("../model/userModel");
const Notification = require("../model/notificationModel");

class NotificationController {
  //create commnet
  async createNotifi(req, res, next) {
    const newNoti = await Notification({ ...req.body });
    try {
      const savedNoti = await newNoti.save();
      res.status(200).json(savedNoti);
    } catch (err) {
      res.status(500).json(err.message);
    }
  }
  async getNotifi(req, res, next) {
    const currentUserId = req.user.id;
    try {
      const notifi = await Notification.find({ receiverId: currentUserId });
      res.status(200).json(notifi);
    } catch (err) {
      res.status(500).json(err.message);
    }
  }

  async delAllNotifi(req, res, next) {
    try {
      await Notification.deleteMany();
      res.status(200).json("Delete sussecfull");
    } catch (err) {
      res.status(500).json(err.message);
    }
  }

  async delNotifiLike(req, res, next) {
    try {
      const notifiSended = await Notification.findOneAndDelete({
        senderId: req.user.id,
        receiverId: req.params.reciverId,
        type : req.params.type,
        postId : req.params.postId
      });
      res.status(200).json("Delete sussecfull");
    } catch (err) {
      res.status(500).json(err.message);
    }
  }

  async delNotifiFollow(req, res, next) {
    try {
      const notifiSended = await Notification.findOneAndDelete({
        senderId: req.user.id,
        receiverId: req.params.reciverId,
        type : req.params.type,
      });
      res.status(200).json("Delete sussecfull");
    } catch (err) {
      res.status(500).json(err.message);
    }
  }
}

module.exports = new NotificationController();
