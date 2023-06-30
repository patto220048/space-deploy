const mongoose = require('mongoose').set('strictQuery', false)

async function connect () {

    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Sever connected with MongoDB");
    } catch (error){
        console.log("sever connect fail ");
    }

};

module.exports =  {connect} ; 