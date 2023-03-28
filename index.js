if(process.env.NODE_ENV !=='production'){
    require('dotenv').config()
}

const express = require("express");
const app = express();
const path = require('path');
const port = process.env.PORT;
const bodyparser = require('body-parser');
const Fingerprint2 = require('fingerprintjs2');

// Use bodyparser
app.use(bodyparser.json());

const methodOverride = require('method-override');

// routes
const userRoutes = require('./routes/users');
const passwordRoutes = require('./routes/password')
const adminRoutes = require('./routes/admin')

// proxy
app.set('trust proxy', true)

// user session
const session = require("express-session");

// notification
const flash = require('connect-flash');

// autothenfication
const passport = require('passport');
const localStrategy = require('passport-local');

// db models (seeding into database)
const User = require('./models/user');

// requiring mongoose and template engine
const ejsMate = require('ejs-mate');
const mongoose = require("mongoose");

// express errors
const expressError = require('./utils/ExpressError');

app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");
app.engine('ejs', ejsMate);

const sessionConfig = {
    secret: process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now() + 1000 *60*60*24*7,
        maxAge:1000*60*60*24*7
    }
};
app.use(session(sessionConfig));

main().catch(err => console.log(err));
async function main() {
    mongoose.set('strictQuery', true);
    await mongoose.connect(process.env.MONGO_URL, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    });
    console.log("working finally mongo connection open");
};

// calling on the styles in public
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'));

// getting things from forms
app.use(express.urlencoded({extended:true}))
app.use(flash())
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser((user , done) => {
  User.serializeUser()
  done(null , user);
})
passport.deserializeUser(function(user, done) {
  User.deserializeUser()
  done(null, user);
});

app.use((req,res,next)=>{
  res.locals.currentUser = req.user;
  res.locals.success=req.flash('success');
  res.locals.error=req.flash('error')
  next()
});
app.get('/auth', (req, res) => {
  const fingerPrintPromise = new Promise((resolve) => {
    Fingerprint2.get((components) => {
      const values = components.map((component) => component.value);
      resolve(Fingerprint2.x64hash128(values.join(''), 31));
    });
  })
  fingerPrintPromise.then((fingerprint) => {
    User.findOne({ username: fingerprint }, (err, result) => {
      if (result) {
        // User is authenticated based on fingerprint
        res.send('Authenticated');
        console.log(result)
      } else {
        // User needs to create a new account
        res.send('Please create a new account');
        console.log(fingerprint)
      }
    });
  });
})

app.get('/', (req,res)=>{
  res.render('home')
});

app.use('/', userRoutes);
app.use('/api/password', passwordRoutes);
app.use('/admin', adminRoutes);

// hit any route
app.all("*", (req,res,next)=>{
    next(new expressError('page not found', 404))
});

app.use((err,req,res,next)=>{
    const {statusCode = 500, message = 'something went wrong'} = err;
    if(!err.message) err.message='An error occured'
    res.status(statusCode).render('errors', {err})
})

app.listen(port, ()=>{
  console.log(`listening at port ${port}`)
});