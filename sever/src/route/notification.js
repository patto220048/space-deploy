const express = require('express');
const router = express.Router();

const notificationController = require('../controller/notificationController');
const veryfiToken  = require('../controller/veryfiToken')
//create notifi
router.post('/create',veryfiToken.verifyUser,notificationController.createNotifi)
router.get('/get',veryfiToken.verifyUser,notificationController.getNotifi)
router.delete('/delAll',veryfiToken.verifyUser,notificationController.delAllNotifi)
router.delete('/del/:reciverId/:postId/:type',veryfiToken.verifyUser,notificationController.delNotifiLike)
router.delete('/del/:reciverId/:type',veryfiToken.verifyUser,notificationController.delNotifiFollow)

module.exports  = router