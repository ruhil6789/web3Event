import mongoose from "mongoose";

const userModel = new mongoose.Schema({
    userAddress:{
        type:String,
        required:[true,"User address is mandatory"]
    },
    userTransferAmount:{
        type:String,
        required:[true,"Amount is mandatory"]
    }
});

export default mongoose.model("UserModel", userModel);
