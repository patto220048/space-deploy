const express = require('express');
const router = express.Router();

const commentController = require('../controller/commentController');
const veryfiToken  = require('../controller/veryfiToken')
//create comment
router.post('/create',veryfiToken.verifyUser,commentController.createComment)
//get comment
router.get('/:postId/find',veryfiToken.verifyUser,commentController.getComment)
//delete comment
router.delete('/:idCmt/delete',veryfiToken.verifyUser,commentController.deleteComment)
//get all cmt
router.get('/:postId/find/allComent',veryfiToken.verifyUser,commentController.getAllComment)


module.exports  = router