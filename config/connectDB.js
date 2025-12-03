const mongoose = require("mongoose")



const connectDb = async () => {

    try {
        const connectionString = "mongodb://localhost:27017/Lumiro"
        await mongoose.connect(connectionString)  
        console.log("Db Connected ")   
    } catch (error) {
        console.log(error)
    }
}




module.exports = connectDb