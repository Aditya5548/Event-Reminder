import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    name:{type:String,required:true},
    dob:{type:String},
    gender:{type:String},
    phoneno:{type:String},
    email:{type:String,unique:true},
    password:{type:String},
    authtype:{type:String,required:true},
},
{ timestamps : true}
)
const userModel =mongoose.models.userlist || mongoose.model('userlist',schema);
export default userModel;