const User = require('../models/user');
const Student = require('../models/student');
const Attend = require('../models/attendance')
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { errorHandler } = require('../helpers/dbErrorHandling');
const axios = require('axios')
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const transporter = nodemailer.createTransport(smtpTransport({
  service: process.env.MAIL_SERVICE,
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
}));

module.exports.renderRegister = (req,res)=>{
  res.render('admin/register')
};

module.exports.renderLogin = (req,res)=>{
  res.render('admin/login')
};

module.exports.renderDashboard = async(req,res)=>{
  let h = new Date().getHours();
  let period = "Day"
  if(h >= 0 && h < 12) {
    period = "Morning"
  }else if(h >= 12 && h < 16) {
    period = "Afternoon"
  }else if (h >= 16 && h < 24) {
    period = "Evening"
  }
  const username = req.user.username
  const email = req.user.email
  const users = await User.find({});
  const students = await Student.find({});
  const attends = await Attend.find({});
  res.render('admin/dashboard', {users, students, attends, username, email, period})
};

module.exports.check = (req, res, next) => {
  const {source} = req.user;
  if (source === 'admin') {
    next();
  } else {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash('error', 'Invalid account details')
      res.redirect('/admin/login');
    });
  };
};

module.exports.register = async(req,res,next)=>{
  const { username, email, password } = req.body
  const errors = validationResult(req);
  // Validation to req body we will create custom validation in seconds
  if (!errors.isEmpty()) {
    const firstError = errors.array().map(error => error.msg)[0];
    req.flash('error', firstError)
    console.log('There is error', firstError)
    res.redirect('/admin/register')
  } else {
    const usern = await User.findOne({
      username
    })
    const usere = await User.findOne({
      email
    })
    // if user exits
    if (usern) {
      console.log('email error');
      req.flash('error', 'Username is taken already');
      res.redirect('/admin/register');
    }else if (usere) {
      console.log('user checked');
      req.flash('error', 'email is taken already');
      res.redirect('/admin/register');
    } else {
      console.log('Let sign it and send it to user')
      const token = jwt.sign(
        {
          username,
          email,
          password
        },
        process.env.JWT_ACCOUNT_ACTIVATION,
        {
          expiresIn: '60m'
        }
      );
      console.log(token)
        const mailOptions = {
          from: process.env.EMAIL_FROM,
          to: process.env.ADMIN_EMAIL,
          subject: 'Admin Account activation link',
          html: ` <h1>This user "${username}", Is trying to create a new administrator account</h1>
                  <button><a href="${process.env.CLIENT_URL}/api/secret/admin/api/activate/${token}" style="color:white; background-color:#0e4bf1; width:100%; padding:34px; text-decoration:none;">Activate Account</a></button><br>
                  <p>Incase the button does not work copy link below and paste in your browser</p><br>
                  <a href="${process.env.CLIENT_URL}/admin/activate/${token}"><p>${process.env.CLIENT_URL}/admin/activate/${token}</p></a>
                  <hr /><br>
                  <P>This link will expire in one hour</p><br>
                  <h3>If this registeration/activation link was not requested by you Administrator or you don't have any knowleged about this, you can safely ignore this email...</h3>
                  <hr />
                  <p>This email may contain sensetive information</p>
                  <p>${process.env.CLIENT_URL}</p>
                `
        };
        console.log('Sending Now')
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              return req.flash('error', errorHandler(error)), res.redirect('/admin/login'), console.log('No internet or so...')
            } else {
              return req.flash('success', `Email has been sent to Admin to authorize this account`), res.redirect('/admin/login'), console.log('sent success')
            }
        });
    }
  }
};

module.exports.activation =  async(req,res)=>{
  const { token } = req.params;
  const monthName = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const weekName = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  let day = new Date().getDate();
  let i = 31

  if (i > 10) {
     day = day == 1 ? day + 'st' : day;
     day = day == 2 ? day + 'nd' : day;
     day = day == 3 ? day + 'rd' : day;
     day = day == 4 ? day + 'th' : day;
     day = day == 5 ? day + 'th' : day;
     day = day == 6 ? day + 'th' : day;
     day = day == 7 ? day + 'th' : day;
     day = day == 8 ? day + 'th' : day;
     day = day == 9 ? day + 'th' : day;
     day = day == 10 ? day + 'th' : day;
     day = day == 11 ? day + 'th' : day;
     day = day == 12 ? day + 'th' : day;
     day = day == 13 ? day + 'th' : day;
     day = day == 14 ? day + 'th' : day;
     day = day == 15 ? day + 'th' : day;
     day = day == 16 ? day + 'th' : day;
     day = day == 17 ? day + 'th' : day;
     day = day == 18 ? day + 'th' : day;
     day = day == 19 ? day + 'th' : day;
     day = day == 20 ? day + 'th' : day;
     day = day == 21 ? day + 'st' : day;
     day = day == 22 ? day + 'nd' : day;
     day = day == 23 ? day + 'rd' : day;
     day = day == 24 ? day + 'th' : day;
     day = day == 25 ? day + 'th' : day;
     day = day == 26 ? day + 'th' : day;
     day = day == 27 ? day + 'th' : day;
     day = day == 28 ? day + 'th' : day;
     day = day == 29 ? day + 'th' : day;
     day = day == 31 ? day + 'st' : day;
  }
  const month = monthName[new Date().getMonth()];
  const years = new Date().getFullYear();
  const year = `${years}`
  const week = weekName[new Date().getDay()];
  const date = `${week}, ${day} ${month}`
  let h = new Date().getHours();
  let m = new Date().getMinutes();
  let s = new Date().getSeconds();
  let ampm = "AM";
  if(h >= 12) {
    h = h - 12;
    ampm = "PM";
  }
  h = h == 0 ? h = 12 : h;
  h = h < 10 ? "0" + h : h;
  m = m < 10 ? "0" + m : m;
  s = s < 10 ? "0" + s : s;
  const time = `${h+':'+m+' '+ampm}`
  await axios.get('https://api.ipify.org')
  .then(async(response) => {
    const ip = response.data
    console.log('verifing...')
    // Veryfy token if it still functional or expired
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, async(err, decode) => {
      if (err) {
        req.flash('error', 'Expired Activation link. Signup again')
        res.redirect('/register')
        console.log(err)
      } else {
        console.log('Time to decode')
        const { username, email, password } = jwt.decode(token);
        const user = new User({email, username});
        user.time = time
        user.date = date
        user.year = year
        user.ip = ip
        user.source = 'admin'
        const registeredUser = await User.register(user,password);
        const mailOptions = {
          from: process.env.EMAIL_FROM,
          to: process.env.ADMIN_EMAIL,
          subject: 'New Admin Account',
          html: ` <h1>This user "${username}", Just successfully singup as admin</h1>
                  <p>If you don't recognise this action you can as well delete the account</p><br>
                  <hr /><br>
                  <p>${process.env.CLIENT_URL}</p>
                `
        };
        console.log('Sending Now')
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              return req.flash('error', errorHandler(error)), res.redirect('/admin/login'), console.log('No internet or so...')
            } else {
              req.login(registeredUser, err=>{
                if(err) return next(err);
                req.flash('success', `Sign up success, ${username} welcome to your Dashboard`)
                res.redirect('/admin/dashboard')
              });
            }
        });
      }
    });
  }).catch(err => {
    req.flash('error', 'Something went wrong')
    res.redirect('/register')
  });
  if (!token) {
    req.flash('error', 'Invalid Link/Token')
    res.redirect('/register')
  } else {
    if (token) {
      
    } else {
      req.flash('error', 'Invalid Link');
      res.redirect('/register');
    }
  }
};

module.exports.renderUser = async(req,res) => {
  const { id } = req.params
  console.log(id)
  let h = new Date().getHours();
  let period = "Day"
  if(h >= 0 && h < 12) {
    period = "Morning"
  }else if(h >= 12 && h < 16) {
    period = "Afternoon"
  }else if (h >= 16 && h < 24) {
    period = "Evening"
  }
  const username = req.user.username
  const email = req.user.email
  const users = await User.findById(id);
  if(!users){
    req.flash('error', 'cannot find that user')
    return res.redirect('/admin/dashboard')
  }
  res.render('admin/users/view', {users, period, username, email})
}

module.exports.renderStudent = async(req,res) => {
  const { id } = req.params
  console.log(id)
  let h = new Date().getHours();
  let period = "Day"
  if(h >= 0 && h < 12) {
    period = "Morning"
  }else if(h >= 12 && h < 16) {
    period = "Afternoon"
  }else if (h >= 16 && h < 24) {
    period = "Evening"
  }
  const username = req.user.username
  const email = req.user.email
  const student = await Student.findById(id);
  if(!student){
    req.flash('error', 'cannot find that user')
    return res.redirect('/admin/dashboard')
  }
  res.render('admin/users/student', {student, period, username, email})
}

module.exports.login=(req, res) => {
  const source = req.user.source
  if (source === 'admin') {
    const { username } = req.body;
    req.flash('success', `welcome back ${username}`);
    const redirectUrl = req.session.returnTo || '/admin/dashboard';
    console.log(req.session.returnTo)
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  } else {
    req.flash('error', 'You are not allowed');
    res.redirect('/login');
  }
};

module.exports.logout=function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash('success', 'Goodbye')
      res.redirect('/admin/login');
    });
};

module.exports.search = async(req, res) => {
  const {q} = req.query
  let color;
  let alert;
  let header;
  let note;
  let regs;
  let email;
  let d;
  let i;
  Student.findOne({reg: q}, (err, user) => {
    if (err || !user) {
      color = `style="color: red;"`
      header = 'No Such User'
      note = `The User Reg number ${q} does not exist`
      regs = ''
      email = ''
      d = 'd-none'
      alert = 'alert-danger'
      i = 'data:image/jpeg;base64,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'
      res.render('admin/search', {color, header, note, regs, email, d, i, alert})
    } else {
      color = 'style="color: green;"'
      header = user.fname
      note = `Subject offerred by ${user.fname} are ${user.subject}`
      regs = user.reg
      email = user.email
      d = 'd-block'
      i = user.images[0].url
      alert = 'alert-success'
      res.render('admin/search', {color, header, note, regs, email, d, i, alert})
    }
  });
};

module.exports.sq = (req, res) => {
  const {search} = req.body;
  res.redirect(`/admin/search?q=${search}`)
};

module.exports.pass = async(req, res) => {
  const {password, email, subject} = req.body;
  Student.findOne({email}, async(err, user) => {
    if (err || !user) {
      req.flash('error', 'An error occured')
      res.redirect('/admin/dashboard')
    } else {
      const pass = user.password
      if (password === pass) {
        const attends = new Attend({})
        attends.email = email
        attends.name = `${user.fname} ${user.lname}`
        attends.subject = subject
        await attends.save();
        res.redirect(`/admin/dashboard/student/${user._id}`)
      } else {
        req.flash('error', 'Wrong password')
        res.redirect('/admin/dashboard')
      }
    }
  })
};