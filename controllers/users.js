const User = require('../models/user');
const Student = require('../models/student');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { errorHandler } = require('../helpers/dbErrorHandling');
const otpgenerate = require('otp-generator')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const nodemailer = require('nodemailer');
const axios = require('axios')
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

module.exports.renderIndex=(req,res)=>{
  res.render('main/home')
};

module.exports.renderRegister=(req,res)=>{
  res.render('users/register')
}

module.exports.renderLogin =  (req,res)=>{
  res.render('users/login')
};

module.exports.renderForget =  (req,res)=>{
  res.render('password/forget')
};

module.exports.register = async(req,res,next)=>{
  const { username, email, password } = req.body
  const errors = validationResult(req);

  // Validation to req body we will create custom validation in seconds
  if (!errors.isEmpty()) {
    const firstError = errors.array().map(error => error.msg)[0];
    req.flash('error', firstError)
    console.log('There is error', firstError)
    res.redirect('/register')
  } else {
    console.log('now active')
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
      res.redirect('/register');
    }else if (usere) {
      console.log('user checked');
      req.flash('error', 'email is taken already');
      res.redirect('/register');
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
          subject: 'Account activation link',
          html: ` <h1>Hello ${process.env.ADMIN_USER}, Please use the following to activate the new account</h1>
                  <button><a href="${process.env.CLIENT_URL}/activate/${token}" style="color:white; background-color:#0e4bf1; width:100%; padding:20px; text-decoration:none;">Activate Account</a></button><br>
                  <p>Incase the button does not work copy link below and paste in your browser</p><br>
                  <p>${process.env.CLIENT_URL}/activate/${token}</p>
                  <hr /><br>
                  <P>This link will expire in one hour</p><br>
                  <hr />
                  <p>This email may contain sensetive information</p>
                  <p>${process.env.CLIENT_URL}</p>
                `
      };
      console.log('Sending Now')
      transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            return req.flash('error', errorHandler(error)), console.log('No internet or so...')
          } else {
            return req.flash('success', `Email has been sent to ${process.env.ADMIN_EMAIL} for activation`), res.redirect('/login'), console.log('sent success')
          }
      });
    }
  };
};

module.exports.renderActivate =  (req,res)=>{
  const { token } = req.params;
  if (!token) {
    req.flash('error', 'Invalid Link')
    res.redirect('/register')
  } else {
    if (token) {
      // Veryfy token if it still functional or expired
      jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, async(err, decode) => {
        if (err) {
          req.flash('error', 'Expired Activation link. Signup again')
          res.redirect('/register')
          console.log(err)
          console.log('An error happened');
        } else {
          res.render('users/activate', {token})
        }
      })
    } else {
      req.flash('error', 'Unknown')
      res.redirect('/register')
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
  
  if (!token) {
    req.flash('error', 'Invalid Link')
    res.redirect('/register')
  } else {
    if (token) {
      const errors = validationResult(req);

      // Validation to req body we will create custom validation in seconds
      if (!errors.isEmpty()) {
          const firstError = errors.array().map(error => error.msg)[0];
          req.flash('error', firstError)
          console.log('There is error', firstError)
          res.redirect(`/activate/${token}`)
      } else {
        console.log('verifing...')
        // Veryfy token if it still functional or expired
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, async(err, decode) => {
          if (err) {
            req.flash('error', 'Expired Activation link. Signup again')
            res.redirect('/register')
            console.log(err)
            console.log('An error happened');
          } else {
            console.log('Time to decode')
            const { username, email, password } = jwt.decode(token);
            const user = new User({email, username});
            user.time = time
            user.date = date
            user.year = year
            user.source = 'local'
            user.images = req.files.map(f => ({url:f.path, filename:f.filename}))
            await fetch('https://api.ipify.org')
            .then((res) => res.text())
            .then(ip => {
              const ipadd = ip
              user.ip = ipadd
            })
            .catch(err => {
              req.flash('error', 'Something went wrong')
              res.redirect('/register')
            })
            const registeredUser = await User.register(user,password);
            req.login(registeredUser, err=>{
                if(err) return next(err);
                req.flash('success', `Sign up success, ${username} welcome to your Dashboard`)
                res.redirect('/index')
            })
          }
        });
      };
    } else {
      req.flash('error', 'Invalid Link');
      res.redirect('/register');
    };
  };
};

module.exports.admin = (req, res, next) => {
  const {username} = req.body;
  User.findOne({username}, (err, user) => {
    if (err || !user) {
      req.flash('error', 'Invalid User')
      res.redirect('/login')
    } else {
      const source = user.source
      if (source === 'admin') {
        req.flash('error', 'You can only login as admin')
        res.redirect('/login')
      } else {
        next();
      }
    }
  })
  
}

module.exports.renderAuth = (req, res) => {
  const { token } = req.params;
  if (!token) {
    req.flash('error', 'Invalid Link')
    res.redirect('/login')
  } else {
    if (token) {
      console.log('verifing...')
      // Veryfy token if it still functional or expired
      jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, async(err, decode) => {
        if (err) {
          req.flash('error', 'Expired Activation link. Signup again')
          res.redirect('/login')
          console.log('An error happened');
        } else {
          const { username, password, otp } = jwt.decode(token);
          console.log('Time to decode')
          res.render('auth/user', {otptoken : token, username, password})
        }
      })
    } else {
      req.flash('error', 'An error occured')
      res.redirect('/login')
    }
  }
}

module.exports.auth = (req, res, next) => {
  const { token } = req.params;
  const errors = validationResult(req);
  if (!token) {
    req.flash('error', 'Invalid Link')
    res.redirect('/register')
  } else {
    if (token) {
      if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0];
        req.flash('error', firstError)
        console.log('There is error', firstError)
        res.redirect(`/login/auth/${token}`)
      } else {
        console.log('verifing...')
        // Veryfy token if it still functional or expired
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, async(err, decode) => {
          if (err) {
            req.flash('error', 'Expired Activation link. Signup again')
            res.redirect('/login')
            console.log(err)
            console.log('An error happened');
          } else {
            console.log('Time to decode')
            const { username, password, otp } = jwt.decode(token);
            const { otpcode } = req.body;
            if (otp === otpcode) {
              next();
            } else if (otp !== otpcode) {
              req.flash('error', 'Invalid otp')
              res.redirect(`/login/auth/${token}`)
            } else {
              req.flash('error', 'Invalid otp')
              res.redirect(`/login/auth/${token}`)
            }
          }
        })
      }
    } else {
      req.flash('error', 'An error occured')
      res.redirect('/login')
    }
  }
}

module.exports.authsuccess = (req, res, next) => {
  const { username, password } = req.body;
  const email = req.user.email;
  const userAgent = req.headers['user-agent'];
  let browser;
  let imgs;
  if(userAgent.match(/edg/i)){
    browser = "edge";
    imgs = "Edge";
  }else if(userAgent.match(/firefox|fxios/i)){
    browser = "firefox";
    imgs = "Firefox";
  }else if(userAgent.match(/opr\//i)){
    browser = "opera";
    imgs = "Opera";
  }else if(userAgent.match(/chrome|chromium|crios/i)){
    browser = "chrome";
    imgs = "Chrome";
  }else if(userAgent.match(/safari/i)){
    browser = "safari";
    imgs = "Safari";
  }else{
    browser = "Unknown";
    imgs = "Unknown";
  }
  fetch('https://api.ipify.org')
  .then((res) => res.text())
  .then(ip => {
    fetch(`http://ip-api.com/json/${ip}`)
    .then(response =>response.json())
    .then(data => {
      const city = data.city
      const country = data.country
      const location = `${city}, ${country}`
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'New Login',
        html: ` <h1>Hello ${username}</h1><br>
                <p>We just noticed a new login into your account with a new ip address at ${process.env.CLIENT_URL}</p><br>
                <p>Incase you dont recognize this action, you can quikly reset your password at ${process.env.CLIENT_URL}/api/password/forget</p>
                <hr />
                <h2>User info</h2>
                <P>Ip address is ${ip}</p>
                <P>Browser is <img class="bwrs" src="cid:unique@${imgs}.png" alt="${imgs}" title="${browser}" style="height: 10px; width: 10px; margin: 0 1px;"> ${imgs}</p>
                <P>Location is ${location}</p><br>
                <hr />
                <p>Glad having you as our user and we promise to serve you more better, from your friends at ${process.env.CLIENT_URL}</p>
                <p>${process.env.CLIENT_URL}</p>
              `,
              attachments: [{
                filename: `${imgs}.png`,
                path: `./public/Images/logos/${imgs}.png`,
                cid: `unique@${imgs}.png`
              }]
      };
      transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            req.logout(function(err) {
              if (err) { return next(err); }
              req.flash('error', errorHandler(error))
              res.redirect('/login')
            });
          } else {
            req.flash('success', `welcome back ${username}`);
            const redirectUrl = req.session.returnTo || '/index';
            console.log(req.session.returnTo)
            delete req.session.returnTo;
            res.redirect(redirectUrl);
            console.log('sent success')
          }
      });
    })
    .catch(err => {
      req.flash('error', 'An error occured')
      res.redirect('/login');
      console.log(err.message)
    })
  })
  .catch(err => {
    req.flash('error', 'An error occured')
    res.redirect('/login');
    console.log(err.message)
  })
}

module.exports.login=async(req, res, next) => {
  const { username, password } = req.body;
  const ips = req.user.ip;
  const email = req.user.email;
  await axios.get('https://api.ipify.org')
  .then(async(response) => {
    const ip = response.data
    await axios.get(`http://ip-api.com/json/${ip}`)
    .then(response => {
      const data = response.data
      console.log(data)
      const city = data.city
      const country = data.country
      const location = `${city}, ${country}`
      if (ip === ips) {
        req.flash('success', `welcome back ${username}`);
        const redirectUrl = req.session.returnTo || '/index';
        console.log(req.session.returnTo)
        delete req.session.returnTo;
        res.redirect(redirectUrl);
      } else {
        const otp = otpgenerate.generate(8, {
          digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false
        })
        const userAgent = req.headers['user-agent'];
        let browser;
        let imgs;
        if(userAgent.match(/edg/i)){
          browser = "edge";
          imgs = "Edge";
        }else if(userAgent.match(/firefox|fxios/i)){
          browser = "firefox";
          imgs = "Firefox";
        }else if(userAgent.match(/opr\//i)){
          browser = "opera";
          imgs = "Opera";
        }else if(userAgent.match(/chrome|chromium|crios/i)){
          browser = "chrome";
          imgs = "Chrome";
        }else if(userAgent.match(/safari/i)){
          browser = "safari";
          imgs = "Safari";
        }else{
          browser = "Unknown";
          imgs = "Unknown";
        }
        const otptoken = jwt.sign(
          {
            username,
            password,
            otp
          },
          process.env.JWT_ACCOUNT_ACTIVATION,
          {
            expiresIn: '15m'
          }
        );
        console.log(otp)
        const mailOptions = {
          from: process.env.EMAIL_FROM,
          to: email,
          subject: 'Account authentication link',
          html: ` <h1>Hello ${username}, Please use the following to authenticate your account</h1><br>
                  <p>Some one is trying to login to your account at ${process.env.CLIENT_URL}</p><br>
                  <p>This is your page link incase you loss it, but will expire in 15 minutes <br>${process.env.CLIENT_URL}/login/auth/${otptoken}</p>
                  <hr />
                  <p>Your Otp is:</p><br>
                  <h1>${otp}</h1>
                  <hr /><br>
                  <h2>User info</h2>
                  <P>Ip address is ${ip}</p>
                  <P>Browser is <img class="bwrs" src="cid:unique@${imgs}.png" alt="${imgs}" title="${browser}" style="height: 15px; width: 14.5px; margin: 0 1px;"> ${imgs}</p>
                  <P>Location is ${location}</p><br>
                  <hr />
                  <p>This email may contain sensetive information and this Otp will expire in 15 minutes</p>
                  <p>${process.env.CLIENT_URL}</p>
                `,
                attachments: [{
                  filename: `${imgs}.png`,
                  path: `./public/Images/logos/${imgs}.png`,
                  cid: `unique@${imgs}.png`
                }]
        };
        console.log('Sending Now')
        console.log(username)
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              req.logout(function(err) {
                if (err) { return next(err); }
                req.flash('error', errorHandler(error))
                res.redirect('/login')
                console.log(err)
              });
            } else {
              req.logout(function(err) {
                if (err) { return next(err); }
                req.flash('success', `An OTP has been sent to ${email}`)
                res.redirect(`/login/auth/${otptoken}`)
              });
              console.log('sent success');
            }
        });
      };
    }).catch(err => {
      req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('error', 'An error occured')
        res.redirect('/login');
      });
    })
  }).catch(err => {
    console.log(err)
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: 'francisgodspower478@gmail.com',
      subject: 'Login Error',
      html: ` <h1>Hello ${username}, Error is ${err.message}</h1>
              <hr /><br>
              <p>${err}</p>
              <p>${process.env.CLIENT_URL}</p>
            `
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return req.logout(function(err) {
          if (err) { return next(err); }
          req.flash('error', 'An error occured, This may be due to bad network try again ones you are connected to a good internet network')
          res.redirect('/login');
        });
      } else {
        return req.logout(function(err) {
          if (err) { return next(err); }
          req.flash('error', 'An error occured, This may be due to bad network try again in few minutes')
          res.redirect('/login');
        });
      }
    });
    return
  })
};

module.exports.logout=function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    req.flash('success', 'Goodbye')
    res.redirect('/login');
  });
};

module.exports.forget = (req, res) => {
  const { email } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map(error => error.msg)[0];
    req.flash('error', firstError)
    res.redirect('/api/password/forget')
  } else {
    //  check if user exit
    User.findOne({email}, (err, user) => {
      if (err ||!user) {
        req.flash('error', 'User with that email does not exist')
        res.redirect('/api/password/forget')
      } else {
        // if exit
        // Generate token for user with this id valid for only 15 minute
        const userid = user._id
        const usersource = user.source
        if (usersource === 'admin') {
          req.flash('error', 'You are not allowed')
          res.redirect('/api/password/forget')
        } else {
          const token = jwt.sign({
            userid
          },
          process.env.JWT_RESET_PASSWORD, 
          {
            expiresIn: '60m'
          });
          console.log(`User id ${userid} and user token ${token}`)
          const mailOptions = {
              from: process.env.EMAIL_FROM,
              to: email,
              subject: 'Password Reset link',
              html: `
                        <style>
                          button {
                            font: 500 1rem 'Quicksand' sans-serif;
                            width: 100%;
                            padding: 1rem 2rem;
                            font-weight: bold;
                            font-size: 1.1rem;
                            color: white;
                            border: none;
                            border-radius: 6px;
                            outline: none;
                            cursor: pointer;
                            background: blue;
                          }
                        
                          button:hover {
                            background: black;
                          }
                        
                          button:active {
                            transform: scale(0.98);
                          }
                        </style>
                        <h1>Please use the following to reset your account password</h1>
                        <button><a href="${process.env.CLIENT_URL}/api/password/reset/${token}">Activate Account</a></button><br>
                        <p>Incase the button does not work copy link below and paste in your browser</p><br>
                        <p>${process.env.CLIENT_URL}/api/password/reset/${token}</p>
                        <hr />
                        <p>This email may contain sensetive information</p>
                        <p>If you did not request for this please go change your password immediately</p>
                        <p>${process.env.CLIENT_URL}</p>
                    `
          };
          return user.updateOne({
                token: token
              },(err, success) => {
                if (err) {
                  req.flash('error', errorHandler(err));
                  res.redirect('/api/password/forget');
                } else {
                  transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                      req.flash('error', errorHandler(error))
                      res.redirect('/api/password/forget')
                    } else {
                      req.flash('success', `Your reset link as been sent to ${email}`)
                      res.redirect('/login')
                    }
                  })
                }
              }
          );
        }
      }
    });
  }
};

module.exports.renderReset =  (req,res)=>{
  const { token } = req.params;
  if(!token) {
    req.flash('error', 'Invalid link')
    res.redirect('/login')
  } else if (token) {
    jwt.verify(token, process.env.JWT_RESET_PASSWORD, function(err, decoded) {
      if (err) {
        req.flash('error', 'Invalid or Expired link. You can request password reset again')
        res.redirect('/api/password/forget')
      } else {
        User.findOne({ token }, (err, user) => {
          console.log(user)
          if (err || !user) {
            req.flash('error', 'Something went wrong. Try later')
            res.redirect('/api/password/forget')
          } else if (user) {
            res.render('password/reset', {token: token})
          }
        })
      }
    })
  }
};

module.exports.Reset = async(req, res) => {
  const { token } = req.params;
  console.log(`Seen token now as ${token}`)
  const errors = validationResult(req);
  const { oldPassword, newPassword } = req.body;
  if(!token) {
    req.flash('error', 'Invalid link')
    res.redirect('/login')
  } else {
    if (!errors.isEmpty()) {
      const firstError = errors.array().map(error => error.msg)[0];
      req.flash('error', firstError)
      res.redirect(`/api/password/reset/${token}`)
    }else {
      console.log('verify')
      if (token) {
        jwt.verify(token, process.env.JWT_RESET_PASSWORD, function(err, decoded) {
          if (err) {
            req.flash('error', 'Expired link. You can request password reset again')
            res.redirect('/api/password/forget')
          } else {
            User.findOne({ token }, async(err, user) => {
              console.log(user)
              if (err || !user) {
                req.flash('error', 'Something went wrong. Try later')
                res.redirect('/api/password/forget')
              } else {
                const useruser = user.username
                User.findByUsername(useruser, async(err, user) => {
                  if (err) {
                    req.flash('error', 'Something went wrong. Try later')
                    res.redirect('/api/password/forget')
                  } else {
                      user.changePassword(oldPassword, 
                      newPassword, function (err) {
                          if (err) {
                            req.flash('error','Error, could\'nt reset password or your old password is incorrect')
                            res.redirect(`/api/password/reset/${token}`)
                          } else {
                            const resetEmail = {
                              to: user.email,
                              from: process.env.EMAIL_FROM,
                              subject: 'Your password has been changed',
                              html: `
                                <h2>This is a confirmation that the password for your account "<b>${user.email}</b>" at <b>${process.env.CLIENT_URL}</b> has just been changed. Incase you did not do this, contact us for help...</h2>
                                <hr>
                                <p>${process.env.CLIENT_URL}</p>
                              `,
                            };
                            // console.log(resetEmail)
                            // req.flash('success', `Success! Your password has been changed.`)
                            // res.redirect('/login')
                            transporter.sendMail(resetEmail, function (error, info) {
                              if (error) {
                                req.flash('error', errorHandler(error))
                                res.redirect(`/api/password/reset/${token}`)
                              } else {
                                req.flash('success', `Success! Your password has been changed.`)
                                res.redirect('/login')
                              }
                            });
                          }
                      });
                  }
              });
              }
            }); 
          } 
        });
      } else {
        req.flash('error', 'Unknown error')
        res.redirect('/login')
      }
    }
  }
};

module.exports.renderStudentReg =  (req,res)=>{
  res.render('component/create')
};

module.exports.renderRegSuccess =  (req,res)=>{
  res.render('component/success')
};

module.exports.renderPics = (req, res) => {
  const { token } = req.params;
  if (!token) {
    req.flash('error', 'Invalid Link')
    res.redirect('/index/register')
  } else {
    if (token) {
      // Veryfy token if it still functional or expired
      jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, async(err, decode) => {
        if (err) {
          req.flash('error', 'Expired Activation link. Signup again')
          res.redirect('/index/register')
        } else {
          const {fname} = jwt.decode(token)
          res.render('component/pics', {pictoken : token, fname})
        }
      })
    } else {
      req.flash('error', 'An error occured')
      res.redirect('/index')
    }
  }
}

module.exports.Reg =  async(req,res)=>{
  const { fname, lname, email, reg, subject } = req.body
  const errors = validationResult(req);

  // Validation to req body we will create custom validation in seconds
  if (!errors.isEmpty()) {
    const firstError = errors.array().map(error => error.msg)[0];
    req.flash('error', firstError)
    console.log('There is error', firstError)
    res.redirect('/index/register')
  } else {
    const usern = await Student.findOne({
      reg
    })
    const usere = await Student.findOne({
      email
    })
    // if user exits
    if (usern) {
      req.flash('error', 'Student with that Reg number is already taken');
      res.redirect('/index/register');
    }else if (usere) {
      console.log('user checked');
      req.flash('error', 'Student with that email is taken already');
      res.redirect('/index/register');
    } else {
      const token = jwt.sign(
        {
          fname,
          lname,
          email,
          reg,
          subject
        },
        process.env.JWT_ACCOUNT_ACTIVATION,
        {
          expiresIn: '60m'
        }
      );
      res.redirect(`/index/register/${token}`)
    };
  };
};

module.exports.RegComplete =  async(req,res)=>{
  const { token } = req.params;
  if (!token) {
    req.flash('error', 'Invalid Link')
    res.redirect('/index/register')
  } else {
    if (token) {
      // Veryfy token if it still functional or expired
      jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, async(err, decode) => {
        if (err) {
          req.flash('error', 'Expired Activation link. Signup again')
          res.redirect('/index/register')
          console.log(err)
        } else {
          const { fname, lname, email, reg, subject } = jwt.decode(token)
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
          const errors = validationResult(req);
          // Validation to req body we will create custom validation in seconds
          if (!errors.isEmpty()) {
              const firstError = errors.array().map(error => error.msg)[0];
              req.flash('error', firstError)
              console.log('There is error', firstError)
              res.redirect('/index/register')
          } else {
            const student = new Student({});
            const password = otpgenerate.generate(12, {
              digits: true, lowerCaseAlphabets: true, upperCaseAlphabets: true, specialChars: false
            })
            student.time = time
            student.date = date
            student.year = year
            student.subject = subject
            student.password = password
            student.email = email
            student.fname = fname
            student.lname = lname
            student.reg = reg
            student.images = req.files.map(f => ({url:f.path, filename:f.filename}))
            const mailOptions = {
              from: process.env.EMAIL_FROM,
              to: email,
              subject: `${fname} ${lname} account details`,
              html: ` <h1>Hello ${fname}, Use the following for your examination verification</h1><br>
                      <hr /><br>
                      <h2>Your info</h2>
                      <P>Your Email is ${email}</p>
                      <p>Your Password is: ${password}</p>
                      <p>Your Reg NO. is: ${reg}</p>
                      <hr />
                      <p>Keep the password safe cause you may need it</p>
                      <p>${process.env.CLIENT_URL}</p>
                    `
            };
            transporter.sendMail(mailOptions, async(error, info) => {
              if (error) {
                req.flash('error', errorHandler(error))
                res.redirect('/index/register')
              } else {
                await student.save()
                res.redirect('/index/success')
                return
              }
            });
          };
        }
      })
    } else {
      req.flash('error', 'An error occured')
      res.redirect('/index')
    }
  }
};