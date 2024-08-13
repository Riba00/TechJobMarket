const mongoose = require('mongoose')
const Users = mongoose.model('Users')

exports.signUpForm = (req, res, next) => {
    res.render('sign-up', {
        pageName: 'Create yor account in TechJobMarket',
        tagLine: 'Start publishing your vacancies for free, you just have to create an account',

    })
}

exports.signUp = async (req, res, next) => {
    const user = new Users(req.body);

    try {
        await user.save();
        res.redirect('/signIn')
    } catch (error) {
        req.flash('error', error);
        res.redirect('/signUp')
    }
}

exports.validateRegister = (req, res, next) => {

    // Sanitize
    req.sanitizeBody('name').escape();
    req.sanitizeBody('email').escape();
    req.sanitizeBody('password').escape();
    req.sanitizeBody('password-confirm').escape();

    // Validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password-confirm', 'Confirm Password is required').notEmpty();
    req.checkBody('password-confirm', 'Passwords do not match').equals(req.body.password);

    const errors = req.validationErrors();

    if (errors) {
        req.flash('error', errors.map(error=> error.msg));

        res.render('sign-up', {
            pageName: 'Create yor account in TechJobMarket',
            tagLine: 'Start publishing your vacancies for free, you just have to create an account',
            messages: req.flash(),    
        })
        return;
    }

    next();
}

exports.signInForm = (req, res) => {
    res.render('sign-in', {
        pageName: 'SignIn to TechJobMarket'
    })
}

