const passport = require('passport')
const mongoose = require('mongoose')
const Vacancy = mongoose.model('Vacancy')

exports.authenticateUser = passport.authenticate('local', {
    successRedirect: '/ok',
    failureRedirect: '/signIn',
    failureFlash: true
})

exports.verifyUser = (req, res, next) => {

    if(req.isAuthenticated()){
        return next();
    }

    res.redirect('/signIn')
}

exports.showPanel = async (req, res) => {

    const vacancies = await Vacancy.find({author: req.user._id}).lean()


    res.render('administration', {
        pageName: 'Administration Panel',
        tagLine: 'Create and manage your vacancies here',
        vacancies
    })
}