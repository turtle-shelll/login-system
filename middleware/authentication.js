const User = require('../models/User');
const jwt = require('jsonwebtoken')
const {UnauthenticatedError } = require('../errors/index');
const {OAuth2Client} = require('google-auth-library');


const auth = async (req,res, next) => {
  
   const token = req.cookies.my_access_token ; 
   const gapi_token =  req.cookies.gapi_id_token ;
 
   if(gapi_token){
  
    try {
      
      const CLIENT_ID = '47642937813-mjquomc174n0f4g7h63kum6j0na237ai.apps.googleusercontent.com'
    const client = new OAuth2Client(CLIENT_ID);
    
      const ticket = await client.verifyIdToken({
          idToken: gapi_token,
          audience: CLIENT_ID,  
      });
      const payload = ticket.getPayload();
      const userid = payload['sub'];
    
    req.guser = {email:payload.email, name:payload.name}
            // console.log("from authentication meddilwere ....");
           return  next();
   } catch (error) {
      // console.error("error =======", error);
     
      throw new UnauthenticatedError('token is not presant');
    }
   }

try {
    const payLoad = jwt.verify(token,process.env.JWT_secret)  
     req.user = {userId:payLoad.userID, name:payLoad.name}
     next()

} catch (error) {  
   throw new UnauthenticatedError('token is not presant');
}

};

module.exports = auth;