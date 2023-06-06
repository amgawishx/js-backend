const mongoose = require('mongoose');
const actions = require('./actions.js');

/* Defining document schemas */
const departmentSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        uppercase: true,
        select: true,
    },
    name: {
        type: String,
        required: true,
    }
});

const collegeSchema = new mongoose.Schema({
    ...departmentSchema.obj, // Inherting fields from department schema.
    departments: [departmentSchema]
});

const universitySchema = new mongoose.Schema({
    ...departmentSchema.obj, // Inherting fields from department schema.
    colleges: [collegeSchema]
});

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        index: true,
        select: true,
    },
    last_name: {
        type: String,
        required: true,
        index: true,
        select: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        match: /@*.edu/, // RegExp to ensure email sanity.

    },
    password: {
        type: String,
        required: true,
        match: /\$*\$*\$*/, // RegExp to ensure password sanity.
    },
    gender: {
        type: String,
        required: true,
        match: /[MFmf]/,
    },
    birth_date: {
        type: Date,
        required: true,
    },
    email_status: {
        type: Boolean,
        default: false,
    },
    registration: {
        type: Number,
        required: true,
        select: true,
    },
    session: {
        type: String,
        default: null,
    },
    university: universitySchema,
    college: collegeSchema,
    department: departmentSchema,
});

const studentSchema = new mongoose.Schema({
    ...userSchema.obj, // Inherting fields from user schema.
    semester: {
        type: Number,
        required: true,
        min: 1,
        max: 14,
    }
});

const tutorSchema = new mongoose.Schema({
    ...userSchema.obj, // Inherting fields from user schema.
    position: {
        type: String,
        required: true,
    }
});

const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    }
});

const courseScehma = new mongoose.Schema({
    lectures: {
        type: [itemSchema],
        default: [],
    },
    sections: {
        type: [itemSchema],
        default: [],
    },
    labs: {
        type: [itemSchema],
        default: [],
    },
});

const classSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true,
    },
    students: {
        type: [studentSchema],
        default: [],
    },
    tutors: {
        type: [tutorSchema],
        required: true,
    },
    course: {
        type: courseScehma,
        default: null
    },
    announcements: {
        type: [String],
        default: [],
    },
    assignments: {
        type: [String],
        default: [],
    },
    notes: {
        type: [String],
        default: [],
    }
});

const subjectSchema = new mongoose.Schema({
    department: {
        type: departmentSchema,
        required: true,
        index: true,
        select: true,
    },
    number: {
        type: Number,
        required: true,
        min: 100,
        max: 999,
        select: true,
    },
    description: {
        type: String,
        required: true,
    },
    classes: {
        type: [classSchema],
        default: [],
    },
    courses: {
        type: [courseScehma],
        default: [],
    }
});

/* Adding actions to user models. */
studentSchema.methods.registerClass = actions.registerClass;
tutorSchema.methods._coreAddString = actions._coreAddString;
tutorSchema.methods.addClass = actions.addClass;
tutorSchema.methods.addAnnouncement = actions.addAnnoucement;
tutorSchema.methods.addCourseItem = actions.addCourseItem;
tutorSchema.methods.addAssignment = actions.addAssignment;
tutorSchema.methods.addNote = actions.addNote;

/* Exporting schemas to be used in models. */
module.exports = {
    studentSchema: studentSchema,
    subjectSchema: subjectSchema,
    classSchema: classSchema,
    collegeSchema: collegeSchema,
    departmentSchema: departmentSchema,
    itemSchema: itemSchema,
    tutorSchema: tutorSchema,
    universitySchema: universitySchema,
    userSchema: userSchema,
    courseScehma: courseScehma,
}

