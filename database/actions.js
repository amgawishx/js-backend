/**
 * A student's method for registering self to an existing class.
 * @memberof Student
 * @param {Class} class_model -  The model representing the Class collection.
 */
async function registerClass(class_model) {
    try {
        class_model.students.push(this);
        let res = await class_model.save();
        return res;
    } catch (err) {
        console.error(err);
        return err;
    }
}

/**
 * A tutor's method for creating a new class within a subject.
 * @memberof Tutor
 * @param {Object} class_object - The object describing the class schema.
 * @param {Subject} subject_model -  The model representing the Subject collection.
 */
async function addClass(class_object) {
    try {
        let new_class = new Class(class_object);
        new_class.tutors.push(this);
        await this.save();
        this.parent().classes.push(new_class);
        let res = await subject_model.save();
        return res;
    } catch (err) {
        console.error(err);
        return err;
    }
}

/**
 * A tutor's method for creating a new course item within a class.
 * @memberof Tutor
 * @param {Object} item_object - The object describing the item schema.
 */
async function addCourseItem(jsonRequest) {
    try {
        item_object = jsonRequest['item'];
        type = jsonRequest['type'];
        let parent_class = this.parent();
        parent_class.courses[type].push(item_object);
        let res = await parent_class.save();
        return res;
    } catch (err) {
        console.error(err);
        return err;
    }
}

/**
 * A private utility function to be used as a skeleton for adding common misc fields.
 * @memberof Tutor
 * @param {String} string - A string to be inserted.
 * @param {String} field - Field values, allowed values:
 * - announcements
 * - assignments
 * - notes
 */
async function _coreAddString(string, field) {
    try {
        let parent_class = this.parent();
        parent_class[field].push(string);
        let res = await parent_class.save();
        return res;
    } catch (err) {
        throw err;
    }
}

/**
 * A tutor's method for adding an announcement.
 * @memberof Tutor
 * @param {String} announcement - An announcement string to be added.
 */
async function addAnnoucement(announcement) {
    try {
        return await this._coreAddString(announcement, 'announcements');
    }
    catch (err) {
        console.error(err);
        return err;
    }
}

/**
 * A tutor's method for adding an assignmet.
 * @memberof Tutor
 * @param {String} assignment - An assignment string to be added.
 */
async function addAssignment(assignment) {
    try {
        return await this._coreAddString(assignment, 'assignments');
    }
    catch (err) {
        console.error(err);
        return err;
    }
}

/**
 * A tutor's method for adding a note.
 * @memberof Tutor
 * @param {String} note - A note string to be added.
 */
async function addNote(note) {
    try {
        return await this._coreAddString(note, 'notes');
    }
    catch (err) {
        console.error(err);
        return err;
    }
}

/* Exporting actions to be embedded within models. */
module.exports = {
    _coreAddString: _coreAddString,
    registerClass: registerClass,
    addAnnoucement: addAnnoucement,
    addAssignment: addAssignment,
    addClass: addClass,
    addCourseItem: addCourseItem,
    addNote: addNote
}
