const passport = require('passport')

exports.authenticateUser = passport.authenticate('local', {
    successRedirect: '/ok',
    failureRedirect: '/signIn',
    failureFlash: true
})