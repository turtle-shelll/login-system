const mongoose = require('mongoose')





const jobsSchema = new  mongoose.Schema({
    company:{
        type:String,
        required:[true,'please privide company'],
        maxlength:50,
    },
    position:{
        type:String,
        required:[true,'please provide your position'],
        maxlength:100,
    },
    status:{
        type:String,
        enum:['intervaiwing','decline','pending'],
        default:'pending',
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'user',
    },
},{timestamps:true})


module.exports = mongoose.model('job', jobsSchema);