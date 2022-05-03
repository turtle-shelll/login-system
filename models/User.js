const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
   
    name:{
        type:String,
        required:[true, 'please provide your name'],
        minlength:[6, 'the name has to be more then 6 charecters'],
        maxlength:[20,'the name has to be less then 20 charecters'],
    },
    email:{
        type:String,
        required:[true,'please provide Email'],
        match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ,'please provide valide Email'],
        unique:true,
    },
    password:{
        type:String,
        required:[true,'please provide password'],
        minlength:[6, 'please provide a stronge password'],
       // maxlength:[12,'your password has to be less then 12 charecter and uniqque'],
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    picture:{
        type:String,
        default:"user picture not uvailable.",
    },
    user_from:{
        type:String,
        default:"my_domain",
},
});




userSchema.pre('save', async function (next){
    const salt =await bcrypt.genSalt(10);
    this.password =  await bcrypt.hash(this.password,salt);
    next();
});


userSchema.methods.createJWT = function() {
    try {        
        return jwt.sign({ userID: this._id , name: this.name }, process.env.JWT_secret ,
             {expiresIn: process.env.jwt_duration} );
    } catch (error) {
        console.log(error)
    }
};


userSchema.methods.checkPassword =async function (candidetPassword){
    const isMtch = await bcrypt.compare(candidetPassword,this.password)
    return isMtch

}

module.exports = mongoose.model('User', userSchema);