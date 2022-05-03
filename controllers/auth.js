const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');
const {BadRequestError, UnauthenticatedError} = require('../errors/index');
const ejs = require('ejs');
const mailer = require('nodemailer');
const { getMaxListeners } = require('../models/User');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const axios = require("axios");
const sgMail = require("@sendgrid/mail");

const register = async (req , res) =>{
 


  const {email,name,password} = req.body;
  const newUser = {};

  newUser.name = name
  newUser.email = email
  newUser.password = password
  newUser.isVerified =  false;
  newUser.picture = undefined;
  newUser.user_from = `${req.hostname}`;

  const user = await User.create({...newUser});
  const otp = await Math.round(Math.random()*1000000);
  
 const token = await makeToken(user.email,user._id, otp);
 
  sendMailToken(user.email,otp)
  
  res.cookie('verify_token',token, {maxAge:1000*60*5, httpOnly:true});
  res.cookie('verify_token_2',token,{maxAge:1000*60*20, httpOnly:true})
  res.render('token')
};
 
       
 function makeToken(email,userid, otp) {
  return  token = jwt.sign({email,userid, otp},process.env.JWT_secret, {expiresIn: process.env.jwt_duration});
 }


 
  async function sendMailToken(email,token) {
      const userEmail = email;
    const Emessage =  `your token for verify emial is ${token}`;
        // const transporter =  mailer.createTransport({
        //   host:"smtp.gmail.com",
        //   auth:{
        //     user: process.env.EMAIL_ID,
        //     pass: process.env.EMAIL_PASS,
        //   }
        // });
        // const mailOptions = {
        //   from: 'hardik0.0mistry890@gmail.com',
        //   to: userEmail,
        //   subject: 'your login token',
        //   text: Emessage,
        //   // html:`<div><a href="https://localhost:7443/api/v1/auth/verify/${token}">click to verify email</div>` 
        //   // html:`<div${token}</div>` 
        // }
              //  await transporter.sendMail(mailOptions, (error,info)=>{
              //      if(error){
              //        console.log('error from transporter=',error)
              //      }else{
              //        console.log('info from send mail=',info.response)
              //      }
              //  })
              sgMail.setApiKey(process.env.SENDGRID_APIKEY);

              const sendmsg = {
                to:userEmail,
                from: 'hardik0.0mistry890@gmail.com',
                subject: 'your login token',
                html:`<div><p>your token for verify emial is <b>${token}</b></p></div>` 
              }

              await sgMail.send(sendmsg)
                   .then(info=>{console.log("info from sendgrid===",info);
          //  return   res.status(StatusCodes.OK).json({success: true, message: "message sended successfully."});
    }).catch(error=>{console.log("error from token send===",error)});
  } 


  const sendToken = async (req, res )=> {
    try{
      const cookie = req.cookies.verify_token_2
 
      const payload = jwt.verify(cookie,process.env.JWT_secret);
      
      const otp = Math.floor(Math.random()*1000000);
      
      const token = makeToken(payload.email,payload.userid, otp);
      sendMailToken(payload.email,otp)
  
      res.cookie('verify_token',token, {maxAge:1000*60*5, httpOnly:true});
    }catch(error){
      console.error("error from send token==", error);
    }
       res.render('token');
    }

    const verified = async (req,res)=>{
     const cookie =  req.cookies.verify_token;
     try {
     if (!cookie) {
          throw new BadRequestError("your token has expire. try resend token.")
     }
     const payload = await jwt.verify(cookie, process.env.JWT_secret);
       const {token} = {...req.body};
       const otp = payload.otp;
       
       if (!token) {
         throw new BadRequestError("please provied token");
       };
       if(token != payload.otp){
         throw new BadRequestError("please provied valid token.");
   };
       if(token == payload.otp){
     const user = await User.findOneAndUpdate({_id:payload.userid},{isVerified:true},{new:true,runValidators:true});

        return  res.redirect('/login');
       };
      } catch (error) {
       console.log("error from verify token =======", error);
      }

      
    res.render("token");
  }
 
const login = async (req , res) =>{
  const {email , password } ={...req.body} ;
    if(!email || !password){
      throw new BadRequestError('please provide email and password')    
    };
    
    const user = await User.findOne({email});
      //  console.log("user from login===", user);
    if(!user){
      throw new UnauthenticatedError('Invalid credantials')
    };
    if(!user.isVerified){
      throw new BadRequestError("the email you are try to login is not verified. please verified your email before trying again.")
    };

    if (user && user.user_from !== `${req.hostname}`) {
       throw new UnauthenticatedError(`the email is you are tying is created by ${user.user_from} login route.`)
      // return res.status(StatusCodes.UNAUTHORIZED).json({message:`the email is you are tying is created by ${user.user_from} login route.`,success:"false"})
      }
    // comper password
  const isMatchPwd = await user.checkPassword(password)
    if(!isMatchPwd){
      throw new UnauthenticatedError('wrong password please try again') 
    }
     const token = user.createJWT();
  
   res.cookie('my_access_token',token, {maxAge:43200000, httpOnly:true});
    res.redirect('/profile');
    };

    const gapi_login = async (req,res)=>{
    
          const token = req.body.gapi_id_token;
          if (!token) {
            return res.status(StatusCodes.BAD_REQUEST).json({success:"false",message:"something went wrong did not get your email please try again."})
          }
  
          const CLIENT_ID = '47642937813-mjquomc174n0f4g7h63kum6j0na237ai.apps.googleusercontent.com'
         let newUser = {};
          try {
            const client = new OAuth2Client(CLIENT_ID);
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: CLIENT_ID,  
            });

            const payload = ticket.getPayload();
            const userid = payload['sub'];

            newUser.name = payload.name
            newUser.email = payload.email
            newUser.password = userid
            newUser.isVerified = false;
            newUser.picture = payload.picture;
            newUser.user_from = "google";

          const user = await User.create({...newUser});
        
                  const otp = await Math.floor(Math.random()*1000000);
                
                 const token_1 = await makeToken(user.email,user._id, otp);
          
                  sendMailToken(user.email,otp)
                  res.cookie('verify_token',token_1, {maxAge:1000*60*5, httpOnly:true});
                  res.cookie('verify_token_2',token_1,{maxAge:1000*60*20, httpOnly:true})
                   return     res.json({url:"/token",success:"true"})
                  
          } catch (error) {
          
            if(error.code && error.code === 11000 ){
              // customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} feild, please choose another value`
              // customError.msg = `An account with that email address already exists. Please use a unique email.`
              // customError.statusCode = 400

              const user = await User.findOne({email:newUser.email});

              if(!user){
                // throw new UnauthenticatedError('Invalid credantials')
                return res.status(StatusCodes.UNAUTHORIZED).json({success:"false",message:"Invalid credantials"})
              };
              if(!user.isVerified){
                // throw new BadRequestError("the email you are try to login is not verified. please verified your email before trying agian.");
                return res.status(StatusCodes.BAD_REQUEST).json({success:"false",message:"the email you are try to login is not verified. please verify your email before trying again."});
              }
              if (user && user.user_from !== "google") {
                //  throw new UnauthenticatedError("the email is you are tying is created by other login route.")
                return res.status(StatusCodes.UNAUTHORIZED).json({message:`the email is you are tying is created by ${user.user_from} login route.`,success:"false"})
                }
              // comper password
            const isMatchPwd = await user.checkPassword(newUser.password)
              if(!isMatchPwd){
                // throw new UnauthenticatedError('wrong password please try again') 
                return res.status(StatusCodes.UNAUTHORIZED).json({success:"false",message:"wrong password please try again."})
              }
        
              res.cookie("gapi_id_token", token,{ maxAge: 43200000, httpOnly: true });
           return   res.json({url:"/profile",success:"true"});
            }
            console.log("error ==== ", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success:"service currently on update pleasse try after some time."})
          }
    };
     

    const FB_api_login = async (req,res)=>{
      const {accessToken,userID}  = req.body.authResponse;
      if (!accessToken) {
        return res.status(StatusCodes.BAD_REQUEST).json({success:"false",message:"something went wrong with facebook try to login again."})
      }
      const  newUser = {};
      try {

      const {data} = await axios.get(`https://graph.facebook.com/v12.0/me?access_token=${accessToken}&fields=name,email,first_name,last_name,middle_name,name_format,picture,short_name&method=get&pretty=0&sdk=joey&suppress_http_code=1`);

      if (!data) {
        return res.status(StatusCodes.BAD_REQUEST).json({success:"false",message:"something went wrong with facebook try to login again."})
      }
  
      if (!data.email) {
        console.log("data.email == false")
        return res.status(StatusCodes.BAD_REQUEST).json({success:"false",message:"the facebook aaccount you are trying to login it desnot have email please try to login with other account or create NEW account with us."})
      }
      

      newUser.name = data.name;
      newUser.email = data.email;
      newUser.password = data.id;
      newUser.isVerified = false;
      newUser.picture = data.picture.data.url;
      newUser.user_from = "facebook"

      const user = await User.create({...newUser});

        const otp = await Math.floor(Math.random()*1000000);
        
       const token_1 = await makeToken(user.email,user._id, otp);
  
        sendMailToken(user.email,otp)
        res.cookie('verify_token',token_1, {maxAge:1000*60*5, httpOnly:true});
        res.cookie('verify_token_2',token_1,{maxAge:1000*60*20, httpOnly:true})
       res.json({url:"/token",success:"true"})

      } catch (error) {


        if (error.name === 'ValidationError') {

          // throw new BadRequestError("the facebook account your are trying is not have email. to continue login create New account with us OR try to login with some other account.");
          return res.status(StatusCodes.BAD_REQUEST).json({message:"the facebook account your are trying is not have email. to continue login create New account with us OR try to login with some other account.",success:"false"})
          
        }

        if (error.code && error.code === 11000 ) {
          
          const user = await User.findOne({ email:newUser.email});
                 
          if(!user){
            return res.status(StatusCodes.UNAUTHORIZED).json({message:"invalid credantiale user not found.",success:"false"})
          };

          if (user && user.user_from !== "facebook") {
          //  throw new UnauthenticatedError("the email is you are tying is created by other login route.")
          return res.status(StatusCodes.UNAUTHORIZED).json({message:`the email is you are tying is created by ${user.user_from} login route.`,success:"false"})
          }
          if(!user.isVerified){
            // throw new BadRequestError("the email you are try to login is not verified. please verified your email before trying agian.")
      return res.status(StatusCodes.UNAUTHORIZED).json({message:"the email you are try to login is not verified. please verified your email before trying again.",success:"false"})

          }   

        const isMatchPwd = await user.checkPassword(newUser.password)
     if(!isMatchPwd){
      return res.status(StatusCodes.UNAUTHORIZED).json({message:"wrong password please try again",success:"false"})
    }
     const token = user.createJWT();
        res.cookie('my_access_token',token, {maxAge:43200000, httpOnly:true});//9000000means2.5 hr43200000means12hr 
       return res.status(StatusCodes.OK).json({success:"true",url:"/profile"});
      }
    

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success:"service currently on update pleasse try after some time."})
    }
    }


    module.exports={
        register,login,sendToken,verified,gapi_login,FB_api_login
}