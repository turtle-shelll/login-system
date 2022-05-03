// const { text } = require("express");
const { StatusCodes } = require("http-status-codes");
const mailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");



const  sendMail = async (req,res)=>{
    
    try{
        sgMail.setApiKey(process.env.SENDGRID_APIKEY);
       
        const {name, email, phoneNo, message} = req.body;
        if (!name || !email || !phoneNo || !message) {
       return res.status(StatusCodes.BAD_REQUEST).json({success: false,message: "please fill all fields to make request." });
        }
     
        //  const sendmail = mailer.createTransport({
        //     host: "smtp.gmail.com",
        //     auth:{
        //         // user:"hardik0.0mistry890@gmail.com",
        //         user: process.env.EMAIL_ID ,
        //         pass: process.env.EMAIL_PASS
        //     }

        // });
        const HTML = `
        <h1>name : ${name}</h1>
        <br>
        <br>
        <h2>Phone No. : ${phoneNo}</h2>
        <br>
        <br>
        <h2>from : ${email}</h2>
        <br>
        <br>
        <h3>message : ${message}</h3>
        `


        const sendmsg = {
            to: "hardik.msg890@gmail.com",
            from:"hardik0.0mistry890@gmail.com",
            subject:"email Message",
            html:HTML
        }

       
            // const mailOptions ={
            //     from: "hardik0.0mistry890@gmail.com",
            //     to:"hardik.msg890@gmail.com",
            //     text:message,
            //     html: HTML
            // }
       
    //    await   sendmail.sendMail(mailOptions,(err,info)=>{
    //         if (err) {
    //             // console.log("error from send mail", err);
    //        return   res.status(StatusCodes.OK).json({success: true, message: err});
    //         }else{
    //             // console.log("info id done=", info);
    //        return   res.status(StatusCodes.OK).json({success: true, message: "message sended successfully."});
    //         }
    //     });
        
   await sgMail.send(sendmsg)
   .then(info=>{console.log("info from sendgrid===",info);
           return   res.status(StatusCodes.OK).json({success: true, message: "message sended successfully."});
    })

    }catch(error){
        console.log("error from sendgrid===", error);
        return res.status(StatusCodes.BAD_REQUEST)
        .json({success: false,message: "somthing went wrong. try again." });
    }
  res.end();
}

module.exports = sendMail;