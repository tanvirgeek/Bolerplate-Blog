const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

const userSchema = mongoose.Schema({
    firstname: {
        type: String,
        maxlength: 50,
        required: true
    },
    email: {
        type: String,
        maxlength: 50,
        required: true
    },
    password: {
        type: String,
        minlenght: 5,
        required: true
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0,
    },
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }

});
userSchema.pre('save', function (next){
    var user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err);
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);
                user.password = hash;
                next();
            });
        });
    }else{
        next();
    }
})

userSchema.methods.comparePassword = async function(plainPassword, cb){
    await bcrypt.compare(plainPassword, this.password, function(err, result) {
        if(err) return cb(err);
        cb(null, result)
    });
}

userSchema.methods.generateToken = function(cb){
    var user = this;
    var token = jwt.sign({
        data: user._id.toHexString()
      }, 'secret', { expiresIn: 60 * 60 });
    user.token = token;

    user.save(function(err, user){
        if(err) return (cb(err));
        cb(null, user);
    })
}

module.exports = mongoose.model('User', userSchema);