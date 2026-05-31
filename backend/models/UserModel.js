import { Schema, model } from "mongoose";

const userSchema = new Schema(
    {
        firstName : {
            type: String,
            minLength: [3, 'First name must be at least 3 characters long'],
            lowercase: true,
            required : [true, 'First name is required']
        },
        lastName : {
            type: String,
            minLength: [3, 'Last name must be at least 3 characters long'],
            lowercase: true,
        },
        mobile : {
            type : String, // 🚨 CRITICAL: Changed from Number to String for regex matching
            required : [true , 'Mobile number is required'],
            unique : true,
            match : [/^[6-9]\d{9}$/ , 'Enter a valid 10-digit mobile number']
        },
        email: {
            type: String,
            required: [true, 'Email address is required'],
            unique: true,
            trim: true, 
            lowercase: true, 
            match: [/^[a-z0-9.]+@gmail\.com$/, 'Please enter a valid Gmail address']

        },
        password : {
            type : String,
            minLength: [4, 'Password must be at least 4 characters long'],
            maxLength: 60,
            required : [true, 'Password is required']
        },
        isActive :{
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        strict: "throw"
    }
);

export const UserModel = model('user', userSchema);
