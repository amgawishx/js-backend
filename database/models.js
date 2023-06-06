const crypto = require('crypto');
const { universitySchema, tutorSchema,
    studentSchema, subjectSchema, classSchema } = require('./schemas.js');
const mongoose = require('mongoose');

/* Declaring top-level models, other models/submodels are created
via their methods. */

const Class = mongoose.model('Class', classSchema);
const University = mongoose.model('University', universitySchema);
const Tutor = mongoose.model('Tutor', tutorSchema);
const Student = mongoose.model('Student', studentSchema);
const Subject = mongoose.model('Subject', subjectSchema);

/**
 * A class for modeling a Pbkdf2 hash object.
 */
class Pbkdf2 extends Object {
    /**
     * @constructor
     * @param {String|Buffer} password - A string or a buffer to hash.
     * @param {Number} salt_size  - The salt size for the hash, default 64 bytes.
     * @param {Number} iterations - Number of iterations of hashing, default 10000.
     * @param {String} digest - Hashing algorithm to be used, default sha256.
     * @param {Number} key_len - Max length used of the produced hash, default 64 chars.
     */
    constructor(password, salt_size = 64, iterations = 10 ** 4,
        digest = 'sha256', key_len = 64) {
        super();
        if (password) {
            this.salt = crypto.randomBytes(salt_size);
            this.hash = crypto.pbkdf2Sync(password, this.salt, iterations,
                key_len, digest);
            this.iterations = iterations;
            this.digest = digest;
            this.key_len = key_len;
        } else {
            throw SyntaxError("Password is required for hashing.")
        }
    }
    /**
     * A method used to return the standard string representation of pbkdf2.
     */
    stringify() {
        return `${this.salt.toString('hex')}$${this.hash.toString('hex')}\
$${this.iterations}$${this.key_len}$${this.digest}`;
    }
    /**
     * A method used for equating two Pbkdf2 hashes.
     * @param {Pbkdf2} password 
     */
    validate(password) {
        let hash = crypto.pbkdf2Sync(password, this.salt, this.iterations,
            this.key_len, this.digest).toString('hex');
        return hash == this.hash.toString('hex');
    }
    /**
     * A static method of the class to parse a pbkdf2 string to Pbkdf2 object.
     * @param {String} hash 
     */
    static parse(hash) {
        let hashed = hash.split('$');
        let new_hash = new Pbkdf2();
        new_hash.salt = Buffer.from(hashed[0], 'hex');
        new_hash.hash = Buffer.from(hashed[1], 'hex');
        new_hash.iterations = Number(hashed[2]);
        new_hash.key_len = Number(hashed[3]);
        new_hash.digest = hashed[4];
        return new_hash;
    }
}

/* Exporting models to be used in the api. */
module.exports = {
    pbkdf2: Pbkdf2,
    student: Student,
    university: University,
    tutor: Tutor,
    subject: Subject,
    class: Class,
}