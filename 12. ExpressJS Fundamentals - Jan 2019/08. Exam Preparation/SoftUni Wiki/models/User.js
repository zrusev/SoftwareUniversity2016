const mongoose = require('mongoose');
const encryption = require('../util/encryption');
const message = require('../common/message');

const userSchema = new mongoose.Schema({
    email: {
        type: mongoose.Schema.Types.String,
        required: [true, message.requiredEmail],
        unique: true,
        validate: { 
            validator : function(v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: message.validEmail 
        },
    },
    hashedPass: {
        type: mongoose.Schema.Types.String,
        required: true,
        validate: {
            validator: function(v) {
                const emptyPassword = encryption.generateHashedPassword(this.salt, '');
                return this.hashedPass !== emptyPassword;
            },
            message: message.requiredPassword
        },
    },
    salt: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    roles: [{
        type: mongoose.Schema.Types.String
    }]
});

userSchema.method({
    authenticate: function (password) {
        return encryption.generateHashedPassword(this.salt, password) === this.hashedPass;
    },
    isInRole: function (role) {
        return this.roles.indexOf(role) !== -1;
    }
    // isAuthor: function (article) {
    //     if (!article) {
    //         return false;
    //     }
    //     let isAuthor = article.author.equals(this.id);
    //     return isAuthor;
    // }
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

const User = mongoose.model('User', userSchema);

User.seedAdminUser = async () => {
    try {
        let users = await User.find();
        if (users.length > 0) return;

        const salt = encryption.generateSalt();
        const hashedPass = encryption.generateHashedPassword(salt, 'admin');

        return User.create({
            email: 'admin@admin.com',
            salt,
            hashedPass,
            roles: ['Admin']
        });
    } catch (err) {
        console.log(err);
    }
};

module.exports = User;