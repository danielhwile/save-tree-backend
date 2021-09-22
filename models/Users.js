const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      dropDups: true
    },
    password: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    }
});

module.exports = mongoose.model('User', userSchema);