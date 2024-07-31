const mongoose = require('mongoose')
const Vacancy = mongoose.model('Vacancy')


exports.showJobs = async (req, res, next) => {

    const vacancies = await Vacancy.find().lean();

    if (!vacancies) {
        return next()
    }


    res.render('home', {
        pageName: 'TechJobMarket',
        tagLine: 'Find and post jobs for Web Developers',
        bar: true,
        button: true,
        vacancies
    })
}