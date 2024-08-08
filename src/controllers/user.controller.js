import { User } from "../models/user.model.js"
import { APIError } from "../util/ApiError.js"
import { uploadOnCloudinary } from "../util/cloudnary.js"
import{asyncHandler} from "../utils/asyncHandler.js"
import { ApiResponse } from "../util/ApiResponse.js"
import jwt from "jsonwebtoken"
import { upload } from "../middlewares/multer.middleware.js"

const generateAccessAndRefereshTokens =async(userId)=>{
    try {
      const user=  await User.findById(userId)
    const accessToken=user.generateAccessToken()
    const refreshToken=user.generateRefreshToken()
    user.refreshToken=refreshToken
     await user.save({validateBeforeSave:false})

     return{accessToken,refreshToken }

    } catch (error) {
        throw new APIError(500,"Something went wrong while generating token")
    }
}

const reisterUser= asyncHandler(async (req,res)=>{
    const {fullname,email,username,password}=req.body
    if(
        [fullname,email,username,password].some((field)=>
            field?.trim() ==="" 
        )
    ){
        throw new APIError(400,"all field is required")
    }
    
    const existUser=User.findOne({
        $or:[{username},{email}]
    })
    if(existUser){
        throw new APIError(409,"user already exist")
    }
    const avatarLocalPath=req.files?.avatar[0].path;
    const coverImageLocalPath=req.files?.coverImage[0].path;
    
    if(!avatarLocalPath){
        throw new APIError(400,"avatar")
    }
    const avatar=await uploadOnCloudinary(avatarLocalPath)
    const coverImage=await uploadOnCloudinary(coverImageLocalPath)
    if(!avatar){
        throw new APIError(400,"Avatar file is required")
    }
    const user=await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage.url || "",
        password,
        username:username.toLocaleLowerCase()
    })
    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new APIError(500,"soething went wrong while regitering the user")
    }
    return res.status(201).json(
        new ApiResponse(200,createdUser,"user created")
    )
    
    })

    const postSection=asyncHandler(async(res,req)=>{
        const userId = req.params.userId;

  
        const user = await User.findById(userId).populate('friends');
        if (!user) {
            throw new APIError(400,"user not found")
        }
      
        const friendIds = user.friends.map(friend => friend._id);
      
        
        const friendsPosts = await Post.find({ author: { $in: friendIds } });
      
      
        const postsWithFriendComments = await Comment.aggregate([
          { $match: { author: { $in: friendIds } } },
          { $group: { _id: '$post', comments: { $push: '$$ROOT' } } },
          { $lookup: {
            from: 'posts',
            localField: '_id',
            foreignField: '_id',
            as: 'post'
          }},
          { $unwind: '$post' },
          { $replaceRoot: { newRoot: '$post' } }
        ]);
      
       
        const allPosts = [...friendsPosts, ...postsWithFriendComments];
      
       
        const uniquePosts = Array.from(new Set(allPosts.map(post => post._id)))
          .map(id => allPosts.find(post => post._id.toString() === id.toString()));
      
        res.json(  new ApiResponse(200,uniquePosts,"user created"));
      
    })
    
export {reisterUser,postSection}


  
