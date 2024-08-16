const mongoose = require("mongoose");
const Vacancy = mongoose.model("Vacancy");

exports.newVacancyForm = (req, res) => {
  res.render("new-vacancy", {
    pageName: "New Vacancy",
    tagLine: "Fill out the form and publish your vacancy",
    logOut: true,
    name: req.user.name,
    photo: req.user.photo
  });
};

exports.storeVacancy = async (req, res) => {
  const vacancy = new Vacancy(req.body);

  vacancy.author = req.user._id;

  vacancy.skills = req.body.skills.split(",");

  const newVacancy = await vacancy.save();

  res.redirect(`/vacancies/${newVacancy.url}`);
};

exports.showVacancy = async (req, res) => {
  const vacancy = await Vacancy.findOne({ url: req.params.url }).populate('author').lean();

  if (!vacancy) {
    return next();
  }

  res.render("vacancy", {
    vacancy,
    pageName: vacancy.title,
    bar: true,
  });
};

exports.editVacancy = async (req, res, next) => {
  const vacancy = await Vacancy.findOne({ url: req.params.url }).lean();

  if (!vacancy) return next();

  res.render("edit-vacancy", {
    vacancy,
    pageName: `Edit - ${vacancy.title}`,
    logOut: true,
    name: req.user.name,
    photo: req.user.photo
  });
};

exports.updateVacancy = async (req, res, next) => {
  const updatedVacancy = req.body;

  updatedVacancy.skills = req.body.skills.split(",");

  const vacancy = await Vacancy.findOneAndUpdate(
    { url: req.params.url },
    updatedVacancy,
    {
      new: true,
      runValidators: true,
    }
  );

  res.redirect(`/vacancies/${vacancy.url}`);
};

exports.deleteVacancy = async (req, res) => {
  const { id } = req.params;

  const vacancy = await Vacancy.findById(id)
  
  if (verifyAuthor(vacancy, req.user)) {
    
    await vacancy.deleteOne();
    res.status(200).send('Vacancy has been deleted successfully!')
  } else {
    res.status(403).send('Forbidden')
  }

  
}

const verifyAuthor = (vacancy = {}, user = {}) => {
  if (!vacancy.author.equals(user._id)) {
    return false
  }
  return true
}

exports.validateVacancy = (req, res, next) => {
  req.sanitizeBody("title").escape();
  req.sanitizeBody("company").escape();
  req.sanitizeBody("location").escape();
  req.sanitizeBody("salary").escape();
  req.sanitizeBody("contract").escape();
  req.sanitizeBody("skills").escape();

  req.checkBody("title", "Title is required").notEmpty();
  req.checkBody("company", "Company is required").notEmpty();
  req.checkBody("location", "Location is required").notEmpty();
  req.checkBody("contract", "Select contract type").notEmpty();
  req.checkBody("skills", "Select al least 1 skill").notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    req.flash(
      "error",
      errors.map((error) => error.msg)
    );

    res.render("new-vacancy", {
      pageName: "New Vacancy",
      tagLine: "Fill out the form and publish your vacancy",
      logOut: true,
      name: req.user.name,
      messages: req.flash(),
    });

    return;
  }

  next();
};
