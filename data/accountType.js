var mongoose = require("mongoose");

var AccountType = mongoose.model('accounttypes', new mongoose.Schema({
    AccountTypeCode :String,
    Description     :String
}));

module.exports = AccountType;
