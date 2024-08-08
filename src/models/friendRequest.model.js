import mongoose,{Schema} from mongoose;

const friendRquestSchema=new Schema({
    
        _id: {
          type: ObjectId,
          required: true
        },
        senderUsername: {
          type: string,
          required: true
        },
        receiverUsername: {
          type: string,
          required: true
        },
        status: {
          type: string,
          required: true,
          enum: [pending, accepted, rejected]
        }
       
      
      
},{timestamps:true})

export const Friendrequest=mongoose.model(Friendrequest,friendRquestSchema)