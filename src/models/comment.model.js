import mongoose, { Schema } from mongoose;

const commentSchema=new Schema({
    
        _id: {
          type: ObjectId,
          required: true
        },
        postId: {
          type: ObjectId,
          required: true
        },
        authorUsername: {
          type: string,
          required: true
        },
        content: {
          type: string,
          required: true
        },
       
      
},{timestamps:true})

export const Comment=mongoose.model(Comment,ommentSchema)