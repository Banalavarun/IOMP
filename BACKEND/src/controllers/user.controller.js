import { User } from "../models/user.model.js";
import httpStatus from "http-status";
import bcrypt,{ hash } from "bcrypt";
import crypto from "crypto";


const login = async (req,res) =>{
    const {username,password} = req.body;

    if(!username || !password)
            return res.status(400).json({message : "Please Provide"});
    try{
        let user = await User.findOne({username});
        if(!user){
            return res.status(httpStatus.NOT_FOUND).json({message : "The user doesn't exist"});
        }
        if(!(await bcrypt.compare(password,user.password))){
            return res.status(httpStatus.UNAUTHORIZED).json({"message" : "Wrong password"});
        }
        let token = crypto.randomBytes(20).toString("hex");
        user.token = token;
        await user.save();
        res.status(httpStatus.OK).json({message : "Token created Succesfully"});
    }
    catch(e){
        return res.status(500).json({message : `something went wrong ${e}`});
    }
}
const register = async (req,res) => {
    const {name, username, password} = req.body;

    try{
        const existingUser = await User.findOne({username});
        if(existingUser){
           return res.status(httpStatus.FOUND).send({message : "User already exists"});
        }

        const hashPassword =await bcrypt.hash(password,10);

        const newUser = new User({
            name : name,
            username : username,
            password : hashPassword
        });

        await newUser.save();
        res.status(httpStatus.CREATED).json({message : "User Created Succesfully"});
    }
    catch(e){
        res.json({message : `Something went wrong ${e}`});
    }
}

export {login , register}