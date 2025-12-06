import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    userid:{type:String,required:true},
    eventname:{type:String,required:true},
    description:{type:String,required:true},
    starttime:{type:String,required:true},
    endtime:{type:String,required:true},
    date:{type:String,required:true},
    image:{type:String,unique:true,required:true},
    fcmtoken:{type:String},
    status:{type:String,required:true},
},
{ timestamps : true}
)
const eventModel =mongoose.models.eventdata || mongoose.model('eventdata',schema);
export default eventModel;