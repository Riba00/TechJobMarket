const mongoose = require('mongoose')
const Vacancy = mongoose.model('Vacancy')

exports.newVacancyForm = (req, res) => {
    res.render('new-vacancy', {
        pageName: 'New Vacancy',
        tagLine: 'Fill out the form and publish your vacancy',
        logOut: true,
        name: req.user.name
    })
}

exports.storeVacancy = async (req, res) => {
    const vacancy = new Vacancy(req.body)

    vacancy.author = req.user._id

    vacancy.skills = req.body.skills.split(',')

    const newVacancy = await vacancy.save()

    res.redirect(`/vacancies/${newVacancy.url}`)
}

exports.showVacancy = async (req, res) => {

    const vacancy = await Vacancy.findOne({ url: req.params.url}).lean()

    if (!vacancy) {
        return next()
    }

    res.render('vacancy', {
        vacancy,
        pageName: vacancy.title,
        bar: true
    })
}

exports.editVacancy = async (req, res, next) => {

    const vacancy = await Vacancy.findOne({url: req.params.url}).lean()

    if (!vacancy) return next();

    res.render('edit-vacancy', {
        vacancy,
        pageName: `Edit - ${vacancy.title}`,
        logOut: true,
        name: req.user.name
    })
}

exports.updateVacancy = async (req, res, next) => {
    const updatedVacancy = req.body;

    updatedVacancy.skills = req.body.skills.split(',');

    const vacancy = await Vacancy.findOneAndUpdate({url: req.params.url}, updatedVacancy, {
        new: true,
        runValidators: true
    })

    res.redirect(`/vacancies/${vacancy.url}`)
}