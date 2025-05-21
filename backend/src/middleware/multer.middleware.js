import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from '../config/cloudinary.js'

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "profile-pics",
        allowed_formats: ['jpg', 'jpeg', 'png', "webp"],
        resource_type: 'auto',
        //  public_id: `${req.user.id}-${Date.now()}`
    }
})
export const upload = multer({ storage })