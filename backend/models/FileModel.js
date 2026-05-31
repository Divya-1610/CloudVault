import { Schema,model } from "mongoose";

const fileschema = new Schema({
    filename:{type:String , minLength:3,required:[true,'file name required']},
    filetype:{type:String , enum: ['pdf', 'png', 'jpg', 'jpeg', 'docx', 'pages', 'txt', 'xlsx', 'zip', 'rar'],lowercase:true, required:[true,'filetype is required']},
    fileUrl: {type: String,required: [true, 'Cloudinary URL is required']},
    size: {type: Number, required: true},
    cloudinaryId: {type: String,required: [true, 'Cloudinary Public ID is required']},
    user : { type:Schema.Types.ObjectId, ref:'user',required:[true,'user is required']}

},{
    timestamps:true,
    strict:'throw'
}
)

export const FileModel = model ('file',fileschema)