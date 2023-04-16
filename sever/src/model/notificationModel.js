const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Notification = new  Schema({
    
    type:{
      type: Number,
      require:true
    },
    senderId:{
      type:String,
      require:true

    },
    receiverId:{
      type:String,
      require:true

    },
    senderName:{
      type:String,
      require:true

    },
    senderImg:{
      type:String,
  

    },
    postImg : {
      type:String,
    },
    decs : {
      type:String,
    
    },
    cmtId:{
      type:String,
    },
    postId:{
      type:String,
    }


 
   
    
    
},{timestamps: true})



module.exports = mongoose.model('Notification', Notification )
