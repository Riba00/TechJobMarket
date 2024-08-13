const express = require('express')
const router = express.Router();
const homeController = require('../controllers/homeController')
const usersController = require('../controllers/usersController')
const vacanciesController = require('../controllers/vacanciesController')
const authController = require('../controllers/authController')

module.exports = () => {
    router.get('/', homeController.showJobs)

    router.get('/vacancies/new', vacanciesController.newVacancyForm)
    router.post('/vacancies/new', vacanciesController.storeVacancy)

    router.get('/vacancies/:url', vacanciesController.showVacancy)

    router.get('/vacancies/edit/:url', vacanciesController.editVacancy)
    router.post('/vacancies/edit/:url', vacanciesController.updateVacancy)


    router.get('/signUp', usersController.signUpForm)
    router.post('/signUp', usersController.validateRegister, usersController.signUp)

    router.get('/signIn', usersController.signInForm)
    router.post('/signIn', authController.authenticateUser)

    return router
}