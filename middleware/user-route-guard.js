const isUserLoggedIn = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/user-auth/user-login');
    }
    next();
}

const isUserLoggedOut = (req,res,next) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    next();
}

module.exports = {
    isUserLoggedIn,
    isUserLoggedOut,
  }