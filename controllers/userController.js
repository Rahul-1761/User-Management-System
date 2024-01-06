const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");

const securePassword = async(password)=>{
    try {
        
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;


    } catch (error) {
        console.log(error.message);
    }
}

//for send mail
const sendVerifyMail = async(name, email, user_id)=>{
    try {
        
        const transporter = nodemailer.createTransport({

        });

        const mailOptions = {
            
        }

    } catch (error) {
        console.log(error.message);
    }
}

const loadRegister = async(req,res)=>{
    try{

        res.render('registration');

    }catch(error){
        console.log(error.message);
    }
}

const insertUser = async(req, res)=>{

    try {
        const spassword = await securePassword(req.body.password);

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mno,
            image: req.file.filename,
            password: spassword,
            is_admin: 0
        })

        const userData = await user.save();

        if(userData){
            sendVerifyMail(req.body.name, req.body.email, userData._id);
            res.render('registration', {message:"Your Registration has been Successfully. Please Verify Your Mail"});
        }
        else{
            res.render('registration', {message:"Your Registration has been Failed."});
        }
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadRegister,
    insertUser
}