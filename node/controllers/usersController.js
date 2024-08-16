const mongoose = require('mongoose')
const Users = mongoose.model('Users')
const multer = require('multer')
const shortid = require('shortid')

exports.uploadPhoto = (req, res, next) => {
    upload(req, res, function(error) {
        if (error) {
            console.log(error);
            if (error instanceof multer.MulterError) {
                if (error.code === 'LIMIT_FILE_SIZE') {
                    req.flash('error', 'File too large: Max 100Kb')
                } else {
                    req.flash('error', error.message)
                }
            } else {
                req.flash('error', error.message)
            }
            res.redirect('/administration');
            return
        } else {
            return next();
        }
    });
    
}

const configurationMulter = {
    limits : {
        fileSize: 100000
    },
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname+ '../../public/uploads/profiles')
        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortid.generate()}.${extension}`)
        }
    }),
    fileFilter(req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
            cb(null, true)
        } else {
            cb(new Error('Invalid format'), false)
        }
    },
    
}

const upload = multer(configurationMulter).single('photo');

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
        pageName: 'Sign In to TechJobMarket'
    })
}

exports.editProfileForm = (req, res) => {

    res.render('edit-profile', {
        pageName: 'Edit you profile in TechJobMarket',
        user: req.user.toObject(),
        logOut: true,
        name: req.user.name,
        photo: req.user.photo
    })
}

exports.editProfile = async (req, res) => {
    const user = await Users.findById(req.user._id)

    user.name = req.body.name
    user.email = req.body.email
    if (req.body.password) {
        user.password = req.body.password
    }

    if (req.file) {
        user.photo = req.file.filename
    }

    await user.save()

    req.flash('correcto', 'User saved successfully')

    res.redirect('/administration')
}

exports.validateProfile = (req, res, next) => {
    req.sanitizeBody('name').escape();
    req.sanitizeBody('email').escape();
    if (req.body.password) {
        req.sanitizeBody('password')
    }

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        req.flash('error', errors.map(error =>error.msg))
        res.render('edit-profile', {
            pageName: 'Edit you profile in TechJobMarket',
            user: req.user.toObject(),
            logOut: true,
            name: req.user.name,
            photo: req.user.photo,
            messages: req.flash()
        })
    }

    next()
}
