const mongoose = require('mongoose');
const userSchema = require('./schema');

module.exports = mongoose.model('user', userSchema);
