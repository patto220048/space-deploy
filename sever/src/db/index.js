const mongoose = require('mongoose').set('strictQuery', false)

async function connect () {

    try{
    PORT = 4000
    PORT = 4000
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("sever connect success");
    } catch (error){
        console.log("sever connect fail ");
    }

};

module.exports =  {connect} ; 