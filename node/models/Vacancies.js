const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const slug = require('slug')
const shortid = require('shortid')

const VacanciesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: 'Title is required',
        trim: true
    },
    company: {
        type: String,
        trim:true
    },
    location: {
        type: String,
        trim: true,
        required: 'Location is required'
    },
    salary: {
        type: String,
        default: 0,
        trim: true,
    },
    contract: {
        type:String,
        trim:true
    },
    description: {
        type: String,
        trim: true
    },
    url: {
        type: String,
        lowercase: true
    },
    skills: [String],
    candidates: [{
        name: String,
        email: String,
        cv: String
    }],
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: 'Author is required'
    }
})

VacanciesSchema.pre('save', function(next) {
    const url = slug(this.title)
    this.url = `${url}-${shortid.generate()}`

    next();
})

VacanciesSchema.index({title: 'text'})

module.exports = mongoose.model('Vacancy', VacanciesSchema)