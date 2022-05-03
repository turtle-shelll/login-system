const Job = require('../models/Job');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError, NotFoundError} = require('../errors');
const User = require('../models/User');



const getAllJobs = async (req , res) =>{
  
  const data_2 = req.guser
 
  try{
    const data_1 = req.user;
   
    let jobs = {};
    if (data_2) {
      const user = await User.findOne({email:data_2.email});
       jobs = await Job.find({createdBy:user._id}).sort('createdAt');
    }

    if (data_1) {
      const user = await User.findOne({email:data_1.userID});
    jobs = await Job.find({createdBy:user._id}).sort('createdAt');
  }
  return  res.json({jobs, count:jobs.length, success:"true",message:"congrates you done"});

  } catch (error) {
    console.log("error error == ", error);
  }
  res.end();

};

const getSingleJob = async (req , res) =>{
  const { user:{ userId }, params:{ id:jobId }} = req;
  const job = await Job.findOne({createdBy:userId, _id:jobId});
  if(!job){
    throw new NotFoundError(`there is no job with this id ${jobId}`)
  }
  res.status(StatusCodes.OK).json({job});

};

const createJob = async (req , res) =>{
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({job}) 
};

const updateJob = async (req , res) =>{
  const { body:{company , position }, user:{ userId }, params:{ id:jobId }} = req;
  if(company === '' || position === '' || !company || !position ){
    throw new BadRequestError('company and position feilds can not be empty');
  }
  const job =await  Job.findOneAndUpdate({createdBy:userId,_id:jobId},req.body,{new:true,runValidators:true});
   
  if(!job){
    throw new NotFoundError(`there is no job with this id ${jobId}`);
  }

  res.status(StatusCodes.OK).json({job});

};
const deleteJob = async (req , res) =>{
  const { user:{ userId }, params:{ id:jobId }} = req;
  const job = await Job.findOneAndDelete({createdBy:userId, _id:jobId});
  if(!job){
    throw new NotFoundError(`there is no job with this id ${jobId}`)
  }
  res.status(StatusCodes.OK).json({job});
  
    };  
    module.exports={
        getAllJobs,
        getSingleJob,
        createJob,
        updateJob,
        deleteJob,
    }