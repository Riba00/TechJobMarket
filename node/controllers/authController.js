const passport = require('passport')
const mongoose = require('mongoose')
const Vacancy = mongoose.model('Vacancy')
const User = mongoose.model('Users')
const crypto = require('crypto')
const sendEmail = require('../handlers/email')

exports.authenticateUser = passport.authenticate('local', {
    successRedirect: '/administration',
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
        vacancies,
        logOut: true,
        name: req.user.name,
        photo : req.user.photo
    })
}

exports.logOut = async (req, res) => {
    req.logout(function(err){
        if(err) {
            return next(err);
        }
        req.flash('correcto', 'LogOut successfully')
        return res.redirect('/signIn')
    });
}

exports.forgotPasswordForm = (req, res, next) => {
    res.render('forgot-password', {
        pageName: 'Reset your password',
        tagLine: 'If you already have an account but forgot your password, enter your email'
    })
}

exports.sendToken = async (req, res, next) => {
    const user = await User.findOne({email: req.body.email})

    if (!user) {
        req.flash('error', 'User not found')
        return res.redirect('/signIn')
    }

    user.token = crypto.randomBytes(20).toString('hex');
    user.expires = Date.now() + 10800000

    await user.save()

    const resetUrl = `http://${req.headers.host}/reset-password/${user.token}`

    await sendEmail.send({
        user,
        subject: 'Password Reset',
        resetUrl,
        file: 'reset'
    })

    req.flash('correcto', 'Check your email for the indications')
    res.redirect('/signIn')
}

exports.resetPassword = async (req, res, next) => {
    const user = await User.findOne({
        token: req.params.token,
        expires: {
            $gt: Date.now()
        }
    });

    if (!user) {
        req.flash('error', 'The form is no longer valid, try again');
        return res.redirect('/forgotPassword')
    }

    res.render('new-password', {
        pageName: 'New Password'
    })
}

exports.savePassword = async(req, res, next) => {
    const user = await User.findOne({
        token: req.params.token,
        expires: {
            $gt: Date.now()
        }
    });

    if (!user) {
        req.flash('error', 'The form is no longer valid, try again');
        return res.redirect('/forgotPassword')
    }
    console.log(user);
    console.log(req.body.password);

    user.password = req.body.password;
    user.token = undefined;
    user.expires = undefined;

    await user.save()

    req.flash('correcto', 'Password saved successfully')
    res.redirect('/signIn')
}