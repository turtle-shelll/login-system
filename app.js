require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const https = require('https');
const mailer = require('nodemailer');
const cookieParser = require('cookie-parser');
// const {OAuth2Client} = require('google-auth-library');

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:false}));
app.use(cookieParser())



// some extraa security packages/////
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');


// connect DB
const authenticetUser = require('./middleware/authentication')
const connectDB = require('./db/connect');

const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');
const sendMail = require("./controllers/sendmail");
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const { OK, StatusCodes } = require('http-status-codes');




app.set('trust proxy', 1);
app.use(rateLimiter({
  windowMs: 10 * 60 * 1000, // 15 minutes
  max: 10000 // limit each IP to 100 requests per windowMs
}))

app.use(express.json());
// extra packages
// app.use(helmet());
app.use(cors());
app.use(xss());
// routes
app.use('/public/css',express.static('./public/css'));
app.use('/api/v1/public/css',express.static('./public/css'));
app.use('/public/js',express.static('./public/js'));
app.use('/carebye',authenticetUser,express.static('./public/template/restoran-template'));
app.use('/famms',authenticetUser, express.static('./public/template/famms-1.0.0'));
app.use('/cafe',authenticetUser, express.static('./public/template/klassy_cafe'));

//app.use(express.static(path.join(__dirname+'public')));
app.use('/', express.static(__dirname + '/public'));
// app.use('/', express.static(__dirname + '/public/js'));
app.get('/', async (req, res) => {
  res.redirect('/login')
});
app.get('/register', async (req,res)=>{
    res.render('register')
});
app.post('/register', async (req,res)=>{
  
 res.redirect('/login');
});
app.post("/sendmail", sendMail); 

app.get('/login', async (req,res)=>{
 

    res.render('login');
});
app.get('/token', async (req,res)=>{
 
  res.render('token');
})
app.get("/email_verify", async (req,res)=>{
  res.render("email_verify");
})


app.get('/check_status',authenticetUser, async (req,res)=>{
  res.status(StatusCodes.OK).json({success: true })
})
app.get("/logout", async  (req,res)=>{
  res.clearCookie('my_access_token');
  res.clearCookie('gapi_id_token');
  
  res.redirect('/login');
})
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/jobs',authenticetUser , jobsRouter);

app.get('/profile',authenticetUser, async (req,res)=>{
  res.render('second-portfolio');  
})

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 8443;

const start = async () => {  
  try {
    await connectDB(process.env.MONGO_URI)

    // const sslServer = https.createServer({
    //   key: fs.readFileSync(path.join(__dirname,'cert','key.pem')),
    //   cert: fs.readFileSync(path.join(__dirname,'cert','cert.pem')),
    // },app);

    // sslServer.listen(port,()=>{
    //   console.log(`Server is listening on port https://localhost:${port}...`)
    // })
    app.listen(port, () =>
    console.log(`Server is listening on port http://localhost:${port}...`)
      // http://localhost:7000
    );
  } catch (error) {
    console.log(error);
  }
};

start();
