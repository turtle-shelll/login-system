#### Setup

```bash
npm install && npm start
```
###    first you have to make ssl server certificate to run this server in https mode(as ssl server)

## openssl genrsa -out key.pem  
           => to genret key file for ssl/tls/https

##   openssl req -new -key key.pem -out csr.pem   
           =>  this command for make request for cerificate.
                       after pressing enter key it ask for some quesion about ur country and your orginazion, your lacality, and so on 

              (csr.) stands for   certificate signing request.

              here you have to provide atlist 3 information about you  
              like first is your country name in 2 digit charector code
              and second is your organizion and your email address. and all other you can skip by pressing enter key.

              and it wiil create data or file to make request for ssl certificate.

##    openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.pem

          =>  this now going to create certificate for your ssl server but remamber that if this certificate was you create by _BASH shell
                 then it work only in your devlopment mode. 



=> after the installatio complated to run this project you have to make " .env " file and have to put 
   your own database link to comunicate with database and also you have to add your own envirment variable to make encryption and other activitys.
   
#  env variable like 

1. MONGO_URI = < your own env VALUE>
2. JWT_secret = < your own env VALUE>
3. jwt_duration = < your own env VALUE>

#### Database Connection

1. Import connect.js
2. Invoke in start()
3. Setup .env in the root
4. Add MONGO_URI with correct value

#### Routers

- auth.js
- jobs.js

#### User Model

Email Validation Regex

```regex
/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
```

#### Register User

- Validate - name, email, password - with Mongoose
- Hash Password (with bcryptjs)
- Save User
- Generate Token
- Send Response with Token

###   after registering user 

- generat token send email  with that token
- save that token inn JWT and send that JWT in coockie storage of your users browser. 
- redirect your user to verify page where u conforming your user is real or not.
- get that coockie from your user extract it and then compare token with geven by user from token submit form.
- if token is match then redirect user to login page or in make them to fill user details form to get more data.
- and if token dusnot match rediract to same page and ask them to make emial request again 
- and send message of emial was not verify yet.

#### Login User

- Validate - email, password - in controller
- If email or password is missing, throw BadRequestError
- Find User
- Compare Passwords
- If no user or password does not match, throw UnauthenticatedError
- If correct, generate Token
- Send Response with Token


###   in login page i also have made 

- login with google button and login with facebook button
- to make this you have to make google acount and also an facebook account for get there API connaction of login system.
- remmamber we have made ssl server we have that becouse login with facebook is run on ssl server. 

#### Mongoose Errors

- Validation Errors
- Duplicate (Email)
- Cast Error

#### Security

- helmet
- cors
- xss-clean
- express-rate-limit

Swagger UI

```yaml
/jobs/{id}:
  parameters:
    - in: path
      name: id
      schema:
        type: string
      required: true
      description: the job id
```
