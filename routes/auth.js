const express = require('express');
const router = express.Router();

const { login, register, sendToken, verified,gapi_login,FB_api_login} = require('../controllers/auth');


router.route('/register').post(register)
router.route('/login').post(login)
router.route('/sendToken').get(sendToken);
router.route('/verified').post(verified);
router.route('/gapi_login').post(gapi_login);
// router.route('/FBapi_login').post(FBapi_login);
router.route('/FB_api_login').post(FB_api_login);



module.exports = router;
