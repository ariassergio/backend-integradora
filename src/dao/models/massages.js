import mongoose from "mongoose";
const {Schema} = mongoose

const collectionName  = "Messages"

const schema = new Schema({
    
   email: {
        type: String
    },
    message: {
        type: String
            
    }
})


const Message = mongoose.models[collectionName] || mongoose.model(collectionName, schema);

export default messagesModel