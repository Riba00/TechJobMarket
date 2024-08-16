const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const usersController = require("../controllers/usersController");
const vacanciesController = require("../controllers/vacanciesController");
const authController = require("../controllers/authController");

module.exports = () => {
  router.get("/", homeController.showJobs);

  router.get(
    "/vacancies/new",
    authController.verifyUser,
    vacanciesController.newVacancyForm
  );
  router.post(
    "/vacancies/new",
    authController.verifyUser,
    vacanciesController.validateVacancy,
    vacanciesController.storeVacancy
  );

  router.get("/vacancies/:url", vacanciesController.showVacancy);

  router.get(
    "/vacancies/edit/:url",
    authController.verifyUser,
    vacanciesController.editVacancy
  );
  router.post(
    "/vacancies/edit/:url",
    authController.verifyUser,
    vacanciesController.updateVacancy
  );

  router.delete("/vacancies/delete/:id", vacanciesController.deleteVacancy);

  router.get("/signUp", usersController.signUpForm);
  router.post(
    "/signUp",
    usersController.validateRegister,
    usersController.signUp
  );

  router.get("/signIn", usersController.signInForm);
  router.post("/signIn", authController.authenticateUser);

  router.get("/logOut", authController.verifyUser, authController.logOut);

  router.get(
    "/administration",
    authController.verifyUser,
    authController.showPanel
  );

  router.get(
    "/edit-profile",
    authController.verifyUser,
    usersController.editProfileForm
  );
  router.post(
    "/edit-profile",
    authController.verifyUser,
    usersController.validateProfile,
    usersController.uploadPhoto,
    usersController.editProfile
  );

  router.post('/vacancies/:url',
    vacanciesController.uploadCV,
    vacanciesController.contact
  )

  router.get('/candidates/:id', 
    authController.verifyUser,
    vacanciesController.showCandidates
  )

  return router;
};
