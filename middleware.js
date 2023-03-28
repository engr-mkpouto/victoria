module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
};

module.exports.isLoggedAuth = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'Invalid, your not allowed to access this...');
        return res.redirect('/login');
    }
    next();
};

module.exports.isAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
        const source = req.user.source
        if (source !== 'admin') {
            req.session.returnTo = req.originalUrl
            req.flash('error', 'Invalid, your not allowed to access this...');
            return res.redirect('/index');
        } else {
            next();
        }
        
    } else if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'Invalid, your not allowed to access this...');
        return res.redirect('/login');
    }
};

module.exports.isUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        const source = req.user.source
        if (source !== 'local') {
            req.session.returnTo = req.originalUrl
            req.flash('error', 'Invalid, your not allowed to access this...');
            return res.redirect('/admin/dashboard');
        } else {
            next();
        }
        
    } else if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'Invalid, your not allowed to access this...');
        return res.redirect('/login');
    }
};

module.exports.isAdminAndLogIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        req.flash('error', 'Signout first...')
        return res.redirect('/admin/dashboard')
    } else {
        next();
    }
}

module.exports.isLoggedAuthIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'Invalid, your not allowed to access this...');
        return res.redirect('/index');
    }
    next();
};

module.exports.isLoggedOut = (req, res, next) => {
    if (req.isAuthenticated()) {
        const source = req.user.source
        if (source === 'admin') {
            req.session.returnTo = req.originalUrl
            req.flash('error', 'Invalid, your not allowed to access this until you are logout as admin');
            return res.redirect('/admin/dashboard');
        }  else {
            req.session.returnTo = req.originalUrl
            req.flash('error', 'You must be signed out first!');
            return res.redirect('/index');
        }
    }
    next();
}

// module.exports.isAuthor = async(req,res,next)=>{
//     const { id } = req.params;
//     const campground = await Campground.findById(id);
//     console.log(req.user)
//     if(!campground.author.equals(req.user._id)){
//     // req.flash('error', 'you do not have permission to do that');
//     return res.redirect(`/indexmain`)
//     }
//     next()
// }