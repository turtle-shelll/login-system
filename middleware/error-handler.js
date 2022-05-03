const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {

  const customError = {
    statusCode : err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR ,
    msg : err.message || 'somthing went wrong try again letar',
  }
  const {
    name,email,password
  }= {...req.body}

  const reqlog = req.url
  // console.log(reqlog,"hii error");
  if(err.name === 'ValidationError'){
    customError.msg = Object.values(err.errors).map(item=>item.message).join(',');
    customError.statusCode = 400 ;
  }
  if(err.code && err.code === 11000 ){
  
    customError.msg = `An account with that email address already exists. Please use another email.`
    customError.statusCode = 400
  }
  if(err.name === 'CastError'){
    customError.msg = `No jobs found with id : ${err.value}`;
    customError.statusCode = 404 ;
  }
  if (reqlog == '/api/v1/auth/register') {
    return res.status(customError.statusCode).render('register',{massage:customError.msg, name, email,password});
  }
 
 if (reqlog === '/api/v1/auth/login') {
   return res.status(customError.statusCode).render('login',{massage:customError.msg, email,password });
 }
 if (reqlog === '/api/v1/auth/verified') {
  return res.status(customError.statusCode).render('token',{massage:customError.msg });
}
 if (reqlog === '/api/v1/auth/FBapi_login') {
  return res.status(customError.statusCode).render('login',{massage:customError.msg });
}
  res.redirect('/login');
  // res.end();

   //  res.redirect('/register');
 // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
}

module.exports = errorHandlerMiddleware
