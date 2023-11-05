const isCreatorLoggedIn = (req,res,next) => {
    if (!req.session.creator) {
        return res.redirect('/creator-auth/creator-login');
    }
    next();
}

const isCreatorLoggedOut = (req,res,next) => {
    if (req.session.creator) {
        return res.redirect('/');
    }
    next();
}

module.exports = {
    isCreatorLoggedIn,
    isCreatorLoggedOut,
  }