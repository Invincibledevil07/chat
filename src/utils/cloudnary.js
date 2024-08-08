import {v2 as cloudinary} from "cloudinary";
import fs from "fs"

cloudinary.config({ 
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
});

const uploadOnCloudinary=async (LocalFilePath)=>{
    try {
        if(!LocalFilePath) return null
        //method that clodary have
        const response=await cloudinary.uploader.upload(LocalFilePath,{
            resource_type:"auto"
        })
        console.log("file is upload") 
        return  response
        
    } catch (error) {
        fs.unlinkSync(LocalFilePath)
        return null;// remoe the locally savd temp file as the upload op faild
        
    }

}
export{uploadOnCloudinary}